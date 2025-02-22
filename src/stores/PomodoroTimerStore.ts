import { create } from 'zustand';

export const usePomodoroTimerStore = create<PomodoroTimerStore>()((set) => ({
  focusSession: 25,
  breakSession: 5,
  longBreakSession: 15,
  session: 25 * 60,
  sessionType: 'Focus',
  sessionCount: 0,
  isTicking: false,
  continueAfterFocus: false,
  continueAfterBreak: false,
  longBreak: false,
  setFocusTime: (minutes) => set({ focusSession: minutes, session: minutes * 60 }),
  setBreakTime: (newTime) => set({ breakSession: newTime }),
  startStopTimer: () =>
    set((state) => ({
      isTicking: !state.isTicking,
    })),
  tick: () =>
    set((state) =>
      state.session > 0
        ? { timer: state.session - 1 }
        : state.sessionType === 'Focus'
          ? { session: state.session }
          : { session: state.session }
    ),
}));

interface PomodoroTimerStore {
  focusSession: number;
  breakSession: number;
  longBreakSession: number;
  session: number;
  sessionType: string;
  sessionCount: number;
  isTicking: boolean;
  continueAfterFocus: boolean;
  continueAfterBreak: boolean;
  longBreak: boolean;
  setFocusTime: (minutes: number) => void;
  setBreakTime: (newTime: number) => void;
  startStopTimer: () => void;
  tick: () => void;
}
