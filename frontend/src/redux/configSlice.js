import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import { initialConfig } from '../Experiments/NumberSwitchingTask/config';

const API_BASE_URL = window.REACT_APP_API_BASE_URL || 'http://localhost:5069/api';

export const fetchConfig = createAsyncThunk(
  'config/fetchConfig',
  async (configId) => {
    const response = await axios.get(`${API_BASE_URL}/api/configs/${configId}`, {
      withCredentials: true
    });
    return response.data;
  }
);

export const saveConfig = createAsyncThunk(
  'config/saveConfig',
  async (configData) => {
    const response = await axios.post(`${API_BASE_URL}/api/configs`, configData, {
      withCredentials: true
    });
    return response.data;
  }
);

export const updateConfig = createAsyncThunk(
  'config/updateConfig',
  async ({ id, configData }) => {
    const response = await axios.put(`${API_BASE_URL}/events/experiments/${id}/config`, configData, {
      withCredentials: true
    });
    return response.data;
  }
);

const initialState = {
  experimentState: 'INITIALIZING',
  currentTrial: 0,
  totalTrials: 0,
  trialProgress: [],
  currentConfig: {
    ...initialConfig,
    numTrials: initialConfig.TOTAL_TRIALS
  },
  status: 'idle',
  error: null
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setExperimentState: (state, action) => {
      state.experimentState = action.payload;
    },
    setCurrentTrial: (state, action) => {
      state.currentTrial = action.payload;
    },
    setTotalTrials: (state, action) => {
      console.log('configSlice: setTotalTrials payload:', action.payload);
      state.totalTrials = action.payload;
      console.log('configSlice: Updated totalTrials:', state.totalTrials);
    },
    updateTrialProgress: (state, action) => {
      state.trialProgress.push(action.payload);
    },
    resetExperimentState: (state) => {
      state.experimentState = 'INITIALIZING';
      state.currentTrial = 0;
      state.trialProgress = [];
      state.totalTrials = state.currentConfig.numTrials;
      console.log('configSlice: resetExperimentState - Updated state:', state);
    },
    setCurrentDigit: (state, action) => {
      state.currentDigit = action.payload;
    },
    addResponse: (state, action) => {
      state.trialProgress.push(action.payload);
    },
    incrementTrialIndex: (state) => {
      state.currentTrial += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentConfig = action.payload;
        state.totalTrials = action.payload.numTrials;
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        console.log('updateConfig fulfilled. Payload:', action.payload);
        state.status = 'succeeded';
        state.currentConfig = {
          ...state.currentConfig,
          ...action.payload,
          difficultyLevel: Number(action.payload.difficultyLevel)
        };
        state.totalTrials = action.payload.numTrials;
        console.log('Updated state:', state);
      });
  },
});

export const {
  setExperimentState,
  setCurrentTrial,
  setTotalTrials,
  updateTrialProgress,
  resetExperimentState,
  setCurrentDigit,
  addResponse,
  incrementTrialIndex
} = configSlice.actions;

export const selectCurrentConfig = createSelector(
  state => state.config,
  config => config.currentConfig
);

export const selectExperimentState = createSelector(
  state => state.config,
  config => config.experimentState
);

export const selectCurrentTrial = createSelector(
  state => state.config,
  config => config.currentTrial
);

export const selectTotalTrials = createSelector(
  state => state.config,
  config => config.totalTrials
);

export const selectTrialProgress = createSelector(
  state => state.config,
  config => config.trialProgress
);

export default configSlice.reducer;