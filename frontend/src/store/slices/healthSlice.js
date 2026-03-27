import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:5000/api' || "https://elder-health-system-2c6i.vercel.app/api";

const initialState = {
  patients: [],
  vitals: [],
  // alerts moved to alertSlice
  latestVitals: null,
  isLoading: false,
  error: null,
};

// Fetch patients (care_manager)
export const fetchPatients = createAsyncThunk(
  'health/fetchPatients',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE}/users`, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch patients');
    }
  }
);

// Fetch vitals for patient
export const fetchVitals = createAsyncThunk(
  'health/fetchVitals',
  async (patientId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE}/health/${patientId}`, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch vitals');
    }
  }
);

// Add vitals
export const addVitals = createAsyncThunk(
  'health/addVitals',
  async ({ patientId, ...vitalsData }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE}/health`, { patientId, ...vitalsData }, { withCredentials: true });
      toast.success('Vitals recorded successfully!');

      // Refresh the vitals list for this patient after add
      thunkAPI.dispatch(fetchVitals(patientId));

      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record vitals');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Toggle workable
export const toggleWorkable = createAsyncThunk(
  'health/toggleWorkable',
  async (patientId, thunkAPI) => {
    try {
      const response = await axios.patch(`${API_BASE}/users/${patientId}/workable`, {}, { withCredentials: true });
      toast.success(`Patient status updated`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPatients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchVitals
      .addCase(fetchVitals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVitals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vitals = action.payload;
        state.latestVitals = action.payload[0] || null;
      })
      .addCase(fetchVitals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // addVitals
      .addCase(addVitals.fulfilled, (state, action) => {
        state.vitals.unshift(action.payload);
        state.latestVitals = action.payload;
      })
      // toggleWorkable
      .addCase(toggleWorkable.fulfilled, (state, action) => {
        const patientIndex = state.patients.findIndex(p => p.id === action.payload.id);
        if (patientIndex !== -1) {
          state.patients[patientIndex].workable = action.payload.workable;
        }
      });
  },
});

export const { clearError } = healthSlice.actions;
export default healthSlice.reducer;

