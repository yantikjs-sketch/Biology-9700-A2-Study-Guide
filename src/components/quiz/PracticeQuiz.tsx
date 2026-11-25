import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Send,
  Lock,
} from 'lucide-react';
import { QuizDifficulty, QuizQuestion } from '../../types/syllabus';

interface PracticeQuizProps {
  title: string;
  questions: QuizQuestion[];
  answeredMap: Record<string, number>;
  onAnswerQuestion: (questionId: string, selectedIndex: number) => void;
  onAnswerBatch?: (entries: Record<string, number>) => void;
  onResetTopicQuiz: (questionIds: string[]) => void;
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({
  title,
  questions,
  answeredMap,
  onAnswerQuestion,
  onAnswerBatch,
  onResetTopicQuiz,
}) => {
  const [difficultyFilter, setDifficultyFilter] = useState<
    'All' | QuizDifficulty
  >('All');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [draftMap, setDraftMap] = useState<Record<string, number>>({});

  const filteredQuestions = useMemo(() => {
    if (difficultyFilter === 'All') return questions;
    return questions.filter((q) => q.difficulty === difficultyFilter);
  }, [questions, difficultyFilter]);

  const safeIndex = Math.min(
    currentIdx,
    Math.max(0, filteredQuestions.length - 1),
  );
  const currentQ = filteredQuestions[safeIndex];

  const stats = useMemo(() => {
    let submitted = 0;
    let correct = 0;
    let drafted = 0;
    for (const q of filteredQuestions) {
      if (answeredMap[q.id] !== undefined) {
        submitted += 1;
        if (answeredMap[q.id] === q.correctIndex) {
          correct += 1;
        }
      } else if (draftMap[q.id] !== undefined) {
        drafted += 1;
      }
    }
    return {
      submitted,
      correct,
      drafted,
      total: filteredQuestions.length,
    };
  }, [filteredQuestions, answeredMap, draftMap]);

  if (!currentQ) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-600">
          No questions match the selected filter.
        </p>
      </div>
    );
  }

  const submittedChoice = answeredMap[currentQ.id];
  const hasSubmitted = submittedChoice !== undefined;
  const draftChoice = draftMap[currentQ.id];
  const activeSelection = hasSubmitted ? submittedChoice : draftChoice;
  const isCorrect = submittedChoice === currentQ.correctIndex;

  const handleSelectDraft = (idx: number) => {
    if (hasSubmitted) return;
    setDraftMap((prev) => ({
      ...prev,
      [currentQ.id]: idx,
    }));
  };

  const handleSubmitCurrent = () => {
    if (hasSubmitted || draftChoice === undefined) return;
    onAnswerQuestion(currentQ.id, draftChoice);
    setDraftMap((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
    setShowHint(false);
  };

  const handleSubmitAllDrafts = () => {
    const pendingEntries: Record<string, number> = {};
    for (const q of filteredQuestions) {
      if (answeredMap[q.id] === undefined && draftMap[q.id] !== undefined) {
        pendingEntries[q.id] = draftMap[q.id];
      }
    }
    const keys = Object.keys(pendingEntries);
    if (keys.length === 0) return;

    if (onAnswerBatch) {
      onAnswerBatch(pendingEntries);
    } else {
      for (const [qId, idx] of Object.entries(pendingEntries)) {
        onAnswerQuestion(qId, idx);
      }
    }
    setDraftMap((prev) => {
      const next = { ...prev };
      for (const qId of keys) {
        delete next[qId];
      }
      return next;
    });
    setShowHint(false);
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Quiz Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-600 font-mono tabular-nums">
            Score: {stats.correct}/{stats.submitted} submitted · {stats.total}{' '}
            total questions
            {stats.drafted > 0 ? ` · ${stats.drafted} drafted` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
            {(['All', 'Core Recall', 'Application & Data'] as const).map(
              (diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    setDifficultyFilter(diff);
                    setCurrentIdx(0);
                    setShowHint(false);
                  }}
                  className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    difficultyFilter === diff
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ),
            )}
          </div>

          {stats.drafted > 0 && (
            <button
              type="button"
              onClick={handleSubmitAllDrafts}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-emerald-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              <Send className="h-4 w-4" /> Submit All Selected ({stats.drafted})
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const ids = filteredQuestions.map((q) => q.id);
              onResetTopicQuiz(ids);
              setDraftMap((prev) => {
                const next = { ...prev };
                for (const id of ids) delete next[id];
                return next;
              });
              setCurrentIdx(0);
              setShowHint(false);
            }}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" /> Reset Quiz
          </button>
        </div>
      </div>

      {/* Question Navigator Strip */}
      <div className="flex flex-wrap items-center gap-2">
        {filteredQuestions.map((q, idx) => {
          const ans = answeredMap[q.id];
          const submitted = ans !== undefined;
          const drafted = !submitted && draftMap[q.id] !== undefined;
          const correct = ans === q.correctIndex;
          const isCurrent = idx === safeIndex;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setCurrentIdx(idx);
                setShowHint(false);
              }}
              aria-label={`Question ${idx + 1}${
                submitted
                  ? correct
                    ? ', submitted and correct'
                    : ', submitted and incorrect'
                  : drafted
                    ? ', option drafted'
                    : ''
              }`}
              className={`inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border px-2.5 font-mono text-sm font-medium tabular-nums transition-colors ${
                isCurrent
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : submitted && correct
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : submitted && !correct
                      ? 'border-rose-300 bg-rose-50 text-rose-800'
                      : drafted
                        ? 'border-blue-300 bg-blue-50 text-blue-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{idx + 1}</span>
              {submitted &&
                !isCurrent &&
                (correct ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                ))}
            </button>
          );
        })}
      </div>

      {/* Active Question Body */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="font-mono font-medium text-slate-800">
            Question {safeIndex + 1} of {filteredQuestions.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>{currentQ.syllabusRef}</span>
          <span aria-hidden="true">·</span>
          <span>{currentQ.difficulty}</span>
        </div>

        {currentQ.contextNote && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800">
            {currentQ.contextNote}
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-medium leading-snug text-slate-900 max-w-3xl">
          {currentQ.prompt}
        </h3>

        {/* Options List */}
        <div className="space-y-3 max-w-3xl">
          {currentQ.options.map((opt, idx) => {
            const isSelected = activeSelection === idx;
            const isRightOption = idx === currentQ.correctIndex;

            let optionClasses =
              'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';

            if (hasSubmitted) {
              if (isRightOption) {
                optionClasses =
                  'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium';
              } else if (isSelected && !isRightOption) {
                optionClasses = 'border-rose-400 bg-rose-50/70 text-rose-950';
              } else {
                optionClasses =
                  'border-slate-200 bg-slate-50/60 text-slate-500';
              }
            } else if (isSelected) {
              optionClasses =
                'border-blue-600 bg-blue-50/70 text-slate-900 font-medium ring-1 ring-blue-600/30';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasSubmitted}
                onClick={() => handleSelectDraft(idx)}
                className={`flex w-full items-start justify-between gap-3 rounded-lg border px-4 py-3.5 text-left text-base leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${optionClasses}`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-sm font-semibold text-slate-500">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </div>
                {!hasSubmitted && isSelected && (
                  <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wide text-blue-700 mt-1">
                    Selected
                  </span>
                )}
                {hasSubmitted && isRightOption && (
                  <span className="inline-flex items-center gap-1 shrink-0 font-mono text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Correct
                  </span>
                )}
                {hasSubmitted && isSelected && !isRightOption && (
                  <span className="inline-flex items-center gap-1 shrink-0 font-mono text-sm font-semibold text-rose-700">
                    <XCircle className="h-4 w-4" /> Incorrect
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Submit & Hint Controls (strictly before answering/submitting) */}
        {!hasSubmitted && (
          <div className="max-w-3xl space-y-3 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={draftChoice === undefined}
                  onClick={handleSubmitCurrent}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-45 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Submit Answer
                </button>

                <button
                  type="button"
                  onClick={() => setShowHint((h) => !h)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
                >
                  <HelpCircle className="h-4 w-4" />
                  {showHint ? 'Hide Examiner Hint' : 'Show Examiner Hint'}
                </button>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                Answer shown after submission
              </span>
            </div>

            {showHint && (
              <p className="rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 text-sm leading-relaxed text-blue-950">
                {currentQ.hint}
              </p>
            )}
          </div>
        )}

        {/* Mark Scheme Breakdown (only revealed once submitted) */}
        {hasSubmitted && (
          <div
            className={`max-w-3xl rounded-lg border p-4 sm:p-5 space-y-2.5 ${
              isCorrect
                ? 'border-emerald-200 bg-emerald-50/50'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  <span>Mark Scheme Verification — Correct</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-700" />
                  <span>
                    Mark Scheme Verification — Correct Option is{' '}
                    {String.fromCharCode(65 + currentQ.correctIndex)}
                  </span>
                </>
              )}
            </div>
            <p className="text-base leading-relaxed text-slate-700">
              {currentQ.markSchemeExplanation}
            </p>
            <p className="pt-1 text-sm text-slate-600">
              <span className="font-medium text-slate-800">
                Key 9700 Terms:{' '}
              </span>
              {currentQ.keyTerms.join(' · ')}
            </p>
          </div>
        )}
      </div>

      {/* Previous / Next Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={safeIndex === 0}
          onClick={() => {
            setCurrentIdx((i) => Math.max(0, i - 1));
            setShowHint(false);
          }}
          className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <button
          type="button"
          disabled={safeIndex >= filteredQuestions.length - 1}
          onClick={() => {
            setCurrentIdx((i) => Math.min(filteredQuestions.length - 1, i + 1));
            setShowHint(false);
          }}
          className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-40"
        >
          Next Question <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
