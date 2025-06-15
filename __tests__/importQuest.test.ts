import { 
  extractMetadata, 
  extractTitle, 
  extractDescription,
  parseSubQuests, 
  questToFormData
} from '@/utils/importQuest';

const md = `
## Test Quest

<!--
metadata:
  id: 1
  status: [x]
  start: 2025-01-01
  deadline: 2025-01-10
  reward: 100
-->

Opis: Przykładowy quest.


Subtasks:
- [ ] Pierwszy podquest
- [x] Drugi podquest
`;

test('extractTitle parses title', () => {
  expect(extractTitle(md)).toBe('Test Quest');
});

test('extractMetadata parses metadata', () => {
  const meta = extractMetadata(md);
  expect(meta?.id).toBe('1');
  expect(meta?.status).toBe(true);
  expect(meta?.startDate).toEqual(new Date('2025-01-01'));
  expect(meta?.deadline).toEqual(new Date('2025-01-10'));
  expect(meta?.reward).toBe(100);
});

test('extractDescription parses description', () => {
  expect(extractDescription(md)).toContain('Przykładowy quest');
});


test('parseSubQuests parses subtasks correctly', () => {
  const subs = parseSubQuests(md);
  expect(subs.length).toBe(2);
  expect(subs[0]).toEqual({ completed: false, title: 'Pierwszy podquest' });
  expect(subs[1]).toEqual({ completed: true, title: 'Drugi podquest' });
});

test('questToFormData converts quest object correctly', () => {
  const quest = {
    title: 'Test',
    description: 'Opis',
    subQuests: [{ title: 'Sub', completed: false }],
    attachments: [],
    metadata: {
      status: false,
      startDate: new Date('2025-01-01'),
      deadline: new Date('2025-01-10'),
      reward: 10,
    },
  };
  const formData = questToFormData(quest as any);
  expect(formData.title).toBe('Test');
  expect(formData.description).toBe('Opis');
  expect(formData.subQuests.length).toBe(1);
  expect(formData.metadata).toBeUndefined();// There is no metadata indeed
  expect(formData.reward).toBe('10');
});