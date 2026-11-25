import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Lock,
  RotateCcw,
  Send,
  Unlock,
} from 'lucide-react';
import { RevisionQuestion } from '../../types/syllabus';
import { AUTH_VALIDATION } from '../../types/auth';

interface RevisionQuestionsPanelProps {
  title: string;
  subtitle: string;
  questions: RevisionQuestion[];
  responses: Record<string, string>;
  submittedMap: Record<string, boolean>;
  onChangeResponse: (questionId: string, value: string) => void;
  onSubmitQuestion: (questionId: string) => void;
  onSubmitAllDrafted: (questionIds: string[]) => void;
  onResetQuestion: (questionId: string) => void;
  onResetAll: (questionIds: string[]) => void;
}

export const RevisionQuestionsPanel: React.FC<RevisionQuestionsPanelProps> = ({
  title,
  subtitle,
  questions,
  responses,
  submittedMap,
  onChangeResponse,
  onSubmitQuestion,
  onSubmitAllDrafted,
  onResetQuestion,
  onResetAll,
}) => {
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});

  const summary = useMemo(() => {
    let totalMarks = 0;
    let submittedCount = 0;
    const readyToSubmitIds: string[] = [];

    for (const q of questions) {
      totalMarks += q.marks;
      const isSubmitted = Boolean(submittedMap[q.id]);
      if (isSubmitted) {
        submittedCount += 1;
      } else if ((responses[q.id] || '').trim().length > 0) {
        readyToSubmitIds.push(q.id);
      }
    }

    return {
      totalMarks,
      submittedCount,
      readyToSubmitIds,
      totalQuestions: questions.length,
    };
  }, [questions, responses, submittedMap]);

  const toggleHint = (id: string) => {
    setOpenHints((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Chapter Revision Header */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{subtitle}</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-600 font-mono tabular-nums">
            {summary.submittedCount}/{summary.totalQuestions} submitted ·{' '}
            {summary.totalMarks} total marks available
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {summary.readyToSubmitIds.length > 0 && (
            <button
              type="button"
              onClick={() => onSubmitAllDrafted(summary.readyToSubmitIds)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              <Send className="h-4 w-4" />
              Submit All Drafted ({summary.readyToSubmitIds.length})
            </button>
          )}

          {summary.submittedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                onResetAll(questions.map((q) => q.id));
                setOpenHints({});
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Chapter
            </button>
          )}
        </div>
      </div>

      {/* Strict Lock Notice when nothing submitted yet */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/90 px-4 py-3 text-sm text-slate-700 flex items-center gap-2.5">
        <Lock className="h-4 w-4 text-slate-600 shrink-0" />
        <span>
          Write your own response for each 9700 structured question and click{' '}
          <strong className="font-semibold text-slate-900">Submit Answer</strong>{' '}
          to unlock and compare against the official Cambridge mark scheme.
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {questions.map((q, index) => {
          const responseText = responses[q.id] || '';
          const trimmedLength = responseText.trim().length;
          const isSubmitted = Boolean(submittedMap[q.id]);
          const hintVisible = Boolean(openHints[q.id]);

          return (
            <article
              key={q.id}
              className={`rounded-xl border bg-white p-6 shadow-xs space-y-4 transition-colors ${
                isSubmitted
                  ? 'border-emerald-300/90'
                  : 'border-slate-200/90'
              }`}
            >
              {/* Question Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2.5 text-sm">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-slate-900 px-2 font-mono text-xs font-semibold text-white">
                    Q{index + 1}
                  </span>
                  <span className="font-medium text-slate-700">
                    {q.syllabusRef}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {q.commandWord}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    [{q.marks} marks]
                  </span>
                  {isSubmitted ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      <Lock className="h-3 w-3" /> Answer Locked
                    </span>
                  )}
                </div>
              </div>

              {q.contextNote && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800">
                  {q.contextNote}
                </div>
              )}

              <h3 className="text-lg font-medium leading-snug text-slate-900">
                {q.prompt}
              </h3>

              {/* Student Answer Box or Submitted View */}
              {!isSubmitted ? (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor={`rev-input-${q.id}`}
                      className="sr-only"
                    >
                      Your answer for Question {index + 1}
                    </label>
                    <textarea
                      id={`rev-input-${q.id}`}
                      rows={4}
                      maxLength={AUTH_VALIDATION.REVISION_RESPONSE_MAX_LENGTH}
                      value={responseText}
                      onChange={(e) => onChangeResponse(q.id, e.target.value)}
                      placeholder="Write your answer here using clear biological terms (e.g. concentration gradient, active transport, enzyme active site)..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Write your attempt before submitting to reveal the mark
                        scheme.
                      </span>
                      <span className="font-mono tabular-nums">
                        {responseText.length}/
                        {AUTH_VALIDATION.REVISION_RESPONSE_MAX_LENGTH}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        disabled={trimmedLength === 0}
                        onClick={() => onSubmitQuestion(q.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-45 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        Submit Answer
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleHint(q.id)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
                      >
                        <HelpCircle className="h-4 w-4" />
                        {hintVisible ? 'Hide Examiner Hint' : 'Show Hint'}
                      </button>
                    </div>
                  </div>

                  {hintVisible && (
                    <p className="rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm leading-relaxed text-blue-950">
                      {q.hint}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Student's Submitted Response */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Your Submitted Answer
                      </span>
                      <button
                        type="button"
                        onClick={() => onResetQuestion(q.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Re-attempt (hides answer)
                      </button>
                    </div>
                    <p className="text-base leading-relaxed text-slate-800 whitespace-pre-wrap">
                      {responseText}
                    </p>
                  </div>

                  {/* Unlocked Mark Scheme Answer */}
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
                      <Unlock className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>
                        Official 9700 Mark Scheme Answer (Unlocked · {q.marks}{' '}
                        marks)
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-sm sm:text-base leading-relaxed text-slate-800">
                      {q.markSchemePoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="mt-1 font-mono text-xs font-semibold text-emerald-800 shrink-0">
                            [{idx + 1}]
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="rounded-lg border border-emerald-200/80 bg-white/85 px-4 py-3 space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                        Model Full-Marks Response
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed text-slate-800">
                        {q.modelAnswer}
                      </p>
                    </div>

                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-800">
                        Key 9700 Terms:{' '}
                      </span>
                      {q.keyTerms.join(' · ')}
                    </p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Bottom Batch Submit Bar */}
      {summary.readyToSubmitIds.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-emerald-950">
            You have {summary.readyToSubmitIds.length} drafted{' '}
            {summary.readyToSubmitIds.length === 1 ? 'answer' : 'answers'} ready
            to submit in this chapter.
          </p>
          <button
            type="button"
            onClick={() => onSubmitAllDrafted(summary.readyToSubmitIds)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
          >
            <Send className="h-4 w-4" />
            Submit &amp; Reveal Mark Schemes ({summary.readyToSubmitIds.length})
          </button>
        </div>
      )}
    </div>
  );
};
