export type TopicId =
  | 'respiration'
  | 'photosynthesis'
  | 'control'
  | 'roadmap';

export type QuizDifficulty = 'Core Recall' | 'Application & Data';

export interface QuizQuestion {
  id: string;
  topicId: 'respiration' | 'photosynthesis' | 'control';
  syllabusRef: string;
  difficulty: QuizDifficulty;
  prompt: string;
  contextNote?: string;
  options: string[];
  correctIndex: number;
  hint: string;
  markSchemeExplanation: string;
  keyTerms: string[];
}

export interface SyllabusModuleMeta {
  id: string;
  code: string;
  title: string;
  shortLabel: string;
  status: 'active' | 'planned';
  summary: string;
  subtopics: string[];
  accentColor: string;
}

export interface TopicProgress {
  answeredIds: string[];
  correctIds: string[];
  lastAttemptAt?: string;
}
