export interface HabitStats {
  totalDays: number;
  completedDays: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
}
