'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import { useMilestones } from '@/hooks/useMilestones';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconArrowLeft, IconCheckCircle } from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';

const SCREENS = {
  NAME: 0,
  GOAL: 1,
  SOURCE: 2,
  LINK: 3,
  CONSISTENCY: 4,
  PERSONALIZATION: 5,
  PROGRESS_STYLE: 6,
  MISSED_DAYS: 7,
  REVIEW: 8,
};

const OptionCard = ({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
            ${selected ? 'border-accent bg-accent/5 ring-4 ring-accent/10 md:-translate-y-1' : 'border-border hover:border-accent/50 hover:bg-muted'}`}
  >
    <span className={`text-lg font-medium ${selected ? 'text-accent' : 'text-foreground'}`}>
      {label}
    </span>
    <div
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
            ${selected ? 'border-accent bg-accent text-primary-foreground' : 'border-muted-foreground'}`}
    >
      {selected && <IconCheckCircle className="w-4 h-4" />}
    </div>
  </div>
);

const ScreenWrapper = ({
  id_key,
  title,
  helperText,
  children,
  showNext = true,
  nextDisabled = false,
  showSkip = false,
  showBack = true,
  onNext,
  onBack,
  onSkip,
}: any) => (
  <motion.div
    key={id_key}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="absolute inset-0 flex flex-col h-full w-full max-w-md mx-auto px-6 overflow-y-auto overflow-x-hidden pt-4 pb-8"
  >
    <div className="flex-shrink-0 mt-8 mb-4 relative">
      {showBack && (
        <button
          onClick={onBack}
          className="absolute -top-12 -left-2 text-muted-foreground hover:text-foreground transition flex items-center gap-2 p-2 z-10"
        >
          <IconArrowLeft className="w-5 h-5" /> Back
        </button>
      )}
      <div className="pt-2">
        <h1 className="text-3xl font-bold tracking-tight mb-3 text-foreground">{title}</h1>
        {helperText && (
          <p className="text-muted-foreground text-lg leading-relaxed">{helperText}</p>
        )}
      </div>
    </div>

    <div className="flex-grow flex flex-col justify-center py-4 min-h-[300px]">{children}</div>

    <div className="flex-shrink-0 mt-auto flex flex-col gap-3 pt-6 pb-24 md:pb-8">
      {showNext && (
        <Button size="lg" className="w-full text-lg py-6" onClick={onNext} disabled={nextDisabled}>
          Continue
        </Button>
      )}
      {showSkip && (
        <Button variant="ghost" size="lg" className="w-full text-muted-foreground" onClick={onSkip}>
          Skip for now
        </Button>
      )}
    </div>
  </motion.div>
);

