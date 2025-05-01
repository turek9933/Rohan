import * as FileSystem from 'expo-file-system';
import { Task, TaskMetadata, Subtask, Attachment } from '@/utils/Task';
import YAML from 'yaml';
import { Platform } from 'react-native';

export function parseDate(date?: string): Date | undefined {
  return date ? new Date(date) : undefined;
}

export function extractMetadata(content: string): TaskMetadata | null {
  const metadataMatch = content.match(/<!--([\s\S]*?)-->/);

  if (!metadataMatch) return null;
  try {
    let raw = metadataMatch[1].trim();
    if (raw.startsWith('metadata:')) {
      raw = raw.trim().slice('metadata:'.length);
    }
    const parsed = YAML.parse(raw);
    const startDate = parsed.start || parsed.rozpoczenie;
    const deadline = parsed.deadline || parsed.termin;
    
    return {
      id: parsed.id?.toString() || '',
      status: Array.isArray(parsed.status) ? parsed.status.includes('x') : parsed.status === 'x',
      startDate: parseDate(startDate),
      deadline: parseDate(deadline),
      reward: Number(parsed.reward || parsed.nagroda) || 0
    };
  } catch (error) {
    console.warn('Metadata parsing failed:', error);
    return null;
  }
}

export function extractTitle(content: string): string {
  const titleMatch = content.match(/^##\s*(.+)$/m);
  return titleMatch?.[1]?.trim() || '';
}

export function extractDescription(content: string): string {
  const descMatch = content.match(/(?:Description|Opis):\s*([^\n]+)/);
  return descMatch?.[1]?.trim() || '';
}

export function parseSubtasks(content: string): Subtask[] {
  const subtasksSection = content.match(/(?:Subtasks|Podzadania):\r?\n([\s\S]*?)(?=\r?\n## |\r?\nAttachments|\r?\nZałączniki|$)/);
  if (!subtasksSection) return [];

  const subtaskLines = subtasksSection[1].replace(/\r/g, '').split('\n');
  return subtaskLines
    .map(line => {
      const match = line.match(/^-\s*\[([ x])\]\s*(.+)$/);
      if (!match) return null;
      return {
        completed: match[1] === 'x',
        title: match[2].trim()
      };
    })
    .filter((task): task is Subtask => task !== null);
}

export function getAttachmentType(path: string): 'image' | 'audio' | 'file' {
  const ext = path.toLowerCase().split('.').pop();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) return 'audio';
  return 'file';
}

function resolveAttachmentPath(path: string, baseDir: string): string {
  if (
    (/^(https?|data):\/\//.test(path)) ||
    (/^[a-zA-Z]:[\\/]/.test(path) || path.startsWith('/')) ||
    (path.startsWith('file://'))
  ) return path;

  const cleanBase = baseDir.replace(/\/+$/, '');
  const cleanRel = path.replace(/^\.?\/+/, '');
  return `${cleanBase}/${cleanRel}`;
}

// TODO
function normalizeFilename(uri: string): string {
  const name = uri.split('/').pop()?.split('.').shift() ?? 'import';
  return name.replace(/[^\w\-]/g, '_');
}

function getFilenameFromPath(path: string): string {
  return path.split(/[\\/]/).pop() ?? 'file';
}

// Returns unique filename by checking if file exists in directory and appending counter
async function getUniqueFilename(baseDir: string, filename: string): Promise<string> {
  const [name, ext = ''] = filename.split(/\.(?=[^.]+$)/);
  let result = filename;
  let counter = 1;

  while (await FileSystem.getInfoAsync(baseDir + result).then(f => f.exists)) {
    result = `${name}-${counter++}${ext ? '.' + ext : ''}`;
  }
  return result;
}

function isUrl(path: string): boolean {
  return /^https?:\/\//.test(path);
}
function isAbsolutePath(path: string): boolean {
  return isUrl(path) || /^[a-zA-Z]:[\\/]/.test(path) || path.startsWith('/') || path.startsWith('file://');
}


export async function parseAttachments(content: string, sourceUri: string): Promise<Attachment[]> {
  const attachmentsSection = content.match(/(?:Attachments|Załączniki):\r?\n([\s\S]*?)(?=\r?\n## |\r?\n?$)/);
  if (!attachmentsSection) return [];
  const attachmentLines = attachmentsSection[1].replace(/\r/g, '').split('\n');

  const importId = normalizeFilename(sourceUri);
  const destImportDir = `${FileSystem.documentDirectory}imports/${importId}/`;
  alert(destImportDir);
  const sourceDir = sourceUri.substring(0, sourceUri.lastIndexOf('/'));
  
  if (Platform.OS !== 'web') {
    await FileSystem.makeDirectoryAsync(destImportDir, { intermediates: true });
  }
  else {
    console.warn('Attachments import is not supported on web yet.');
  }
  const attachments: Attachment[] = [];
  
  for (const line of attachmentLines) {
    if (!line.trim()) continue;
    
    let match;
    let altText = '', originalPath = '', inline = false;

    if (match = line.match(/^-\s*!\[(.*?)\]\((.*?)\)$/)) {
      altText = match[1];
      originalPath = match[2];
      inline = true;
    } else if (match = line.match(/^-\s*(.*?):\s*`(.*?)`$/)) {
      altText = match[1];
      originalPath = match[2];
      inline = false;
    } else {
      continue;
    }

    //TODO
    let finalPath = originalPath;
    const filename = Platform.OS !== 'web' ? await getUniqueFilename(destImportDir, getFilenameFromPath(originalPath)) : getFilenameFromPath(originalPath);
    const destPath = Platform.OS !== 'web' ? `${destImportDir}${filename}` : `${destImportDir}${getFilenameFromPath(originalPath)}`;

    try {
      
      if (Platform.OS === 'web') {
        console.warn('Attachments import is not supported on web yet.\nOriginal paths will be used.');
        finalPath = originalPath;
      } else {
        if (isUrl(originalPath)) {
          await FileSystem.downloadAsync(originalPath, destPath);
        } else if (isAbsolutePath(originalPath)) {
          // alert(`AbsolutePath\t${originalPath}`);
          await FileSystem.copyAsync({ from: originalPath, to: destPath });
        } else {
          const relativePath = `${sourceDir}/${originalPath.replace(/^\.\//, '')}`;
          await FileSystem.copyAsync({ from: relativePath, to: destPath });
        }
        finalPath = destPath;
        alert(`FinalPath\t${finalPath}`);
      }
      attachments.push({
        altText,
        path: finalPath,
        type: getAttachmentType(finalPath),
        inline
      });
    } catch (e) {
      alert(`Error\t${e}`);
      console.warn('Failed to handle attachments import', originalPath, e);
      attachments.push({
        altText,
        path: originalPath,
        type: getAttachmentType(originalPath),
        inline
      })
    }
  }

  return attachments;
}






export async function importTask(fileUri: string): Promise<Task[]> {
  try {
    let content: string;
    console.warn(fileUri);
    if (Platform.OS === 'web') {
      // Web
      const response = await fetch(fileUri);
      content = await response.text();
    } else {
      // Mobile
      content = await FileSystem.readAsStringAsync(fileUri);
    }

    const tasks = content.split(/(?=^##\s)/m).filter(Boolean);

    return await Promise.all(
    tasks.map(async taskContent => {
      const metadata = extractMetadata(taskContent) || {
        id: Date.now().toString(),
        status: false,
        reward: 0
      };

      return {
        metadata,
        title: extractTitle(taskContent),
        description: extractDescription(taskContent),
        subtasks: parseSubtasks(taskContent),
        attachments: await parseAttachments(taskContent, fileUri),
      };
    }));
  } catch (error) {
    console.error('Error importing tasks:', error);
    return [];
  }
}