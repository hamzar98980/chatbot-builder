// http://localhost:3001/api/v1/users/list

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// All Users Get Here
export const getAllMessage = createAsyncThunk(
  "getAllMessage",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/v1/users/allMessages?skip=${data.pageNo}&limit=10`,
        {
          myId: Cookies.get("refreshToken"),
          chatId: data.chatId,
        },
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

// Send a Message
export const sendMessage = createAsyncThunk(
  "sendMessage",
  async (data, { rejectWithValue }) => {
    try {
      const { content, chatId, myId } = data;

      const res = await axios.post(
        "http://localhost:3001/api/v1/users/sendMessage",
        {
          content,
          chatId,
          myId,
        },
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

// Mutual Groups
export const mutualGroups = createAsyncThunk(
  "mutualGroups",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/users/mutual-groups",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.data.data;

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
  newMessage: null,
  mutualGroupsList: [],
};

// Slice
const MessageSlice = createSlice({
  name: "getAllMessageAPI",
  initialState,
  reducers: {
    clearMessages: (state, action) => {
      state.data = undefined;
      state.data = [];
    },
    clearNewMessage: (state, action) => {
      state.newMessage = undefined;
      state.newMessage = null;
    },
    handleReceiveMessage: (state, action) => {
      const newMessage = action.payload;

      if (state.data.find((message) => message._id == newMessage._id)) {
        return;
      } else {
        state.data.push(newMessage);
      }
    },
    readMessages: (state, action) => {
      state.data.forEach((message) => {
        message.isRead = true;
      });
    },
  },
  extraReducers: {
    [getAllMessage.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllMessage.fulfilled]: (state, action) => {
      const newMessages = action.payload.data.map((message) => ({
        ...message,
        updatedAt: new Date(message.updatedAt).toISOString(), // Convert updatedAt to ISO string
        createdAt: new Date(message.createdAt).toISOString(), // Convert createdAt to ISO string
      }));

      const newMessageIds = newMessages.map((message) => message._id);

      const filteredData = state.data.filter(
        (message) => !newMessageIds.includes(message._id)
      );

      state.data = [...newMessages, ...filteredData];

      state.pagination = action.payload.pagination;
      state.loading = false;
    },
    [getAllMessage.rejected]: (state, action) => {
      state.loading = false;
      state.error = action;
    },
    [sendMessage.fulfilled]: (state, action) => {
      const newMessage = action.payload.data;
      newMessage.sendByMe = true;
      newMessage.updatedAt = new Date(newMessage.updatedAt).toISOString();
      newMessage.createdAt = new Date(newMessage.createdAt).toISOString();
      state.data.push(newMessage);
      state.loading = false;
      state.newMessage = newMessage;
    },
    [mutualGroups.fulfilled]: (state, action) => {
      state.mutualGroupsList = action.payload;
      state.loading = false;
    },
  },
});

export const {
  clearMessages,
  handleReceiveMessage,
  clearNewMessage,
  readMessages,
} = MessageSlice.actions;

export default MessageSlice.reducer;
