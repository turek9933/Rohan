import * as FileSystem from 'expo-file-system';
import { Task, TaskMetadata, Subtask, Attachment,  } from './Task';
import { parse } from '@babel/core';

function isMarkdownFile(fileUri: string): boolean {
    return fileUri.endsWith('.md');
}

function isJsonFile(fileUri: string): boolean {
    return fileUri.endsWith('.json');
}

export function splitRawContent(fileContent: string): string[] {
    return fileContent
        .trim()
        .split(/\n##\s+/)//Spliting by "## "
        .map(task => task.replace(/^##\s*/, "").trim());//Deleting "## " from tasks
}

function parseMetadata(metadata: string): TaskMetadata {
    const id = parseInt(metadata.match(/id:\s*(\d+)/)?.[1] || '0');
    const status = metadata.includes('status: [x]');
    const startDate = metadata.includes('start:') ? metadata.match(/start:\s*([d-]+)/)?.[1] : metadata.match(/rozpoczęcie:\s*([d-]+)/)?.[1];
    const deadline = metadata.includes('deadline:') ? metadata.match(/deadline:\s*([d-]+)/)?.[1] : metadata.match(/termin:\s*([d-]+)/)?.[1];
    const reward = metadata.includes('reward:') ? parseInt(metadata.match(/reward:\s*(\d+)/)?.[1] || '0') : parseInt(metadata.match(/nagroda:\s*(\d+)/)?.[1] || '0');

    return {
        id: id.toString(),
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        reward,
    };
}

export function parseSubtasks(subtasks: string): Subtask[] {

    // Extracting via matchAll method to get all subtasks in array.
    // Array includes items, where
    // item[0] is the whole line
    // item[1] is the completed status - space or x
    // item[2] is the title
    const matches = subtasks.matchAll(/^\s*- \[( |x)] (.*)/gm);
    const arr = [...matches];
    let result: Subtask[] = [];
    
    for (let i = 0; i < arr.length; i++) {
        const match = arr[i];
        const completed = match[1] === 'x';
        const title = match[2].trim();
        result.push({ title, completed });
    }

    return result;
}

function attachmentType(path: string): 'file' | 'image' | 'audio' {
    const extension = path.split('.').pop();

    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'image';
        case 'mp3':
        case 'wav':
        case 'ogg':
            return 'audio';
        default:
            return 'file';
    }
}


export function parseAttachments(attachments: string): Attachment[] {
    const lines = attachments.split('\n');
    const regexInline = /- !\[(.*?)\]\((.*?)\)/;
    const regexList = /- (.*?): `(.*?)`/;
    let result: Attachment[] = [];
    for (const line of lines) {
        const match = line.includes('![') ? line.match(regexInline) : line.match(regexList);
        if (match) {
            const altText = match[1];
            const path = match[2];
            const type = attachmentType(path);
            result.push({ path, type, altText, inline: line.includes('![') });
        }
    }
    console.log(result);
    return result;
}

//TODO
export async function importTask(fileUri: string): Promise<Task[]> {
    try {
        const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: 'utf8' });
        const tasks = splitRawContent(fileContent);
        return [];
    } catch (error) {
        console.error("Error reading file", error);
        return [];
    }
}


parseSubtasks(`- [ ] Zadanie 1\n- [x] Zadanie 2\n       - [ ] Zadanie 3`);