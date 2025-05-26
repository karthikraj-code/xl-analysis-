import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const generateChartData = createAsyncThunk(
  'analytics/generateChartData',
  async ({ fileId, xAxis, yAxis, chartType }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/analytics/chart`,
        { fileId, xAxis, yAxis, chartType },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const downloadChart = createAsyncThunk(
  'analytics/downloadChart',
  async ({ fileId, xAxis, yAxis, chartType }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/analytics/chart/download`,
        { fileId, xAxis, yAxis, chartType },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `chart-${Date.now()}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error downloading chart');
    }
  }
);

export const generateInsights = createAsyncThunk(
  'analytics/generateInsights',
  async (fileId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/analytics/insights/${fileId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data.insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return rejectWithValue(error.response?.data?.message || 'Error generating insights');
    }
  }
);

export const getDataSummary = createAsyncThunk(
  'analytics/getDataSummary',
  async (fileId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/analytics/summary/${fileId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  chartData: null,
  insights: null,
  summary: null,
  loading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearChartData: (state) => {
      state.chartData = null;
    },
    clearInsights: (state) => {
      state.insights = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate Chart Data
      .addCase(generateChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
      })
      .addCase(generateChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error generating chart';
      })
      // Download Chart
      .addCase(downloadChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadChart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error downloading chart';
      })
      // Generate Insights
      .addCase(generateInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload;
      })
      .addCase(generateInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Data Summary
      .addCase(getDataSummary.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getDataSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getDataSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching data summary';
      });
  }
});

export const { clearChartData, clearInsights, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 