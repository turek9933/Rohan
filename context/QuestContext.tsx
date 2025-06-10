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
  updateQuestMetadata
} from '@/api/questApi';
import { useAuthContext } from '@/context/AuthContext';

interface QuestContextType {
  Quests: Quest[];
  addQuest: (Quest: Omit<Quest, 'metadata'> & { metadata: Omit<QuestMetadata, 'id'> }) => Promise<void>;
  removeQuest: (id: string) => void;
  toggleQuestStatus: (id: string) => void;
  updateSubQuests: (QuestId: string, subQuests: SubQuest[]) => void;
  updateQuestDetails: (QuestId: string, updates: Partial<QuestMetadata>) => void;
  resetQuests: () => void;
  addSampleQuests: (userId: string) => void;
  completedQuestsCount: number;
  totalQuestsCount: number;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export function QuestProvider({ children }: { children: ReactNode }) {
  const [Quests, setQuests] = useState<Quest[]>([]);
  const { user } = useAuthContext()!;

  useEffect(() => {
    if (!user) {
      setQuests([]);
      return;
    }
    getQuestsByUser(user.uid).then((Quests) => {
      setQuests(Quests);
    });
  }, [user]);

  const resetQuests = () => {
    if (!user) {
      console.error('[QuestContext] No user.');
      return;
    }
    const userId = user.uid;
    deleteAllQuestsByUser(userId);
    setQuests([]);
  };

  const addQuest = async (QuestData: Omit<Quest, 'metadata'> & { metadata: Omit<QuestMetadata, 'id'> }) => {
    if (!user) {
      console.error('[QuestContext] No user.');
      return;
    }
    
    const ownerId = user.uid;
    console.warn('[QuestContext] USER ID:', ownerId);
    try {
      const QuestId = await addQuestToFirebase({
        ...QuestData,
        ownerId
      });
      
      const fullQuest: Quest = {
        ...QuestData,
        metadata: {
          ...QuestData.metadata,
          id: QuestId
        }
      };

      setQuests((prev) => [...prev, fullQuest]);
    } catch (error) {
      console.error('Error adding Quest to Firestore:', error);
    }
  };

  const removeQuest = (id: string) => {
    deleteQuest(id);
    setQuests((prev) => prev.filter((Quest) => Quest.metadata.id !== id));
  };

  const toggleQuestStatus = (id: string) => {
    const QuestToUpdate = Quests.find((Quest) => Quest.metadata.id === id);
    if (!QuestToUpdate) return;
    
    const newStatus = !QuestToUpdate.metadata.status;
    updateQuestStatus(id, newStatus);
    setQuests((prev) =>
      prev.map((Quest) =>
        Quest.metadata.id === id 
          ? { ...Quest, metadata: { ...Quest.metadata, status: newStatus } } 
          : Quest
      )
    );
  };

  const updateSubQuests = (QuestId: string, subQuests: SubQuest[]) => {
    updateQuestSubQuests(QuestId, subQuests);
    setQuests((prev) =>
      prev.map((Quest) =>
        Quest.metadata.id === QuestId 
          ? { ...Quest, subQuests } 
          : Quest
      )
    );
  };

  const updateQuestDetails = (QuestId: string, updates: Partial<QuestMetadata>) => {
    updateQuestMetadata(QuestId, updates);
    setQuests((prev) =>
      prev.map((Quest) =>
        Quest.metadata.id === QuestId 
          ? { ...Quest, metadata: { ...Quest.metadata, ...updates } } 
          : Quest
      )
    );
  };

  const addSampleQuests = async (userId: string) => {    
    const sampleQuests = [
      {
        title: 'Ukończ projekt React Native',
        description: 'Zaimplementuj wszystkie wymagane funkcjonalności aplikacji mobilnej',
        metadata: {
          status: false,
          startDate: new Date(),
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),// next week
          reward: 500
        },
        subQuests: [
          { title: 'Stwórz interfejs użytkownika', completed: true },
          { title: 'Przetestuj aplikację', completed: false }
        ]
      },
      {
        title: 'Learn TypeScript',
        description: 'Get thgough the basics of TypeScript during the weekend course',
        metadata: {
          status: true,
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),// 2 weeks ago
          deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),// tomorrow
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
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),// next month
          reward: 100
        }
      }
    ];

    for (const Quest of sampleQuests) {
      await addQuestToFirebase({
        ...Quest,
        ownerId: userId
      });
    }
    
    const updatedQuests = await getQuestsByUser(userId);
    setQuests(updatedQuests);
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
      updateQuestDetails,
      resetQuests,
      addSampleQuests,
      completedQuestsCount,
      totalQuestsCount
    }}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuestContext() {
  return useContext(QuestContext);
}