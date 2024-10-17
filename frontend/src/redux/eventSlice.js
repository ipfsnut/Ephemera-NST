import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5069/api';

export const fetchEvent = createAsyncThunk(
  'event/fetchEvent',
  async (id, { rejectWithValue }) => {
    console.log('Fetching event with ID:', id);
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${id}`);
      console.log('Event fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (eventData) => {
    const response = await axios.post(`${API_BASE_URL}/events`, eventData);
    return response.data;
  }
);

export const generateExperiment = createAsyncThunk(
  'event/generateExperiment',
  async () => {
    const response = await axios.post(`${API_BASE_URL}/events/generate`);
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

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    currentEvent: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentEvent = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })
      .addCase(generateExperiment.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })
      .addCase(saveExperimentResponse.fulfilled, (state, action) => {
        // Update state if needed after saving response
      });
  }
});

export default eventSlice.reducer;