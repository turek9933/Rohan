import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { Quest, QuestMetadata, SubQuest } from '@/types/Quest';
import { 
  loadQuestsFromFirebase, 
  addQuestToFirebase, 
  deleteQuest, 
  updateQuestStatus, 
  getQuestsByUser, 
  deleteAllQuestsByUser,
  updateQuestSubQuests,
  updateQuestMetadata,
  updateQuestDetailsToFirebase
} from '@/api/questApi';
import { useAuthContext } from '@/context/AuthContext';
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuestFormData } from '@/types/QuestFormData';

type PendingChange =
| {type: 'add', quest: Omit<Quest, 'metadata'> & { metadata: Omit<QuestMetadata, 'id'> }, tempId: string }
| {type: 'edit', id: string, updates: Partial<Quest>}
| {type: 'remove', id: string}
| {type: 'toggleStatus', id: string, newStatus: boolean}
| {type: 'updateQuestDetails', questId: string, updates: Partial<QuestFormData>}
| {type: 'updateSubQuests', questId: string, subQuests: SubQuest[]}
| {type: 'updateMetadata', questId: string, updates: Partial<QuestMetadata>};

interface QuestContextType {
  Quests: Quest[];
  addQuest: (Quest: Omit<Quest, 'metadata'> & { metadata: Omit<QuestMetadata, 'id'> }) => Promise<void>;
  removeQuest: (id: string) => void;
  toggleQuestStatus: (id: string) => void;
  updateSubQuests: (QuestId: string, subQuests: SubQuest[]) => void;
  toggleSubQuestStatus: (questId: string, subQuestIndex: number) => void;
  updateQuestDetails: (QuestId: string, updates: Partial<QuestFormData>) => void;
  resetQuests: () => void;
  refreshQuests: () => Promise<void>;
  addSampleQuests: (userId: string) => void;
  completedQuestsCount: number;
  totalQuestsCount: number;
  isOnline: boolean;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export function QuestProvider({ children }: { children: ReactNode }) {
  const [Quests, setQuests] = useState<Quest[]>([]);
  const { user } = useAuthContext()!;
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handling offline mode
  const [isOnline, setIsOnline] = useState(true);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const QUESTS_STORAGE_KEY = 'quests';
  const PENDING_CHANGES_KEY = 'pendingChanges';


  // Check internet connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !isOnline;
      const isNowOnline = !!state.isConnected;
      
      setIsOnline(isNowOnline);
      
      if (wasOffline && isNowOnline && user) {
        syncPendingChanges();
      }
    });
    return () => unsubscribe();
  }, [isOnline, user]);

  useEffect(() => {
    const loadQuests = async () => {
      const pending = await AsyncStorage.getItem(PENDING_CHANGES_KEY);
      setPendingChanges(pending ? JSON.parse(pending) : []);
      
      if (isOnline && user) {
        try {
          const questsFromFirebase = await getQuestsByUser(user.uid);
          setQuests(questsFromFirebase);
          await AsyncStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(questsFromFirebase));
        } catch (error) {
          console.error('Error loading quests from Firebase:', error);
          // If server is down, load quests from storage
          await loadQuestsFromStorage();
        }
      } else if (!isOnline && user) {
        await loadQuestsFromStorage();
      } else {
        setQuests([]);
      }
    };

    loadQuests();
  }, [isOnline, user]);

  const loadQuestsFromStorage = async () => {
    try {
      const storedQuests = await AsyncStorage.getItem(QUESTS_STORAGE_KEY);
      if (storedQuests) {
        setQuests(JSON.parse(storedQuests));
      }
    } catch (error) {
      console.error('Error loading quests from storage:', error);
    }
  };

  const saveQuestsToStorage = async (quests: Quest[]) => {
    try {
      await AsyncStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(quests));
    } catch (error) {
      console.error('Error saving quests to storage:', error);
    }
  };

  const savePendingChangesToStorage = async (changes: PendingChange[]) => {
    try {
      await AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(changes));
    } catch (error) {
      console.error('Error saving pending changes:', error);
    }
  };

  const addPendingChange = async (change: PendingChange) => {
    const newPendingChanges = [...pendingChanges, change];
    setPendingChanges(newPendingChanges);
    await savePendingChangesToStorage(newPendingChanges);
  };

  const removePendingChange = async (changeToRemove: PendingChange) => {
    const newPendingChanges = pendingChanges.filter(change => 
      !(change.type === changeToRemove.type && 
        ('id' in change && 'id' in changeToRemove ? change.id === changeToRemove.id : 
         'tempId' in change && 'tempId' in changeToRemove ? change.tempId === changeToRemove.tempId : false))
    );
    setPendingChanges(newPendingChanges);
    await savePendingChangesToStorage(newPendingChanges);
  };

  const syncPendingChanges = async () => {
    if (!user || pendingChanges.length === 0) return;

    for (const change of pendingChanges) {
      try {
        switch (change.type) {
          case 'add':
            const questId = await addQuestToFirebase({
              ...change.quest,
              ownerId: user.uid
            });
            
            // Update local quest with real ID
            setQuests(prev => prev.map(q => 
              q.metadata.id === change.tempId 
                ? { ...q, metadata: { ...q.metadata, id: questId } }
                : q
            ));
            break;

          case 'remove':
            await deleteQuest(change.id);
            break;

          case 'toggleStatus':
            await updateQuestStatus(change.id, change.newStatus);
            break;

          case 'updateQuestDetails':
            await updateQuestDetails(change.questId, change.updates);
            break;

          case 'updateSubQuests':
            await updateQuestSubQuests(change.questId, change.subQuests);
            break;

          case 'updateMetadata':
            await updateQuestMetadata(change.questId, change.updates);
            break;

          case 'edit':
            if (change.updates.metadata) {
              await updateQuestMetadata(change.id, change.updates.metadata);
            }
            if (change.updates.subQuests) {
              await updateQuestSubQuests(change.id, change.updates.subQuests);
            }
            break;
        }

        await removePendingChange(change);
        
      } catch (error) {
        console.error(`Error syncing change ${change.type}:`, error);
      }
    }

    try {
      const updatedQuests = await getQuestsByUser(user.uid);
      setQuests(updatedQuests);
      await saveQuestsToStorage(updatedQuests);
    } catch (error) {
      console.error('Error refreshing quests after sync:', error);
    }
  };

  const generateTempId = () => `temp_${Date.now()}`;

  const addQuest = async (QuestData: Omit<Quest, 'metadata'> & { metadata: Omit<QuestMetadata, 'id'> }) => {
    if (!user) {
      console.error('[QuestContext] No user.');
      return;
    }
    
    const ownerId = user.uid;
    const tempId = generateTempId();
    
    const fullQuest: Quest = {
      ...QuestData,
      metadata: {
        ...QuestData.metadata,
        id: tempId//Adding tempId for offline case
      }
    };

    const newQuests = [...Quests, fullQuest];
    setQuests(newQuests);
    await saveQuestsToStorage(newQuests);

    if (isOnline) {
      try {
        const QuestId = await addQuestToFirebase({
          ...QuestData,
          ownerId
        });
        
        const updatedQuest = { ...fullQuest, metadata: { ...fullQuest.metadata, id: QuestId } };
        const updatedQuests = newQuests.map(q => q.metadata.id === tempId ? updatedQuest : q);
        setQuests(updatedQuests);
        await saveQuestsToStorage(updatedQuests);

      } catch (error) {
        console.error('Error adding Quest to Firestore:', error);
        await addPendingChange({
          type: 'add',
          quest: QuestData,
          tempId
        });
      }
    } else {
      await addPendingChange({
        type: 'add',
        quest: QuestData,
        tempId
      });
    }
  };

  const removeQuest = async (id: string) => {
    const newQuests = Quests.filter((Quest) => Quest.metadata.id !== id);
    setQuests(newQuests);
    await saveQuestsToStorage(newQuests);

    if (isOnline) {
      try {
        await deleteQuest(id);
      } catch (error) {
        console.error('Error removing quest:', error);
        await addPendingChange({ type: 'remove', id });
      }
    } else {
      await addPendingChange({ type: 'remove', id });
    }
  };

  const toggleQuestStatus = async (id: string) => {
    const QuestToUpdate = Quests.find((Quest) => Quest.metadata.id === id);
    if (!QuestToUpdate) return;
    
    const newStatus = !QuestToUpdate.metadata.status;
    
    const newQuests = Quests.map((Quest) =>
      Quest.metadata.id === id 
        ? { ...Quest, metadata: { ...Quest.metadata, status: newStatus } } 
        : Quest
    );
    setQuests(newQuests);
    await saveQuestsToStorage(newQuests);

    if (isOnline) {
      try {
        await updateQuestStatus(id, newStatus);
      } catch (error) {
        console.error('Error updating quest status:', error);
        await addPendingChange({ type: 'toggleStatus', id, newStatus });
      }
    } else {
      await addPendingChange({ type: 'toggleStatus', id, newStatus });
    }
  };

  const updateSubQuests = async (QuestId: string, subQuests: SubQuest[]) => {
    const newQuests = Quests.map((Quest) =>
      Quest.metadata.id === QuestId 
        ? { ...Quest, subQuests } 
        : Quest
    );
    setQuests(newQuests);
    await saveQuestsToStorage(newQuests);

    if (isOnline) {
      try {
        await updateQuestSubQuests(QuestId, subQuests);
      } catch (error) {
        console.error('Error updating sub quests:', error);
        await addPendingChange({ type: 'updateSubQuests', questId: QuestId, subQuests });
      }
    } else {
      await addPendingChange({ type: 'updateSubQuests', questId: QuestId, subQuests });
    }
  };

  const updateQuestDetails = async (QuestId: string, updates: Partial<QuestFormData>) => {
    const newQuests = Quests.map((Quest) => {
      if (Quest.metadata.id !== QuestId) return Quest;

      return {
        ...Quest,
        title: updates.title ?? Quest.title,
        description: updates.description ?? Quest.description,
        subQuests: updates.subQuests ?? Quest.subQuests,
        attachments: updates.attachments ?? Quest.attachments,
        metadata: {
          ...Quest.metadata,
          startDate: updates.startDate ?? Quest.metadata.startDate,
          deadline: updates.deadline ?? Quest.metadata.deadline,
          reward: updates.reward !== undefined ? Number(updates.reward) : Quest.metadata.reward,
        }
      };
    });

    setQuests(newQuests);

    await saveQuestsToStorage(newQuests);

    if (isOnline) {
      try {
        await updateQuestDetailsToFirebase(QuestId, updates);
      } catch (error) {
        console.error('Error updating quest metadata:', error);
        await addPendingChange({ type: 'updateQuestDetails', questId: QuestId, updates });
      }
    } else {
      await addPendingChange({ type: 'updateQuestDetails', questId: QuestId, updates });
    }
  };

  const toggleSubQuestStatus = async (questId: string, subQuestIndex: number) => {
    const newQuests = Quests.map((quest) => {
      if (quest.metadata.id === questId && quest.subQuests) {
        const updatedSubQuests = [...quest.subQuests];
        if (updatedSubQuests[subQuestIndex]) {
          updatedSubQuests[subQuestIndex].completed = !updatedSubQuests[subQuestIndex].completed;
        }
        return { ...quest, subQuests: updatedSubQuests };
      }
      return quest;
    });
    
    setQuests(newQuests);
    await saveQuestsToStorage(newQuests);

    const updatedQuest = newQuests.find(q => q.metadata.id === questId);
    if (updatedQuest?.subQuests) {
      if (isOnline) {
        try {
          await updateQuestSubQuests(questId, updatedQuest.subQuests);
        } catch (error) {
          console.error('Error updating sub quest status:', error);
          await addPendingChange({ 
            type: 'updateSubQuests', 
            questId, 
            subQuests: updatedQuest.subQuests 
          });
        }
      } else {
        await addPendingChange({ 
          type: 'updateSubQuests', 
          questId, 
          subQuests: updatedQuest.subQuests 
        });
      }
    }
  };

  const resetQuests = async () => {
    if (!user) {
      console.error('[QuestContext] No user.');
      return;
    }
    
    setQuests([]);
    await saveQuestsToStorage([]);
    
    setPendingChanges([]);
    await savePendingChangesToStorage([]);
    
    if (isOnline) {
      try {
        await deleteAllQuestsByUser(user.uid);
      } catch (error) {
        console.error('Error resetting quests:', error);
      }
    }
  };

    const refreshQuests = async (): Promise<void> => {
    if (!user) {
      console.warn('[QuestContext] No user for refresh.');
      return;
    }

    setIsRefreshing(true);
    
    try {
      console.log('[QuestContext] Refreshing quests...');
      
      if (isOnline) {
        if (pendingChanges.length > 0) {
          await syncPendingChanges();
        }
        
        const freshQuests = await getQuestsByUser(user.uid);
        setQuests(freshQuests);
        await saveQuestsToStorage(freshQuests);
        
        console.log('[QuestContext] Quests refreshed successfully:', freshQuests.length);
      } else {
        await loadQuestsFromStorage();
        console.log('[QuestContext] Quests refreshed from storage (offline)');
      }
    } catch (error) {
      console.error('[QuestContext] Error refreshing quests:', error);
      await loadQuestsFromStorage();
    } finally {
      setIsRefreshing(false);
    }
  };

  const addSampleQuests = async (userId: string) => {    
    const sampleQuests = [
      {
        title: 'Ukończ projekt React Native',
        description: 'Zaimplementuj wszystkie wymagane funkcjonalności aplikacji mobilnej',
        metadata: {
          status: false,
          startDate: new Date(),
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          reward: 500
        },
        subQuests: [
          { title: 'Stwórz interfejs użytkownika', completed: true },
          { title: 'Przetestuj aplikację', completed: false }
        ]
      },
      {
        title: 'Learn TypeScript',
        description: 'Get through the basics of TypeScript during the weekend course',
        metadata: {
          status: true,
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          reward: 200
        },
        subQuests: [
          { title: 'Watch tutorial', completed: true },
          { title: 'Complete exercises', completed: true },
        ]
      },
      {
        title: 'Ripetere il vocabolario in italiano',
        description: 'Przećwicz zdania i słownictwo związane z wakacjami',
        metadata: {
          status: false,
          startDate: new Date(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          reward: 100
        }
      }
    ];

    for (const Quest of sampleQuests) {
      await addQuest(Quest);
    }
  };

  const completedQuestsCount = Quests.filter(Quest => Quest.metadata.status).length;
  const totalQuestsCount = Quests.length;

  return (
    <QuestContext.Provider value={{ 
      Quests,
      addQuest,
      removeQuest,
      toggleQuestStatus,
      updateSubQuests,
      toggleSubQuestStatus,
      updateQuestDetails,
      resetQuests,
      refreshQuests,
      addSampleQuests,
      completedQuestsCount,
      totalQuestsCount,
      isOnline,
    }}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuestContext() {
  return useContext(QuestContext);
}