import { StateCreator } from 'zustand';

export const GeneralSettings: StateCreator<GeneralSettingsTypes, [], [], GeneralSettingsTypes> = (
  set
) => ({
  reminderDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  timerMode: 'Focus',
  reminderTime: 60,
  focusTime: 2 * 60 * 1000,
  breakTime: 1 * 60 * 1000,
  setReminderDays: (newDays) => set({ reminderDays: newDays }),
  setReminderTime: (newTime) => set({ reminderTime: newTime }),
  setFocusTime: (newTime) => set({ focusTime: newTime * 60 * 1000 }),
  setBreakTime: (newTime) => set({ breakTime: newTime * 60 * 1000 }),
});

export interface GeneralSettingsTypes {
  reminderDays: string[];
  timerMode: string;
  reminderTime: number;
  focusTime: number;
  breakTime: number;
  setReminderDays: (newDays: string[]) => void;
  setReminderTime: (newTime: number) => void;
  setFocusTime: (newTime: number) => void;
  setBreakTime: (newTime: number) => void;
}
