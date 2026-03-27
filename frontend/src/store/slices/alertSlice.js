import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api' || "https://elder-health-system-2c6i.vercel.app/api";

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE}/alerts`, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const alertSlice = createSlice({
  name: 'alerts',
  initialState: {
    alerts: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default alertSlice.reducer;

