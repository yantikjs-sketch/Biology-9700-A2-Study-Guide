import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyRound, User } from 'lucide-react';
import { RespirationLab } from './components/respiration/RespirationLab';
import { PhotosynthesisLab } from './components/photosynthesis/PhotosynthesisLab';
import { HomeostasisLab } from './components/homeostasis/HomeostasisLab';
import { ControlCoordinationLab } from './components/control/ControlCoordinationLab';
import { PracticeQuiz } from './components/quiz/PracticeQuiz';
import { RevisionQuestionsPanel } from './components/quiz/RevisionQuestionsPanel';
import { SyllabusRoadmap } from './components/roadmap/SyllabusRoadmap';
import { TopicQuickNotes } from './components/notes/TopicQuickNotes';
import { LoginPage } from './components/auth/LoginPage';
import { AccountModal } from './components/auth/AccountModal';
import { useAuth } from './context/AuthContext';
import { QUIZ_QUESTIONS } from './data/syllabusData';
import { REVISION_QUESTIONS } from './data/revisionQuestionsData';
import { ChapterTopicId, TopicId } from './types/syllabus';

type ActiveTab = TopicId | 'mixed-quiz';
type TopicSectionMode = 'diagrams' | 'revision' | 'quiz' | 'notes';

const STORAGE_KEY_PREFIX = 'bio9700_quiz_answers_v1';
const REVISION_STORAGE_PREFIX = 'bio9700_revision_v1';
const CHAPTER_TOPICS: ChapterTopicId[] = [
  'respiration',
  'photosynthesis',
  'homeostasis',
  'control',
];

function getUserStorageKey(uid?: string) {
  return uid ? `${STORAGE_KEY_PREFIX}_${uid}` : STORAGE_KEY_PREFIX;
}

function getUserRevisionKey(uid?: string) {
  return uid ? `${REVISION_STORAGE_PREFIX}_${uid}` : REVISION_STORAGE_PREFIX;
}

