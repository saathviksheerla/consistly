export const STREAK_CONFIG = {
  milestones: {
    10: Number(process.env.NEXT_PUBLIC_STREAK_FREEZE_10) || 1,
    25: Number(process.env.NEXT_PUBLIC_STREAK_FREEZE_25) || 1,
    50: Number(process.env.NEXT_PUBLIC_STREAK_FREEZE_50) || 1,
  },
  recurring: {
    days: Number(process.env.NEXT_PUBLIC_STREAK_FREEZE_RECURRING_DAYS) || 365,
    amount: Number(process.env.NEXT_PUBLIC_STREAK_FREEZE_RECURRING_AMOUNT) || 3,
  },
};
