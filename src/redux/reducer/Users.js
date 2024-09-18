// http://localhost:3001/api/v1/users/list

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// All Users Get Here
export const getUsers = createAsyncThunk(
  "getUsers",
  async (data, { rejectWithValue }) => {
    try {
      const { search } = data;
      const res = await axios.get(
        `http://localhost:3001/api/v1/users/list?search=${search}&user_id=${Cookies.get(
          "refreshToken"
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.data;
      return result;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial State
const initialState = {
  data: [],
  loading: false,
  error: null,
  message: null,
  pagination: null,
};

// Slice
const UsersSlice = createSlice({
  name: "adminApi",
  initialState,
  reducers: {},
  extraReducers: {
    [getUsers.pending]: (state, action) => {
      state.loading = true;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    [getUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action;
    },
  },
});

// Actions

export default UsersSlice.reducer;
