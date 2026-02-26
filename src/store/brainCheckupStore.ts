import { atom } from 'jotai';
import { questions } from '../data/Questions';

// Helper to pick 5 random questions
export const getRandomQuestions = (allQuestions: string[]) => {
  return [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
};

// Generate initial state once
const initialQuestions: Record<string, string[]> = {};
Object.entries(questions.brain_checkup).forEach(([key, data]) => {
    initialQuestions[key] = getRandomQuestions(data.questions);
});

export const brainRegionQuestionsAtom = atom<Record<string, string[]>>(initialQuestions);

export const brainRegionAnswersAtom = atom<Record<string, number[]>>({
  PFC: [0, 0, 0, 0, 0],
  Amygdala: [0, 0, 0, 0, 0],
  ACC: [0, 0, 0, 0, 0],
  Hippocampus: [0, 0, 0, 0, 0],
  Cortisol: [0, 0, 0, 0, 0],
});
