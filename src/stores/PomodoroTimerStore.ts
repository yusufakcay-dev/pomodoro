import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './storage';

interface PomodoroTimerStore {
  focusSession: number;
  breakSession: number;
  longBreakSession: number;
  sessionTimer: number;
  sessionType: 'Focus' | 'Break' | 'Long Break';
  focusCount: number;
  breakCount: number;
  longBreakCount: number;
  isTicking: boolean;
  continueAfterFocus: boolean;
  continueAfterBreak: boolean;
  longBreak: boolean;
  longBreakEverySession: number;
  totalFocusTime: number;
  totalBreakTime: number;
  totalLongBreakTime: number;
  setFocusTime: (newTime: number) => void;
  setBreakTime: (newTime: number) => void;
  startStopTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}

export const usePomodoroTimerStore = create<PomodoroTimerStore>()(
  persist(
    (set) => ({
      focusSession: 2,
      breakSession: 1,
      longBreakSession: 3,
      sessionTimer: 2 * 60,
      sessionType: 'Focus',
      focusCount: 0,
      breakCount: 0,
      longBreakCount: 0,
      isTicking: false,
      continueAfterFocus: true,
      continueAfterBreak: true,
      longBreak: true,
      longBreakEverySession: 3,
      totalFocusTime: 0,
      totalBreakTime: 0,
      totalLongBreakTime: 0,
      setFocusTime: (newTime) => set({ focusSession: newTime }),
      setBreakTime: (newTime) => set({ breakSession: newTime }),
      startStopTimer: () =>
        set((state) => ({
          isTicking: !state.isTicking,
        })),
      resetTimer: () =>
        set((state) => ({
          sessionTimer: state.focusSession * 60,
          sessionType: 'Focus',
          isTicking: false,
        })),
      tick: () =>
        set((state) =>
          state.sessionTimer > 0 ? handleSession(state) : handleSessionCompletion(state)
        ),
    }),
    {
      name: 'timer-storage233333', // Key for MMKV
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
const handleSessionCompletion = (state: PomodoroTimerStore) => {
  const updateSessionCount = {
    focusCount: state.focusCount,
    breakCount: state.breakCount,
    longBreakCount: state.longBreakCount,
  };
  let nextSessionType: 'Focus' | 'Break' | 'Long Break';
  let nextSessionTime: number;

  switch (state.sessionType) {
    case 'Focus':
      updateSessionCount.focusCount += 1;
      break;
    case 'Break':
      updateSessionCount.breakCount += 1;
      break;
    case 'Long Break':
      updateSessionCount.longBreakCount += 1;
      break;
  }

  if (state.sessionType === 'Focus') {
    // If focus session just finished, check if a long break is needed
    if (state.longBreak && updateSessionCount.focusCount % state.longBreakEverySession === 0) {
      nextSessionType = 'Long Break';
      nextSessionTime = state.longBreakSession * 60;
    } else {
      nextSessionType = 'Break';
      nextSessionTime = state.breakSession * 60;
    }
  } else {
    // If any break (short/long) finishes, always go back to Focus
    nextSessionType = 'Focus';
    nextSessionTime = state.focusSession * 60;
  }

  return {
    sessionTimer: nextSessionTime,
    sessionType: nextSessionType,
    isTicking: state.sessionType === 'Focus' ? state.continueAfterFocus : state.continueAfterBreak,
    ...updateSessionCount,
  };
};

const handleSession = (state: PomodoroTimerStore) => {
  let updateTotalTime: object;
  switch (state.sessionType) {
    case 'Focus':
      updateTotalTime = { totalFocusTime: state.totalFocusTime + 1 };
      break;
    case 'Break':
      updateTotalTime = { totalBreakTime: state.totalBreakTime + 1 };
      break;
    case 'Long Break':
      updateTotalTime = {
        totalLongBreakTime: state.totalLongBreakTime + 1,
      };
      break;
  }
  return { sessionTimer: state.sessionTimer - 10, ...updateTotalTime };
};
