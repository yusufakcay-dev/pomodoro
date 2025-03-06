import * as Notifications from 'expo-notifications';
import { create } from 'zustand';

interface DailyRecord {
  date: string;
  focusCount: number;
  focusTime: number;
}

interface PomodoroTimerStore {
  focusSession: number;
  breakSession: number;
  longBreakSession: number;
  sessionTimer: number;
  sessionType: 'Focus' | 'Break' | 'Long Break';
  focusCount: number;
  isTicking: boolean;
  continueAfterFocus: boolean;
  continueAfterBreak: boolean;
  longBreak: boolean;
  longBreakEverySession: number;
  totalFocusTime: number;
  totalBreakTime: number;
  dailyRecords: DailyRecord[]; // NEW: Array holding daily stats
  setFocusTime: (newTime: number) => void;
  setBreakTime: (newTime: number) => void;
  setLongBreak: (newBool: boolean) => void;
  setLongBreakTime: (newTime: number) => void;
  setLongBreakEverySession: (newTime: number) => void;
  setContinueAfterFocus: (newBool: boolean) => void;
  setContinueAfterBreak: (newBool: boolean) => void;
  startStopTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}

export const usePomodoroTimerStore = create<PomodoroTimerStore>((set) => ({
  focusSession: 2,
  breakSession: 1,
  longBreakSession: 3,
  sessionTimer: 2 * 60,
  sessionType: 'Focus',
  focusCount: 0,
  isTicking: false,
  continueAfterFocus: true,
  continueAfterBreak: true,
  longBreak: true,
  longBreakEverySession: 3,
  totalFocusTime: 0,
  totalBreakTime: 0,
  dailyRecords: [], // Initialize with an empty array
  setFocusTime: (newTime) => set({ focusSession: newTime }),
  setBreakTime: (newTime) => set({ breakSession: newTime }),
  setLongBreak: (newBool) => set({ longBreak: newBool }),
  setLongBreakTime: (newTime) => set({ longBreakSession: newTime }),
  setLongBreakEverySession: (newTime) => set({ longBreakEverySession: newTime }),
  setContinueAfterFocus: (newBool) => set({ continueAfterFocus: newBool }),
  setContinueAfterBreak: (newBool) => set({ continueAfterBreak: newBool }),
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
}));

// Helper function to update or add the daily record for today
const updateDailyRecord = (
  state: PomodoroTimerStore,
  additionalFocusTime: number,
  additionalFocusCount: number
) => {
  const today = new Date().toISOString().split('T')[0];
  const dailyRecords = [...state.dailyRecords];
  const index = dailyRecords.findIndex((record) => record.date === today);

  if (index !== -1) {
    dailyRecords[index] = {
      ...dailyRecords[index],
      focusTime: dailyRecords[index].focusTime + additionalFocusTime,
      focusCount: dailyRecords[index].focusCount + additionalFocusCount,
    };
  } else {
    dailyRecords.push({
      date: today,
      focusTime: additionalFocusTime,
      focusCount: additionalFocusCount,
    });
  }
  return dailyRecords;
};

const handleSessionCompletion = (state: PomodoroTimerStore) => {
  const updateSessionCount = {
    focusCount: state.focusCount,
  };
  let nextSessionType: 'Focus' | 'Break' | 'Long Break';
  let nextSessionTime: number;

  // If a focus session ended, increment the count
  if (state.sessionType === 'Focus') {
    updateSessionCount.focusCount += 1;
  }

  if (state.sessionType === 'Focus') {
    if (state.longBreak && updateSessionCount.focusCount % state.longBreakEverySession === 0) {
      nextSessionType = 'Long Break';
      nextSessionTime = state.longBreakSession * 60;
    } else {
      nextSessionType = 'Break';
      nextSessionTime = state.breakSession * 60;
    }
  } else {
    nextSessionType = 'Focus';
    nextSessionTime = state.focusSession * 60;
  }
  send();

  // Update daily record with an extra focusCount if ending a focus session
  const additionalFocusCount = state.sessionType === 'Focus' ? 1 : 0;
  const updatedDailyRecords = updateDailyRecord(state, 0, additionalFocusCount);

  return {
    sessionTimer: nextSessionTime,
    sessionType: nextSessionType,
    isTicking: state.sessionType === 'Focus' ? state.continueAfterFocus : state.continueAfterBreak,
    ...updateSessionCount,
    dailyRecords: updatedDailyRecords,
  };
};

const handleSession = (state: PomodoroTimerStore) => {
  let updateTotalTime: object = {};
  let additionalFocusTime = 0;
  switch (state.sessionType) {
    case 'Focus':
      updateTotalTime = { totalFocusTime: state.totalFocusTime + 1 };
      additionalFocusTime = 1;
      break;
    case 'Break':
      updateTotalTime = { totalBreakTime: state.totalBreakTime + 1 };
      break;
    case 'Long Break':
      updateTotalTime = { totalBreakTime: state.totalBreakTime + 1 };
      break;
  }
  // Update daily record by adding focus time only during focus sessions
  const updatedDailyRecords = updateDailyRecord(state, additionalFocusTime, 0);
  return {
    sessionTimer: state.sessionTimer - 10,
    ...updateTotalTime,
    dailyRecords: updatedDailyRecords,
  };
};

const send = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Look at that notification',
      body: "I'm so proud of myself!",
    },
    trigger: null,
  });
  console.log('Notification scheduled');
};
