import { useEffect, useMemo, useState } from 'react';
import { RespirationLab } from './components/respiration/RespirationLab';
import { PhotosynthesisLab } from './components/photosynthesis/PhotosynthesisLab';
import { HomeostasisLab } from './components/homeostasis/HomeostasisLab';
import { ControlCoordinationLab } from './components/control/ControlCoordinationLab';
import { PracticeQuiz } from './components/quiz/PracticeQuiz';
import { SyllabusRoadmap } from './components/roadmap/SyllabusRoadmap';
import { TopicQuickNotes } from './components/notes/TopicQuickNotes';
import { QUIZ_QUESTIONS } from './data/syllabusData';
import { TopicId } from './types/syllabus';

type ActiveTab = TopicId | 'mixed-quiz';
type TopicSectionMode = 'diagrams' | 'quiz' | 'notes';

const STORAGE_KEY = 'bio9700_quiz_answers_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('respiration');
  const [topicMode, setTopicMode] = useState<TopicSectionMode>('diagrams');
  const [answeredMap, setAnsweredMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Record<string, number>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answeredMap));
    } catch {
      // Ignore storage quota errors
    }
  }, [answeredMap]);

  const handleAnswerQuestion = (questionId: string, selectedIndex: number) => {
    setAnsweredMap((prev) => ({
      ...prev,
      [questionId]: selectedIndex,
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

  return (
    <div className="min-h-screen lab-canvas-bg text-slate-900 flex flex-col">
      {/* Strict 3-Zone Top Bar */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 py-4">
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

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
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
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 sm:px-8 py-6 sm:py-8 space-y-6">
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
              <span>Cambridge A2 9700</span>
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
              {topicMode === 'quiz' && (
                <PracticeQuiz
                  title="Topic 12: Energy and Respiration — 9700 Practice Quiz"
                  questions={activeTopicQuestions}
                  answeredMap={answeredMap}
                  onAnswerQuestion={handleAnswerQuestion}
                  onResetTopicQuiz={handleResetQuizIds}
                />
              )}
              {topicMode === 'notes' && <TopicQuickNotes topicId="respiration" />}
            </>
          )}

          {activeTab === 'photosynthesis' && (
            <>
              {topicMode === 'diagrams' && <PhotosynthesisLab />}
              {topicMode === 'quiz' && (
                <PracticeQuiz
                  title="Topic 13: Photosynthesis — 9700 Practice Quiz"
                  questions={activeTopicQuestions}
                  answeredMap={answeredMap}
                  onAnswerQuestion={handleAnswerQuestion}
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
              {topicMode === 'quiz' && (
                <PracticeQuiz
                  title="Topic 14: Homeostasis — 9700 Practice Quiz"
                  questions={activeTopicQuestions}
                  answeredMap={answeredMap}
                  onAnswerQuestion={handleAnswerQuestion}
                  onResetTopicQuiz={handleResetQuizIds}
                />
              )}
              {topicMode === 'notes' && <TopicQuickNotes topicId="homeostasis" />}
            </>
          )}

          {activeTab === 'control' && (
            <>
              {topicMode === 'diagrams' && <ControlCoordinationLab />}
              {topicMode === 'quiz' && (
                <PracticeQuiz
                  title="Topic 15: Control and Coordination — 9700 Practice Quiz"
                  questions={activeTopicQuestions}
                  answeredMap={answeredMap}
                  onAnswerQuestion={handleAnswerQuestion}
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
          <span>Progress saved locally in your browser</span>
        </div>
      </footer>
    </div>
  );
}
