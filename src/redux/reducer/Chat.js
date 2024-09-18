// http://localhost:3001/api/v1/users/list

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// All Users Get Here
export const getAllConv = createAsyncThunk(
  "getAllConv",
  async (data, { rejectWithValue }) => {
    try {
      const { search } = data;

      const res = await axios.post(
        `http://localhost:3001/api/v1/users/chats?search=${search}`,
        {
          myId: Cookies.get("refreshToken"),
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

export const NewChat = createAsyncThunk(
  "NewChat",
  async (data, { rejectWithValue }) => {
    try {
      const { userId } = data;

      await axios.post(
        `http://localhost:3001/api/v1/users/newChat`,
        {
          userId,
          myId: Cookies.get("refreshToken"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial State
const initialState = {
  currentChat: null,
  updateChat: false,
  data: [],
  loading: false,
  error: null,
  message: null,
  pagination: null,
};

// Slice
const ChatSlice = createSlice({
  name: "chatAPI",
  initialState,
  reducers: {
    handleCurrentChat: (state, action) => {
      state.currentChat = undefined;
      state.updateChat = null;

      state.currentChat = action.payload;

      const index = state.data.findIndex(
        (item) => item._id === action.payload._id
      );

      state.data[index].unreadMessages = 0;
    },
    handleUnreadMessages: (state, action) => {
      const index = state.data.findIndex(
        (item) => item._id === action.payload._id
      );

      state.data[index].unreadMessages = state.data[index].unreadMessages + 1;
    },
    handleReadMessages: (state, action) => {
      const index = state.data.findIndex(
        (item) => item._id === action.payload._id
      );

      state.data[index].unreadMessages = 0;
    },
    handleLastMessage: (state, action) => {
      const { chatId, content, createdAt } = action.payload;

      // update last message based on chatId
      const data = state.data.map((item) => {
        if (item._id === chatId) {
          return {
            ...item,
            lastMessage: {
              content,
              createdAt,
            },
          };
        }
        return item;
      });

      const newChatList = data.filter((chat) => chat._id !== chatId);

      const currentChatIndex = data.filter((chat) => chat._id === chatId);

      newChatList.unshift(currentChatIndex[0]);

      state.data = newChatList;
    },
    handleOnline: (state, action) => {
      state.currentChat.online = action.payload;
    },
  },
  extraReducers: {
    [getAllConv.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllConv.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    [getAllConv.rejected]: (state, action) => {
      state.loading = false;
      state.error = action;
    },
  },
});

export const {
  handleCurrentChat,
  handleLastMessage,
  handleOnline,
  handleUnreadMessages,
  handleReadMessages,
} = ChatSlice.actions;

export default ChatSlice.reducer;
