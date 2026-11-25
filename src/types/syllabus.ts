export type ChapterTopicId =
  | 'respiration'
  | 'photosynthesis'
  | 'homeostasis'
  | 'control'
  | 'inheritance';

export type TopicId = ChapterTopicId | 'roadmap';

export type QuizDifficulty = 'Core Recall' | 'Application & Data';

export interface QuizQuestion {
  id: string;
  topicId: ChapterTopicId;
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

export interface RevisionQuestion {
  id: string;
  topicId: ChapterTopicId;
  syllabusRef: string;
  commandWord: 'Explain' | 'Outline' | 'Describe' | 'Calculate' | 'Compare';
  marks: number;
  prompt: string;
  contextNote?: string;
  hint: string;
  markSchemePoints: string[];
  modelAnswer: string;
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
