import { splitRawContent, importTask, parseSubtasks, parseAttachments } from '../utils/importTask';
import * as FileSystem from 'expo-file-system';

afterEach(() => {
    jest.restoreAllMocks();
})

test('splitRawContent splits Markdown correctly', () => {
    const input = `## Task1\nSome description\n## Task2\nAnother description`;
    const result = splitRawContent(input);

    expect(result.length).toBe(2);
    expect(result[0]).toBe("Task1\nSome description");
    expect(result[1]).toBe("Task2\nAnother description");
});

// test('importTask reads and processes file correctly', async () => {
//     jest.spyOn(FileSystem, 'readAsStringAsync').mockResolvedValueOnce('## Task1\nDescription\n## Task2\nAnother description');

//     const tasks = await importTask('test.json');

//     expect(tasks.length).toBe(2);
//     expect(tasks[0]).toBe("Task1\nDescription");
//     expect(tasks[1]).toBe("Task2\nAnother description");
// });

test('parseSubtasks parses subtasks correctly', () => {
    const input = `- [ ] Zadanie 1
    - [x] Zadanie 2
           - [ ] Zadanie 3`;
    const result = parseSubtasks(input);

    expect(result.length).toBe(3);
    expect(result[0].title).toBe("Zadanie 1");
    expect(result[0].completed).toBe(false);
    expect(result[1].title).toBe("Zadanie 2");
    expect(result[1].completed).toBe(true);
    expect(result[2].title).toBe("Zadanie 3");
    expect(result[2].completed).toBe(false);
});

test('parseAttachments parses attachments correctly', () => {
    const input = `- Graphics concept: \`./images/uiConcept.png\`
    - Notification sound: \`./audio/notification.mp3\`      
        - ![Icon](icon.png)      
        - ![](lala.jpg)`     
    const result = parseAttachments(input);

    expect(result.length).toBe(4);

    expect(result[0].path).toBe("./images/uiConcept.png");
    expect(result[0].type).toBe("image");
    expect(result[0].altText).toBe("Graphics concept");
    expect(result[0].inline).toBe(false);

    expect(result[1].path).toBe("./audio/notification.mp3");
    expect(result[1].type).toBe("audio");
    expect(result[1].altText).toBe("Notification sound");
    expect(result[1].inline).toBe(false);

    expect(result[2].path).toBe("icon.png");
    expect(result[2].type).toBe("image");
    expect(result[2].altText).toBe("Icon");
    expect(result[2].inline).toBe(true);

    expect(result[3].path).toBe("lala.jpg");
    expect(result[3].type).toBe("image");
    expect(result[3].altText).toBe("");
    expect(result[3].inline).toBe(true);
})