export default function AddCourseHabitFlow() {
  const router = useRouter();
  const { addCourse } = useCourses();
  const { milestones, addMilestone } = useMilestones();

  const [currentScreen, setCurrentScreen] = useState(SCREENS.NAME);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [milestoneId, setMilestoneId] = useState<string>('none'); // "none", "new", or existing id
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [source, setSource] = useState('');
  const [url, setUrl] = useState('');
  const [consistencyGoal, setConsistencyGoal] = useState('');
  const [consistencyDetails, setConsistencyDetails] = useState('');
  const [progressStyle, setProgressStyle] = useState('mark_done');
  const [missedDaysTone, setMissedDaysTone] = useState('gentle');

  const nextScreen = () => setCurrentScreen((prev) => Math.min(prev + 1, SCREENS.REVIEW));
  const prevScreen = () => setCurrentScreen((prev) => Math.max(prev - 1, SCREENS.NAME));

  const handleSkip = () => {
    // Depending on the screen, skipping means leaving the value empty and moving next
    nextScreen();
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      let finalMilestoneId = milestoneId === 'none' ? '' : milestoneId;

      // Create new milestone if selected
      if (milestoneId === 'new' && newMilestoneTitle) {
        // Since hooks don't easily return the newly created ID synchronously without modifying the hook severely,
        // we'll hit the API manually for the new milestone to get its ID before attaching.
        const res = await fetch('/api/milestones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newMilestoneTitle,
            targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              .toISOString()
              .split('T')[0], // Default 1 year out
            linkedCourseIds: [],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          finalMilestoneId = data.id || data._id;
        }
      }

      // Create Course/Habit
      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          milestoneId: finalMilestoneId,
          source,
          url,
          consistencyGoal,
          consistencyDetails,
          progressStyle,
          missedDaysTone,
          itemType: 'flex', // General tracking item
          totalLessons: 0,
          completedLessons: 0,
          category: 'General',
        }),
      });

      // Redirect back to courses
      router.push('/courses');
      router.refresh();
    } catch (error) {
      console.error('Failed to save:', error);
      setIsSubmitting(false);
    }
  };

  // --- Screen Components ---
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden flex items-center justify-center">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-muted z-20">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${((currentScreen + 1) / 9) * 100}%` }}
        />
      </div>

      <div className="relative w-full h-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {currentScreen === SCREENS.NAME && (
            <ScreenWrapper
              key="screen-name"
              id_key="screen-name"
              title="Give it a name"
              helperText="What are you working on? Keep it simple. You can change this anytime."
              nextDisabled={!title.trim()}
              showBack={currentScreen > 0}
              onNext={nextScreen}
              onBack={prevScreen}
              onSkip={handleSkip}
            >
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next.js Course, Daily Reading, Python Basics..."
                className="text-xl p-6 h-16 border-2 focus-visible:ring-accent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && title.trim()) nextScreen();
                }}
              />
            </ScreenWrapper>
          )}

          {currentScreen === SCREENS.GOAL && (
            <ScreenWrapper
              key="screen-goal"
              id_key="screen-goal"
              title="Does this belong to a larger goal?"
              helperText="Goals help group related items together. Selecting one is optional."
              showSkip={true}
              showBack={currentScreen > 0}
              onNext={nextScreen}
              onBack={prevScreen}
              onSkip={handleSkip}
            >
              <div className="flex flex-col gap-3">
                <OptionCard
                  selected={milestoneId === 'none'}
                  label="Standalone (No Goal)"
                  onClick={() => {
                    setMilestoneId('none');
                    nextScreen();
                  }}
                />
                <div className="my-2 border-t border-border"></div>
                {milestones.map((m) => (
                  <OptionCard
                    key={m.id}
                    selected={milestoneId === m.id}
                    label={m.title}
                    onClick={() => {
                      setMilestoneId(m.id);
                      nextScreen();
                    }}
                  />
                ))}
                <OptionCard
                  selected={milestoneId === 'new'}
                  label="+ Create a New Goal"
                  onClick={() => setMilestoneId('new')}
                />

                {milestoneId === 'new' && (
                  <div className="mt-4 p-4 border border-border rounded-xl bg-muted/30 animate-in fade-in zoom-in-95">
                    <label className="text-sm font-medium mb-2 block">New Goal Name</label>
                    <Input
                      autoFocus
                      placeholder="e.g. Become a Full-Stack Dev"
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      className="mb-4"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newMilestoneTitle.trim()) nextScreen();
                      }}
                    />
                    <Button
                      className="w-full"
                      disabled={!newMilestoneTitle.trim()}
                      onClick={nextScreen}
                    >
                      Save Goal & Continue
                    </Button>
                  </div>
                )}
              </div>
            </ScreenWrapper>
          )}

          {currentScreen === SCREENS.SOURCE && (
            <ScreenWrapper
              key="screen-source"
              id_key="screen-source"
              title="Where is this from?"
              helperText="Optional. Choose a platform if applicable."
              showSkip={true}
              showBack={currentScreen > 0}
              onNext={nextScreen}
              onBack={prevScreen}
              onSkip={handleSkip}
            >
              <div className="grid grid-cols-2 gap-3">
                {[
                  'YouTube',
                  'Coursera',
                  'Udemy',
                  'Duolingo',
                  'Book / Notes',
                  'Notion',
                  'College',
                  'Other',
                ].map((opt) => (
                  <OptionCard
                    key={opt}
                    selected={source === opt}
                    label={opt}
                    onClick={() => {
                      setSource(opt);
                      nextScreen();
                    }}
                  />
                ))}
              </div>
            </ScreenWrapper>
          )}

          {currentScreen === SCREENS.LINK && (
            <ScreenWrapper
              key="screen-link"
              id_key="screen-link"
              title="Add a link"
              helperText="We’ll save this so you can quickly jump to it. We don't track your activity there."
              showSkip={true}
              showBack={currentScreen > 0}
              onNext={nextScreen}
              onBack={prevScreen}
              onSkip={handleSkip}
            >
              <Input
                autoFocus
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste URL here..."
                className="text-lg p-6 h-16 border-2 focus-visible:ring-accent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') nextScreen();
                }}
              />
            </ScreenWrapper>
          )}

          {currentScreen === SCREENS.CONSISTENCY && (
            <ScreenWrapper
              key="screen-consistency"
              id_key="screen-consistency"
              title="How do you want to work on this?"
              helperText="Choose what feels realistic, not perfect."
              showBack={currentScreen > 0}
              onNext={nextScreen}
              onBack={prevScreen}
              onSkip={handleSkip}
            >
              <div className="flex flex-col gap-3">
                {[
                  { id: 'every_day', label: 'A little every day' },
                  { id: 'few_times_week', label: 'A few times a week' },
                  { id: 'target_date', label: 'Finish it by a certain date' },
                  { id: 'decide_later', label: "I'll decide later" },
                ].map((opt) => (
                  <OptionCard
                    key={opt.id}
                    selected={consistencyGoal === opt.id}
                    label={opt.label}
                    onClick={() => {
                      setConsistencyGoal(opt.id);
                      nextScreen();
                    }}
                  />
                ))}
              </div>
            </ScreenWrapper>
          )}

          {currentScreen === SCREENS.PERSONALIZATION && (
            <ScreenWrapper
              key="screen-personalization"
              id_key="screen-personalization"
              title={
                consistencyGoal === 'every_day'
                  ? 'On most days, what feels doable?'
                  : consistencyGoal === 'few_times_week'
                    ? 'How many days per week?'
                    : consistencyGoal === 'target_date'
                      ? 'When would you like to finish?'
                      : "Let's move on"
              }
              helperText={consistencyGoal === 'decide_later' ? 'You opted to decide later.' : ''}
              nextDisabled={consistencyGoal !== 'decide_later' && !consistencyDetails}
              showBack={currentScreen > 0}
              onNext={nextScreen}
              onBack={prevScreen}
              onSkip={handleSkip}
            >
              <div className="flex flex-col gap-3">
                {consistencyGoal === 'every_day' &&
                  ['15 minutes', '30 minutes', '1 hour', 'Other'].map((opt) => (
                    <OptionCard
                      key={opt}
                      selected={consistencyDetails === opt}
                      label={opt}
                      onClick={() => {
                        setConsistencyDetails(opt);
                        nextScreen();
                      }}
                    />
                  ))}

                {consistencyGoal === 'few_times_week' &&
                  ['2 days', '3 days', '4 days', '5 days'].map((opt) => (
                    <OptionCard
                      key={opt}
                      selected={consistencyDetails === opt}
                      label={opt}
                      onClick={() => {
                        setConsistencyDetails(opt);
                        nextScreen();
                      }}
                    />
                  ))}

                {consistencyGoal === 'target_date' && (
                  <Input
                    type="date"
                    className="text-xl p-6 h-16 border-2 focus-visible:ring-accent mt-4"
                    value={consistencyDetails}
                    onChange={(e) => setConsistencyDetails(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                )}

                {consistencyGoal === 'decide_later' && (
                  <div className="flex justify-center p-8">
                    <Button onClick={nextScreen} size="lg">
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </ScreenWrapper>
          )}

          {currentScreen === SCREENS.PROGRESS_STYLE && (
            <ScreenWrapper
              key="screen-progress-style"
              id_key="screen-progress-style"
              title="How would you like to track progress?"
              helperText="Default is to just mark days as done."
              showBack={currentScreen > 0}
              onNext={nextScreen}
              onBack={prevScreen}
              onSkip={handleSkip}
            >
              <div className="flex flex-col gap-3">
                {[
                  { id: 'mark_done', label: "Just mark 'Done for today'" },
                  { id: 'count_sessions', label: 'Count total sessions' },
                  { id: 'count_lessons', label: 'Count lessons or units' },
                  { id: 'reminders_only', label: 'Just reminders, no tracking' },
                ].map((opt) => (
                  <OptionCard
                    key={opt.id}
                    selected={progressStyle === opt.id}
                    label={opt.label}
                    onClick={() => {
                      setProgressStyle(opt.id);
                      nextScreen();
                    }}
                  />
                ))}
              </div>
            </ScreenWrapper>
          )}

          {currentScreen === SCREENS.MISSED_DAYS && (
            <ScreenWrapper
              key="screen-missed-days"
              id_key="screen-missed-days"
              title="Missed days happen. What should we do?"
              helperText="We want to support you without stressing you out."
              showBack={currentScreen > 0}
              onNext={nextScreen}
              onBack={prevScreen}
              onSkip={handleSkip}
            >
              <div className="flex flex-col gap-3">
                {[
                  { id: 'gentle', label: 'Just remind me gently' },
                  { id: 'help', label: 'Help me get back on track' },
                  { id: 'ignore', label: "Don't bother me about it" },
                ].map((opt) => (
                  <OptionCard
                    key={opt.id}
                    selected={missedDaysTone === opt.id}
                    label={opt.label}
                    onClick={() => {
                      setMissedDaysTone(opt.id);
                      nextScreen();
                    }}
                  />
                ))}
              </div>
            </ScreenWrapper>
          )}

          {currentScreen === SCREENS.REVIEW && (
            <motion.div
              key="screen-review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute inset-0 flex flex-col h-full w-full max-w-md mx-auto px-6 overflow-y-auto overflow-x-hidden pt-4 pb-8"
            >
              <div className="flex-shrink-0 mt-8 mb-4 relative z-10">
                <button
                  onClick={prevScreen}
                  className="absolute -top-12 -left-2 text-muted-foreground hover:text-foreground transition flex items-center gap-2 p-2"
                >
                  <IconArrowLeft className="w-5 h-5" /> Back
                </button>
              </div>

              <div className="flex-grow flex flex-col justify-center py-4 min-h-[300px]">
                <div className="mb-6 p-1 text-center">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                    <IconCheckCircle className="w-10 h-10" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
                    You’re all set
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Here's your plan to stay consistent.
                  </p>
                </div>

                <div className="bg-muted/30 border border-border rounded-xl p-6 flex flex-col gap-4 text-left shadow-sm">
                  <div>
                    <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold block mb-1">
                      Working On
                    </span>
                    <span className="text-xl font-medium">{title}</span>
                  </div>

                  {(milestoneId !== 'none' || newMilestoneTitle) && (
                    <div>
                      <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold block mb-1">
                        Part of Goal
                      </span>
                      <span className="text-lg">
                        {milestoneId === 'new'
                          ? newMilestoneTitle
                          : milestones.find((m) => m.id === milestoneId)?.title || 'Goal'}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold block mb-1">
                      Plan
                    </span>
                    <span className="text-lg">
                      {consistencyGoal.replace(/_/g, ' ')}
                      {consistencyDetails && ` (${consistencyDetails})`}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold block mb-1">
                      Tracking Style
                    </span>
                    <span className="text-lg">{progressStyle.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 mt-auto flex flex-col gap-3 pt-6 pb-24 md:pb-8">
                <Button
                  size="lg"
                  className="w-full text-lg py-6"
                  onClick={handleFinish}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Start Tracking'}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full text-muted-foreground"
                  onClick={() => setCurrentScreen(SCREENS.NAME)}
                >
                  Edit details
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
