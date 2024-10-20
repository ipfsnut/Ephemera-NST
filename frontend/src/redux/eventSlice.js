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
  responses: []
};

export const fetchExperiments = createAsyncThunk(
  'event/fetchExperiments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/events/experiments');
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
      })
      .addCase(fetchExperiment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setExperimentState, setCurrentDigit, addResponse, resetExperiment } = eventSlice.actions;

export const selectExperimentState = (state) => state.event.experimentState;
export default eventSlice.reducer;