import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

const initialState = {
  experiments: [],
  currentExperiment: null,
  status: 'idle',
  error: null,
  experimentState: 'INITIALIZING',
  currentTrialIndex: 0,
  currentDigit: null,
  responses: [],
  totalTrials: 0
};

export const fetchExperiments = createAsyncThunk(
  'event/fetchExperiments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/events/experiments');
      console.log('API response:', JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error('Error fetching experiments:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchExperiment = createAsyncThunk(
  'event/fetchExperiment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/events/experiments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching experiment:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAboutInfo = createAsyncThunk(
  'event/fetchAboutInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/events/about');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setExperimentState: (state, action) => {
      state.experimentState = action.payload;
    },
    setCurrentDigit: (state, action) => {
      state.currentDigit = action.payload;
    },
    addResponse: (state, action) => {
      state.responses.push(action.payload);
    },
    resetExperiment: (state) => {
      state.currentTrialIndex = 0;
      state.responses = [];
      state.experimentState = 'INITIALIZING';
      state.currentDigit = null;
    },
    initializeExperiment: (state, action) => {
      state.currentExperiment = action.payload;
      state.experimentState = 'READY';
      state.currentTrialIndex = 0;
      state.responses = [];
      state.totalTrials = action.payload.trials.length;
    },
    incrementTrialIndex: (state) => {
      state.currentTrialIndex += 1;
      if (state.currentTrialIndex >= state.totalTrials) {
        state.experimentState = 'EXPERIMENT_COMPLETE';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExperiments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.experiments = action.payload;
      })
      .addCase(fetchExperiments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchExperiment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExperiment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentExperiment = action.payload;
        state.experimentState = 'READY';
        state.currentTrialIndex = 0;
        state.responses = [];
        state.totalTrials = action.payload.trials.length;
      })
      .addCase(fetchExperiment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { 
  setExperimentState, 
  setCurrentDigit, 
  addResponse, 
  resetExperiment, 
  initializeExperiment,
  incrementTrialIndex
} = eventSlice.actions;

import { createSelector } from '@reduxjs/toolkit';

export const selectExperimentState = createSelector(
  state => state.event,
  event => ({
    experimentState: event.experimentState,
    currentTrialIndex: event.currentTrialIndex,
    currentDigit: event.currentDigit,
    totalTrials: event.totalTrials,
    currentExperiment: event.currentExperiment
  })
);
export default eventSlice.reducer;