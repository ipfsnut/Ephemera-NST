import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchExperiment = createAsyncThunk(
  'event/fetchExperiment',
  async (id) => {
    const response = await axios.get(`/api/experiments/${id}`);
    return response.data;
  }
);

export const createExperiment = createAsyncThunk(
  'event/createExperiment',
  async (experimentData) => {
    const response = await axios.post('/api/experiments', experimentData);
    return response.data;
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
      });
  }
});

export default eventSlice.reducer;