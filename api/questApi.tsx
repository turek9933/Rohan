import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { Quest, QuestMetadata, SubQuest } from '@/types/Quest';

const QUESTS_COLLECTION = 'quests';

export const loadQuestsFromFirebase = async (): Promise<Quest[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, QUESTS_COLLECTION));
      const QuestsFromFirebase: Quest[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const Quest: Quest = {
          metadata: {
            id: doc.id,
            status: data.metadata.status,
            startDate: data.metadata.startDate?.toDate(),
            deadline: data.metadata.deadline?.toDate(),
            reward: data.metadata.reward,
          },
          title: data.title,
          description: data.description,
          subQuests: data.subQuests || [],
          attachments: data.attachments || [],
        };
        QuestsFromFirebase.push(Quest);
      });
      
      return QuestsFromFirebase;
    } catch (error) {
      console.error('[API loadQuestsFromFirebase] Error during data loading from Firestore:', error);
      return [];
    }
};

// Returns added Quest id
export const addQuestToFirebase = async (QuestData: {
    title: string;
    description?: string;
    metadata: Omit<QuestMetadata, 'id'>;
    subQuests?: SubQuest[];
    attachments?: any[];
    ownerId: string;
  }): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, QUESTS_COLLECTION), {
          title: QuestData.title,
          description: QuestData.description || null,
          metadata: {
            status: QuestData.metadata.status,
            startDate: QuestData.metadata.startDate || null,
            deadline: QuestData.metadata.deadline || null,
            reward: QuestData.metadata.reward || null,
          },
          subQuests: QuestData.subQuests || [],
          attachments: QuestData.attachments || [],
          ownerId: QuestData.ownerId,
          createdAt: new Date(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Save error to Firestore:', error);
        return '';
    }
};

export async function getQuestsByUser(userId: string): Promise<Quest[]> {
    try {
        const q = query(collection(db, QUESTS_COLLECTION), where('ownerId', '==', userId));
        const querySnapshot = await getDocs(q);

        const userQuests: Quest[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const Quest: Quest = {
                metadata: {
                    id: doc.id,
                    status: data.metadata.status,
                    startDate: data.metadata.startDate ? data.metadata.startDate.toDate() : undefined,
                    deadline: data.metadata.startDate ? data.metadata.startDate.toDate() : undefined,
                    reward: data.metadata.reward,
                },
                title: data.title,
                description: data.description,
                subQuests: data.subQuests || [],
                attachments: data.attachments || [],
            };
            userQuests.push(Quest);
        });
        return userQuests;
    } catch (error) {
        console.error('[getQuestsByUser] Downloading quest from Firestore error:', error);
        return [];
    }
}

export async function deleteQuest(id: string): Promise<void> {
    try {
        const docRef = doc(db, QUESTS_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('[deleteQuest] Error during deleting Quest from Firestore:', error);
    }
}

export async function updateQuestStatus(id: string, newStatus: boolean): Promise<void> {
    try {
        const docRef = doc(db, QUESTS_COLLECTION, id);
        await updateDoc(docRef, { 
            'metadata.status': newStatus,
        });
    } catch (error) {
        console.error('[updateQuestStatus] Error during updating Quest status:', error);
    }
}

export async function updateQuestSubQuests(id: string, subQuests: SubQuest[]): Promise<void> {
    try {
        const docRef = doc(db, QUESTS_COLLECTION, id);
        await updateDoc(docRef, { 
            subQuests: subQuests,
        });
    } catch (error) {
        console.error('[updateQuestSubQuests] Error during updating Quest subQuests:', error);
    }
}

export async function updateQuestMetadata(id: string, updates: Partial<QuestMetadata>): Promise<void> {
    try {
        const docRef = doc(db, QUESTS_COLLECTION, id);
        const updateData: any = { updatedAt: new Date() };
        
        //TODO
        Object.keys(updates).forEach(key => {
            if (key !== 'id') {
                updateData[`metadata.${key}`] = updates[key as keyof QuestMetadata];
            }
        });
        
        await updateDoc(docRef, updateData);
    } catch (error) {
        console.error('[updateQuestMetadata] Error during updating Quest metadata:', error);
    }
}

export async function deleteAllQuestsByUser(uid: string): Promise<void> {
    try {
        const q = query(collection(db, QUESTS_COLLECTION), where('ownerId', '==', uid));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return;
        }
        
        const deletePromises: Promise<void>[] = [];

        snapshot.forEach((documentSnapshot) => {
            const QuestRef = doc(db, QUESTS_COLLECTION, documentSnapshot.id);
            deletePromises.push(deleteDoc(QuestRef));
        });

        await Promise.all(deletePromises);
    } catch (error) {
        console.error('[deleteAllQuestsByUser] Error during deleting all Quests:', error);
    }
}