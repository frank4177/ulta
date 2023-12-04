import {createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostMessageParamType } from '../../../types';

export interface  isSending{
  value:string
  twitter: PostMessageParamType
}

const initialState: isSending = {
  value: "",
  twitter: {}
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
    logout: (state) => {
      state.value = ""
    },
    twitterData: (state, action: PayloadAction<PostMessageParamType>) => {
      state.twitter = action.payload
    },
  },
});

export const {login, logout, twitterData} = userSlice.actions;
export default userSlice.reducer;