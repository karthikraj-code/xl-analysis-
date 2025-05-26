import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const uploadFile = createAsyncThunk(
  'files/upload',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserFiles = createAsyncThunk(
  'files/getUserFiles',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFileData = createAsyncThunk(
  'files/getFileData',
  async (fileId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  files: [],
  currentFile: null,
  loading: false,
  error: null
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload File
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files.unshift(action.payload.file);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'File upload failed';
      })
      // Get User Files
      .addCase(getUserFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(getUserFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch files';
      })
      // Get File Data
      .addCase(getFileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
      })
      .addCase(getFileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch file data';
      });
  }
});

export const { clearCurrentFile, clearError } = filesSlice.actions;
export default filesSlice.reducer; 