export default function App() {
  const {
    user,
    authReady,
    profile,
    profileLoading,
    cloudSyncReady,
    emailVerified,
    hasPasswordProvider,
    loadCloudProgress,
    saveCloudProgress,
    loadCloudRevision,
    saveCloudRevision,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('respiration');
  const [topicMode, setTopicMode] = useState<TopicSectionMode>('diagrams');
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [answeredMap, setAnsweredMap] = useState<Record<string, number>>({});
  const [revisionResponses, setRevisionResponses] = useState<
    Record<string, string>
  >({});
  const [revisionSubmittedMap, setRevisionSubmittedMap] = useState<
    Record<string, boolean>
  >({});
  const cloudHydratedUidRef = useRef<string | null>(null);

  // Load local quiz & revision answers scoped to current user when user changes
  useEffect(() => {
    if (!user) {
      setAnsweredMap({});
      setRevisionResponses({});
      setRevisionSubmittedMap({});
      cloudHydratedUidRef.current = null;
      return;
    }
    try {
      const saved = localStorage.getItem(getUserStorageKey(user.uid));
      setAnsweredMap(saved ? (JSON.parse(saved) as Record<string, number>) : {});
    } catch {
      setAnsweredMap({});
    }
    try {
      const savedRev = localStorage.getItem(getUserRevisionKey(user.uid));
      if (savedRev) {
        const parsed = JSON.parse(savedRev) as {
          responses?: Record<string, string>;
          submittedMap?: Record<string, boolean>;
        };
        setRevisionResponses(parsed.responses ?? {});
        setRevisionSubmittedMap(parsed.submittedMap ?? {});
      } else {
        setRevisionResponses({});
        setRevisionSubmittedMap({});
      }
    } catch {
      setRevisionResponses({});
      setRevisionSubmittedMap({});
    }
  }, [user]);

  // Hydrate from Firestore once verified cloud sync is ready
  useEffect(() => {
    if (!user || !cloudSyncReady) return;
    if (cloudHydratedUidRef.current === user.uid) return;
    cloudHydratedUidRef.current = user.uid;

    let cancelled = false;
    void (async () => {
      const [cloudAnswers, cloudRevisions] = await Promise.all([
        loadCloudProgress(),
        Promise.all(CHAPTER_TOPICS.map((topicId) => loadCloudRevision(topicId))),
      ]);
      if (cancelled) return;
      if (cloudAnswers) {
        setAnsweredMap((prev) => ({
          ...cloudAnswers,
          ...prev,
        }));
      }
      const mergedResponses: Record<string, string> = {};
      const mergedSubmitted: Record<string, boolean> = {};
      for (const rev of cloudRevisions) {
        if (rev) {
          Object.assign(mergedResponses, rev.responses);
          Object.assign(mergedSubmitted, rev.submittedMap);
        }
      }
      if (
        Object.keys(mergedResponses).length > 0 ||
        Object.keys(mergedSubmitted).length > 0
      ) {
        setRevisionResponses((prev) => ({ ...mergedResponses, ...prev }));
        setRevisionSubmittedMap((prev) => ({ ...mergedSubmitted, ...prev }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, cloudSyncReady, loadCloudProgress, loadCloudRevision]);

  // Persist quiz answers locally and sync to Firestore when verified
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(
        getUserStorageKey(user.uid),
        JSON.stringify(answeredMap),
      );
    } catch {
      // Ignore storage quota errors
    }

    if (!cloudSyncReady) return;
    const totalCorrect = QUIZ_QUESTIONS.reduce((acc, q) => {
      return answeredMap[q.id] === q.correctIndex ? acc + 1 : acc;
    }, 0);

    const timer = window.setTimeout(() => {
      void saveCloudProgress(answeredMap, totalCorrect);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [answeredMap, user, cloudSyncReady, saveCloudProgress]);

  // Persist structured revision answers locally and sync active chapter to Firestore
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(
        getUserRevisionKey(user.uid),
        JSON.stringify({
          responses: revisionResponses,
          submittedMap: revisionSubmittedMap,
        }),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [revisionResponses, revisionSubmittedMap, user]);

  const syncTopicRevisionToCloud = (
    topicId: ChapterTopicId,
    nextResponses: Record<string, string>,
    nextSubmitted: Record<string, boolean>,
  ) => {
    if (!user || !cloudSyncReady) return;
    const chapterIds = new Set(
      REVISION_QUESTIONS.filter((q) => q.topicId === topicId).map((q) => q.id),
    );
    const topicResponses: Record<string, string> = {};
    const topicSubmitted: Record<string, boolean> = {};
    for (const id of chapterIds) {
      if (nextResponses[id]) topicResponses[id] = nextResponses[id];
      if (nextSubmitted[id]) topicSubmitted[id] = true;
    }
    void saveCloudRevision(topicId, topicResponses, topicSubmitted);
  };

  const handleAnswerQuestion = (questionId: string, selectedIndex: number) => {
    setAnsweredMap((prev) => ({
      ...prev,
      [questionId]: selectedIndex,
    }));
  };

  const handleAnswerBatch = (entries: Record<string, number>) => {
    setAnsweredMap((prev) => ({
      ...prev,
      ...entries,
    }));
  };

  const handleResetQuizIds = (questionIds: string[]) => {
    setAnsweredMap((prev) => {
      const next = { ...prev };
      for (const id of questionIds) {
        delete next[id];
      }
      return next;
    });
  };

  const handleChangeRevisionResponse = (questionId: string, value: string) => {
    setRevisionResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitRevisionQuestion = (
    topicId: ChapterTopicId,
    questionId: string,
  ) => {
    const nextSubmitted = {
      ...revisionSubmittedMap,
      [questionId]: true,
    };
    setRevisionSubmittedMap(nextSubmitted);
    syncTopicRevisionToCloud(topicId, revisionResponses, nextSubmitted);
  };

  const handleSubmitAllRevisionDrafted = (
    topicId: ChapterTopicId,
    questionIds: string[],
  ) => {
    const nextSubmitted = { ...revisionSubmittedMap };
    for (const id of questionIds) {
      nextSubmitted[id] = true;
    }
    setRevisionSubmittedMap(nextSubmitted);
    syncTopicRevisionToCloud(topicId, revisionResponses, nextSubmitted);
  };

  const handleResetRevisionQuestion = (
    topicId: ChapterTopicId,
    questionId: string,
  ) => {
    const nextSubmitted = { ...revisionSubmittedMap };
    delete nextSubmitted[questionId];
    setRevisionSubmittedMap(nextSubmitted);
    syncTopicRevisionToCloud(topicId, revisionResponses, nextSubmitted);
  };

  const handleResetAllRevision = (
    topicId: ChapterTopicId,
    questionIds: string[],
  ) => {
    const nextResponses = { ...revisionResponses };
    const nextSubmitted = { ...revisionSubmittedMap };
    for (const id of questionIds) {
      delete nextResponses[id];
      delete nextSubmitted[id];
    }
    setRevisionResponses(nextResponses);
    setRevisionSubmittedMap(nextSubmitted);
    syncTopicRevisionToCloud(topicId, nextResponses, nextSubmitted);
  };

  const handleSelectTopicFromRoadmap = (topicId: TopicId, openQuiz = false) => {
    setActiveTab(topicId);
    if (topicId !== 'roadmap') {
      setTopicMode(openQuiz ? 'quiz' : 'diagrams');
    }
  };

  const activeTopicQuestions = useMemo(() => {
    if (
      activeTab === 'respiration' ||
      activeTab === 'photosynthesis' ||
      activeTab === 'homeostasis' ||
      activeTab === 'control'
    ) {
      return QUIZ_QUESTIONS.filter((q) => q.topicId === activeTab);
    }
    return QUIZ_QUESTIONS;
  }, [activeTab]);

  const activeTopicRevisionQuestions = useMemo(() => {
    if (
      activeTab === 'respiration' ||
      activeTab === 'photosynthesis' ||
      activeTab === 'homeostasis' ||
      activeTab === 'control'
    ) {
      return REVISION_QUESTIONS.filter((q) => q.topicId === activeTab);
    }
    return [];
  }, [activeTab]);

  const activeTopicStats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    for (const q of activeTopicQuestions) {
      if (answeredMap[q.id] !== undefined) {
        answered += 1;
        if (answeredMap[q.id] === q.correctIndex) correct += 1;
      }
    }
    return { answered, correct, total: activeTopicQuestions.length };
  }, [activeTopicQuestions, answeredMap]);

  if (!authReady || (user && profileLoading && !profile)) {
    return (
      <div className="min-h-screen lab-canvas-bg flex items-center justify-center p-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm text-center space-y-2">
          <p className="font-display text-lg font-bold text-slate-900">
            Bio9700 Revision
          </p>
          <p className="text-sm text-slate-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen lab-canvas-bg text-slate-900 flex flex-col">
      {/* Strict 3-Zone Top Bar */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 sm:gap-6 px-4 sm:px-8 py-4">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('respiration');
              setTopicMode('diagrams');
            }}
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            Bio9700 Revision
          </button>

          {/* Zone 2: Concise single-line Topic Tabs */}
          <nav
            aria-label="A2 Biology 9700 syllabus topics"
            className="flex items-center gap-6 sm:gap-8 overflow-x-auto text-base font-medium"
          >
            <button
              type="button"
              onClick={() => setActiveTab('respiration')}
              className={`whitespace-nowrap shrink-0 border-b-2 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                activeTab === 'respiration'
                  ? 'border-blue-700 text-blue-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              12. Respiration
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('photosynthesis')}
              className={`whitespace-nowrap shrink-0 border-b-2 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                activeTab === 'photosynthesis'
                  ? 'border-emerald-700 text-emerald-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              13. Photosynthesis
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('homeostasis')}
              className={`whitespace-nowrap shrink-0 border-b-2 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                activeTab === 'homeostasis'
                  ? 'border-teal-700 text-teal-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              14. Homeostasis
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('control')}
              className={`whitespace-nowrap shrink-0 border-b-2 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                activeTab === 'control'
                  ? 'border-violet-700 text-violet-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              15. Control
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('roadmap')}
              className={`whitespace-nowrap shrink-0 border-b-2 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                activeTab === 'roadmap'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              9700 Roadmap
            </button>
          </nav>

          {/* Zone 3: Synoptic Quiz & Account Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('mixed-quiz')}
              className={`whitespace-nowrap shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                activeTab === 'mixed-quiz'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              Synoptic Quiz
            </button>

            <button
              type="button"
              onClick={() => setAccountModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
              title="Account & Password Settings"
            >
              <User className="h-4 w-4 text-slate-600 shrink-0" />
              <span className="max-w-[110px] truncate font-semibold">
                {profile?.displayName || user.email}
              </span>
              <span
                className={`hidden sm:inline text-xs font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                  profile?.accountType === 'teacher'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-blue-50 text-blue-800'
                }`}
              >
                {profile?.accountType === 'teacher' ? 'Teacher' : 'Student'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {(!hasPasswordProvider || !emailVerified) && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200/90 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-xs">
            <div className="flex items-center gap-2.5">
              <KeyRound className="h-4 w-4 text-blue-700 shrink-0" />
              <span>
                {!hasPasswordProvider
                  ? 'Signed in with Google. Want to create your own personal password for email sign-in?'
                  : 'Check your inbox to verify your email and enable cloud quiz sync across devices.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAccountModalOpen(true)}
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
            >
              {!hasPasswordProvider ? 'Create Password' : 'Verify / Account'}
            </button>
          </div>
        )}

        {(activeTab === 'respiration' ||
          activeTab === 'photosynthesis' ||
          activeTab === 'homeostasis' ||
          activeTab === 'control') && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-white/95 px-4 py-3 shadow-xs">
            <div
              className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
              role="tablist"
              aria-label="Topic section mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={topicMode === 'diagrams'}
                onClick={() => setTopicMode('diagrams')}
                className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  topicMode === 'diagrams'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Interactive Diagrams
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={topicMode === 'revision'}
                onClick={() => setTopicMode('revision')}
                className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  topicMode === 'revision'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Revision Questions ({activeTopicRevisionQuestions.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={topicMode === 'quiz'}
                onClick={() => setTopicMode('quiz')}
                className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  topicMode === 'quiz'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Practice Quiz ({activeTopicQuestions.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={topicMode === 'notes'}
                onClick={() => setTopicMode('notes')}
                className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  topicMode === 'notes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Syllabus Summary
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span>
                {profile?.accountType === 'teacher'
                  ? 'Teacher Mode'
                  : 'Cambridge A2 9700'}
                {profile?.classCode ? ` · ${profile.classCode}` : ''}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                Quiz Mastery: {activeTopicStats.correct}/{activeTopicStats.total}
              </span>
            </div>
          </div>
        )}

        {/* Active Content Render */}
        <div key={`${activeTab}-${topicMode}`} className="animate-fade-slide-in">
          {activeTab === 'respiration' && (
            <>
              {topicMode === 'diagrams' && <RespirationLab />}
              {topicMode === 'revision' && (
                <RevisionQuestionsPanel
                  subtitle="Chapter 12 · Cambridge 9700 Paper 4 Structured Revision"
                  title="Energy and Respiration — Revision Questions"
                  questions={activeTopicRevisionQuestions}
                  responses={revisionResponses}
                  submittedMap={revisionSubmittedMap}
                  onChangeResponse={handleChangeRevisionResponse}
                  onSubmitQuestion={(qId) =>
                    handleSubmitRevisionQuestion('respiration', qId)
                  }
                  onSubmitAllDrafted={(qIds) =>
                    handleSubmitAllRevisionDrafted('respiration', qIds)
                  }
                  onResetQuestion={(qId) =>
                    handleResetRevisionQuestion('respiration', qId)
                  }
                  onResetAll={(qIds) =>
                    handleResetAllRevision('respiration', qIds)
                  }
                />
              )}
              {topicMode === 'quiz' && (
                <PracticeQuiz
                  title="Topic 12: Energy and Respiration — 9700 Practice Quiz"
                  questions={activeTopicQuestions}
                  answeredMap={answeredMap}
                  onAnswerQuestion={handleAnswerQuestion}
                  onAnswerBatch={handleAnswerBatch}
                  onResetTopicQuiz={handleResetQuizIds}
                />
              )}
              {topicMode === 'notes' && <TopicQuickNotes topicId="respiration" />}
            </>
          )}

          {activeTab === 'photosynthesis' && (
            <>
              {topicMode === 'diagrams' && <PhotosynthesisLab />}
              {topicMode === 'revision' && (
                <RevisionQuestionsPanel
                  subtitle="Chapter 13 · Cambridge 9700 Paper 4 Structured Revision"
                  title="Photosynthesis — Revision Questions"
                  questions={activeTopicRevisionQuestions}
                  responses={revisionResponses}
                  submittedMap={revisionSubmittedMap}
                  onChangeResponse={handleChangeRevisionResponse}
                  onSubmitQuestion={(qId) =>
                    handleSubmitRevisionQuestion('photosynthesis', qId)
                  }
                  onSubmitAllDrafted={(qIds) =>
                    handleSubmitAllRevisionDrafted('photosynthesis', qIds)
                  }
                  onResetQuestion={(qId) =>
                    handleResetRevisionQuestion('photosynthesis', qId)
                  }
                  onResetAll={(qIds) =>
                    handleResetAllRevision('photosynthesis', qIds)
                  }
                />
              )}
              {topicMode === 'quiz' && (
                <PracticeQuiz
                  title="Topic 13: Photosynthesis — 9700 Practice Quiz"
                  questions={activeTopicQuestions}
                  answeredMap={answeredMap}
                  onAnswerQuestion={handleAnswerQuestion}
                  onAnswerBatch={handleAnswerBatch}
                  onResetTopicQuiz={handleResetQuizIds}
                />
              )}
              {topicMode === 'notes' && (
                <TopicQuickNotes topicId="photosynthesis" />
              )}
            </>
          )}

          {activeTab === 'homeostasis' && (
            <>
              {topicMode === 'diagrams' && <HomeostasisLab />}
              {topicMode === 'revision' && (
                <RevisionQuestionsPanel
                  subtitle="Chapter 14 · Cambridge 9700 Paper 4 Structured Revision"
                  title="Homeostasis — Revision Questions"
                  questions={activeTopicRevisionQuestions}
                  responses={revisionResponses}
                  submittedMap={revisionSubmittedMap}
                  onChangeResponse={handleChangeRevisionResponse}
                  onSubmitQuestion={(qId) =>
                    handleSubmitRevisionQuestion('homeostasis', qId)
                  }
                  onSubmitAllDrafted={(qIds) =>
                    handleSubmitAllRevisionDrafted('homeostasis', qIds)
                  }
                  onResetQuestion={(qId) =>
                    handleResetRevisionQuestion('homeostasis', qId)
                  }
                  onResetAll={(qIds) =>
                    handleResetAllRevision('homeostasis', qIds)
                  }
                />
              )}
              {topicMode === 'quiz' && (
                <PracticeQuiz
                  title="Topic 14: Homeostasis — 9700 Practice Quiz"
                  questions={activeTopicQuestions}
                  answeredMap={answeredMap}
                  onAnswerQuestion={handleAnswerQuestion}
                  onAnswerBatch={handleAnswerBatch}
                  onResetTopicQuiz={handleResetQuizIds}
                />
              )}
              {topicMode === 'notes' && <TopicQuickNotes topicId="homeostasis" />}
            </>
          )}

          {activeTab === 'control' && (
            <>
              {topicMode === 'diagrams' && <ControlCoordinationLab />}
              {topicMode === 'revision' && (
                <RevisionQuestionsPanel
                  subtitle="Chapter 15 · Cambridge 9700 Paper 4 Structured Revision"
                  title="Control and Coordination — Revision Questions"
                  questions={activeTopicRevisionQuestions}
                  responses={revisionResponses}
                  submittedMap={revisionSubmittedMap}
                  onChangeResponse={handleChangeRevisionResponse}
                  onSubmitQuestion={(qId) =>
                    handleSubmitRevisionQuestion('control', qId)
                  }
                  onSubmitAllDrafted={(qIds) =>
                    handleSubmitAllRevisionDrafted('control', qIds)
                  }
                  onResetQuestion={(qId) =>
                    handleResetRevisionQuestion('control', qId)
                  }
                  onResetAll={(qIds) => handleResetAllRevision('control', qIds)}
                />
              )}
              {topicMode === 'quiz' && (
                <PracticeQuiz
                  title="Topic 15: Control and Coordination — 9700 Practice Quiz"
                  questions={activeTopicQuestions}
                  answeredMap={answeredMap}
                  onAnswerQuestion={handleAnswerQuestion}
                  onAnswerBatch={handleAnswerBatch}
                  onResetTopicQuiz={handleResetQuizIds}
                />
              )}
              {topicMode === 'notes' && <TopicQuickNotes topicId="control" />}
            </>
          )}

          {activeTab === 'roadmap' && (
            <SyllabusRoadmap
              answeredMap={answeredMap}
              onSelectTopic={handleSelectTopicFromRoadmap}
            />
          )}

          {activeTab === 'mixed-quiz' && (
            <div className="space-y-4">
              <div className="border-b border-slate-300/70 pb-4">
                <p className="text-sm font-medium text-slate-600">
                  Topics 12, 13, 14 &amp; 15 Combined · Paper 1 &amp; Paper 4 Style
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Synoptic A2 Biology Practice Quiz
                </h1>
              </div>
              <PracticeQuiz
                title="Respiration, Photosynthesis, Homeostasis & Coordination Challenge"
                questions={QUIZ_QUESTIONS}
                answeredMap={answeredMap}
                onAnswerQuestion={handleAnswerQuestion}
                onAnswerBatch={handleAnswerBatch}
                onResetTopicQuiz={handleResetQuizIds}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200/90 bg-white/90 backdrop-blur-md py-4">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-2 px-4 sm:px-8 text-sm text-slate-600">
          <span>
            Cambridge International A Level Biology (9700) · Topics 12–15
          </span>
          <span>
            {cloudSyncReady
              ? 'Quiz progress synced to your account'
              : 'Progress saved locally in your browser'}
          </span>
        </div>
      </footer>

      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </div>
  );
}
