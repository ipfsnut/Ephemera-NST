import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = window.REACT_APP_API_BASE_URL || 'http://localhost:5069/api';

export const fetchEvent = createAsyncThunk(
  'event/fetchEvent',
  async (id, { getState }) => {
    const { event } = getState();
    if (event.cachedEvents[id]) {
      return event.cachedEvents[id];
    }
    const response = await axios.get(`${API_BASE_URL}/events/${id}`);
    return response.data;
  }
);

export const generateExperiment = createAsyncThunk(
  'event/generateExperiment',
  async (currentConfig) => {
    const response = await axios.post(`${API_BASE_URL}/events/generate`, { currentConfig });
    return response.data;
  }
);

export const saveExperimentResponse = createAsyncThunk(
  'event/saveExperimentResponse',
  async ({ id, responseData }) => {
    const response = await axios.post(`${API_BASE_URL}/events/${id}/responses`, responseData);
    return response.data;
  }
);

const initialState = {
  currentEvent: null,
  status: 'idle',
  error: null,
  cachedEvents: {},
  trials: [],
  experimentState: 'INITIALIZING',
  currentTrialIndex: 0,
  currentDigit: null,
  responses: []
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setExperimentState: (state, action) => {
      if (state.experimentState !== action.payload) {
        state.experimentState = action.payload;
      }
    },
    setCurrentTrial: (state, action) => {
      state.currentTrialIndex = action.payload;
    },
    setCurrentDigit: (state, action) => {
      state.currentDigit = action.payload;
    },
    addResponse: (state, action) => {
      state.responses.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentEvent = action.payload;
        state.cachedEvents[action.payload.id] = action.payload;
        if (action.payload.trials) {
          state.trials = action.payload.trials;
        }
        state.experimentState = 'READY';
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(generateExperiment.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
        state.cachedEvents[action.payload.id] = action.payload;
        state.trials = action.payload.trials;
        state.experimentState = 'READY';
      })
      .addCase(saveExperimentResponse.fulfilled, (state, action) => {
        // Handle successful response save if needed
      });
  }
});

export const { setExperimentState, setCurrentTrial, setCurrentDigit, addResponse } = eventSlice.actions;

// Selectors
export const selectCurrentEvent = state => state.event.currentEvent;
export const selectExperimentState = state => state.event.experimentState;
export const selectCurrentTrial = state => state.event.trials[state.event.currentTrialIndex];
export const selectCurrentDigit = state => state.event.currentDigit;
export const selectTrialProgress = createSelector(
  state => state.event.currentTrialIndex,
  state => state.event.trials.length,
  (currentIndex, totalTrials) => ({
    current: currentIndex + 1,
    total: totalTrials,
    percentage: ((currentIndex + 1) / totalTrials) * 100
  })
);

export default eventSlice.reducer;