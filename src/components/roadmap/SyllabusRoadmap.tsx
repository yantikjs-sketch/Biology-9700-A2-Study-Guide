import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Layers } from 'lucide-react';
import { A2_SYLLABUS_MODULES, QUIZ_QUESTIONS } from '../../data/syllabusData';
import { TopicId } from '../../types/syllabus';

interface SyllabusRoadmapProps {
  answeredMap: Record<string, number>;
  onSelectTopic: (topicId: TopicId, openQuiz?: boolean) => void;
}

export const SyllabusRoadmap: React.FC<SyllabusRoadmapProps> = ({
  answeredMap,
  onSelectTopic,
}) => {
  const getTopicMastery = (topicId: string) => {
    const qs = QUIZ_QUESTIONS.filter((q) => q.topicId === topicId);
    if (qs.length === 0) return { answered: 0, correct: 0, total: 0 };
    let answered = 0;
    let correct = 0;
    for (const q of qs) {
      if (answeredMap[q.id] !== undefined) {
        answered += 1;
        if (answeredMap[q.id] === q.correctIndex) correct += 1;
      }
    }
    return { answered, correct, total: qs.length };
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-300/70 pb-4">
        <p className="text-sm font-medium tracking-wide text-slate-600">
          Cambridge International A Level · Syllabus 9700
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl text-balance">
          A2 Biology Syllabus Modules &amp; Expansion Roadmap
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-700">
          Each A2 topic lives in its own dedicated tab with interactive diagrams and
          exam-style quizzes. Topics 12, 13, 14, and 15 are live below; Topics 16–19
          are structured as ready-to-activate syllabus slots as you expand your revision deck.
        </p>
      </div>

      {/* Active Modules */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-slate-700" />
          Active Interactive Revision Modules
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {A2_SYLLABUS_MODULES.filter((m) => m.status === 'active').map(
            (mod) => {
              const mastery = getTopicMastery(mod.id);
              const pct =
                mastery.total > 0
                  ? Math.round((mastery.correct / mastery.total) * 100)
                  : 0;

              return (
                <div
                  key={mod.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-sm text-slate-500">
                      <span className="font-mono font-semibold text-slate-700">
                        Topic {mod.code}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" /> Interactive Ready
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-xl font-semibold text-slate-900">
                      {mod.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-slate-600">
                      {mod.summary}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm text-slate-600">
                      {mod.subtopics.map((sub) => (
                        <li key={sub}>{sub}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-slate-500">Quiz Mastery</span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {mastery.correct}/{mastery.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: mod.accentColor,
                        }}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectTopic(mod.id as TopicId, false)
                        }
                        className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                      >
                        Open Interactive Diagrams{' '}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectTopic(mod.id as TopicId, true)
                        }
                        className="whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Practice Quiz ({mastery.total} Qs)
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Upcoming Syllabus Slots (Topics 16–19) */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Layers className="h-4 w-4 text-slate-700" />
          Planned A2 9700 Topic Slots (Topics 16–19)
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {A2_SYLLABUS_MODULES.filter((m) => m.status === 'planned').map(
            (mod) => (
              <div
                key={mod.id}
                className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs"
              >
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="font-mono font-semibold text-slate-700">
                    Topic {mod.code}
                  </span>
                  <span>Upcoming Tab</span>
                </div>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {mod.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {mod.summary}
                </p>
                <ul className="mt-3 space-y-1 border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                  {mod.subtopics.map((sub) => (
                    <li key={sub}>{sub}</li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};
