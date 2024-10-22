import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

const initialState = {
  experiments: [],
  currentExperiment: null,
  status: 'idle',
  error: null
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
    resetExperiment: (state) => {
      state.currentExperiment = null;
    },
    initializeExperiment: (state, action) => {
      state.currentExperiment = action.payload;
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

export const {
  resetExperiment,
  initializeExperiment,
} = eventSlice.actions;

export const selectCurrentExperiment = state => state.event.currentExperiment;
export const selectExperiments = state => state.event.experiments;
export const selectEventStatus = state => state.event.status;
export const selectEventError = state => state.event.error;

export default eventSlice.reducer;