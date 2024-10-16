import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5069';

export const fetchExperiment = createAsyncThunk(
  'event/fetchExperiment',
  async (experimentId) => {
    const response = await axios.get(`${API_BASE_URL}/api/experiments/${experimentId}`, {
      withCredentials: true
    });
    return response.data;
  }
);

export const createExperiment = createAsyncThunk(
  'event/createExperiment',
  async (experimentData) => {
    const response = await axios.post(`${API_BASE_URL}/api/experiments`, experimentData, {
      withCredentials: true
    });
    return response.data;
  }
);

export const updateExperiment = createAsyncThunk(
  'event/updateExperiment',
  async ({ id, experimentData }) => {
    const response = await axios.put(`${API_BASE_URL}/api/experiments/${id}`, experimentData, {
      withCredentials: true
    });
    return response.data;
  }
);

export const deleteExperiment = createAsyncThunk(
  'event/deleteExperiment',
  async (experimentId) => {
    await axios.delete(`${API_BASE_URL}/api/experiments/${experimentId}`, {
      withCredentials: true
    });
    return experimentId;
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    currentExperiment: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExperiment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentExperiment = action.payload;
      })
      .addCase(fetchExperiment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createExperiment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentExperiment = action.payload;
      })
      .addCase(updateExperiment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentExperiment = action.payload;
      })
      .addCase(deleteExperiment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentExperiment = null;
      });
  },
});

export default eventSlice.reducer;