import * as FileSystem from 'expo-file-system';
import { Quest, QuestMetadata, SubQuest } from '@/types/Quest';
import { QuestFormData } from '@/types/QuestFormData';
import YAML from 'yaml';
import { Platform } from 'react-native';

function parseDate(date?: string | Date): Date | undefined {
  if (!date) return undefined;
  if (date instanceof Date) return date;
  
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) return parsed;

  const isoParsed = new Date(date + 'T00:00:00');
  if (!isNaN(isoParsed.getTime())) return isoParsed;

  return undefined;
}

function extractMetadata(content: string): QuestMetadata {
  const metadataMatch = content.match(/<!--([\s\S]*?)-->/);

  if (!metadataMatch) {
    return {
      id: '',
      status: false,
    };
  }

  try {
    let raw = metadataMatch[1].trim();
    if (raw.startsWith('metadata:')) {
      raw = raw.slice('metadata:'.length);
    }

    
    let parsed: any;
    
    if (raw.includes(',') && !raw.includes('\n')) {
      const yamlLines = raw.split(',').map(pair => {
        const [key, value] = pair.split(':').map(s => s.trim());
        return `${key}: ${value}`;
      }).join('\n');
      parsed = YAML.parse(yamlLines);
    } else {
      parsed = YAML.parse(raw);
    }

    const startDate = parsed.start || parsed.rozpoczenie;
    const deadline = parsed.deadline || parsed.termin;
    
    return {
      id: parsed.id?.toString() || '',
      status: Array.isArray(parsed.status) ? parsed.status.includes('x') : parsed.status === 'x',
      startDate: parseDate(startDate),
      deadline: parseDate(deadline),
      reward: parsed.reward || parsed.nagroda || undefined
    };
  } catch (error) {
    console.warn('Metadata parsing failed:', error);
    return {
      id: '',
      status: false,
    };
  }
}

function extractTitle(content: string): string {
  const match = content.match(/^##\s*(.+)$/m);
  return match?.[1]?.trim() || '';
}

function extractDescription(content: string): string {
  const match = content.match(/(?:Description|Opis):\s*([^\n\r]+)/i);
  return match?.[1]?.trim() || '';
}

function parseSubQuests(content: string): SubQuest[] {
  const sectionMatch = content.match(/(?:SubQuests|SubTasks|Subquests|SubTasks||Podzadania|PodMisje|Podmisje|):\s*\r?\n([\s\S]*?)(?=\r?\n#+\s|\r?\n?$)/i);
  if (!sectionMatch) return [];

  const subquestLines = sectionMatch[1].replace(/\r/g, '').split('\n');

  return subquestLines
    .map(line => {
      const match = line.match(/^-\s*\[([ xX])\]\s*(.+)$/);
      if (!match) return null;
      return {
        completed: match[1].toLowerCase() === 'x',
        title: match[2].trim()
      };
    })
    .filter((q): q is SubQuest => q !== null);
}


// Convert Quest to QuestFormData for adding
function questToFormData(quest: Omit<Quest, 'metadata'> & { metadata: Omit<QuestMetadata, 'id'> }): QuestFormData {
  return {
    title: quest.title,
    description: quest.description || '',
    subQuests: quest.subQuests || [],
    attachments: quest.attachments || [],
    enableNotifications: false,//TODO add notifications
    startDate: quest.metadata.startDate,
    deadline: quest.metadata.deadline,
    reward: quest.metadata.reward?.toString() || ''
  };
}

export async function importQuest(fileUri: string): Promise<QuestFormData[]> {
  try {
    let content: string;
    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      content = await response.text();
    } else {
      content = await FileSystem.readAsStringAsync(fileUri);
    }

    if (!content.trim()) {
      console.warn('Empty file content');
      return [];
    }

    const questSections = content.split(/(?=^##\s)/m).filter(section => section.trim());

    const imported = questSections
      .map((section) => {
        try {
          // ID and attachments are ignored
          const fullMetadata = extractMetadata(section);
          const { id: _, ...metadataWithoutId } = fullMetadata;

          const quest = {
            metadata: metadataWithoutId,
            title: extractTitle(section),
            description: extractDescription(section),
            subQuests: parseSubQuests(section),
            attachments: []
          };

          if (!quest.title.trim()) {
            console.warn('Quest without title found, skipping');
            return null;
          }

          return questToFormData(quest);
        } catch (error) {
          console.error('Error parsing quest section:', error);
          return null;
        }
      })
      .filter((quest): quest is QuestFormData => quest !== null);

    return imported;
  } catch (error) {
    console.error('Error importing quests:', error);
    throw new Error(`Failed to import quest: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


export async function importSingleQuest(fileUri: string): Promise<QuestFormData | null> {
  const quests = await importQuest(fileUri);
  return quests.length > 0 ? quests[0] : null;
}