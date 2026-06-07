import { STREAK_CONFIG } from '@/config/streak';
import { StudyLogEntry } from '@/hooks/useStudyLog';

export function calculateStreakState(studyLog: StudyLogEntry[]) {
  if (!studyLog || !studyLog.length) return { streak: 0, freezes: 0 };

  const dates = new Set(studyLog.map((log) => log.date));
  const sortedDates = [...dates].sort();
  const minDateStr = sortedDates[0];

  const [year, month, day] = minDateStr.split('-').map(Number);
  const minDate = new Date(year, month - 1, day);
  minDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let availableFreezes = 0;

  let current = new Date(minDate);

  while (current <= today) {
    // Format current local date as YYYY-MM-DD
    const dStr = [
      current.getFullYear(),
      String(current.getMonth() + 1).padStart(2, '0'),
      String(current.getDate()).padStart(2, '0'),
    ].join('-');

    if (dates.has(dStr)) {
      streak++;

      // Check milestones
      if (streak === 10) availableFreezes += STREAK_CONFIG.milestones[10];
      if (streak === 25) availableFreezes += STREAK_CONFIG.milestones[25];
      if (streak === 50) availableFreezes += STREAK_CONFIG.milestones[50];
      if (streak > 0 && streak % STREAK_CONFIG.recurring.days === 0) {
        availableFreezes += STREAK_CONFIG.recurring.amount;
      }
    } else {
      // Missed day
      if (availableFreezes > 0) {
        availableFreezes--;
        // Streak is maintained (frozen like ice), does not increment.
      } else {
        // No freezes left, streak and freezes reset to 0
        streak = 0;
        availableFreezes = 0;
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return { streak, freezes: availableFreezes };
}
