import { create } from 'zustand';

import { GeneralSettings, GeneralSettingsTypes } from './GeneralSettings';

export const settingStore = create<GeneralSettingsTypes>()((...a) => ({
  ...GeneralSettings(...a),
}));
