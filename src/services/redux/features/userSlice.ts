import {createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostMessageParamType, userDataType } from '../../../types';

export interface  isSending{
  value:string
  twitter: PostMessageParamType,
  op: string | undefined 
  userData: userDataType | null
}

const initialState: isSending = {
  value: "",
  twitter: {},
  op: "",
  userData: null
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
    setOTP: (state, action: PayloadAction<string | undefined>) => {
      state.op = action.payload
    },
    userData: (state, action: PayloadAction<userDataType>) => {
      state.userData = action.payload
    },
  },
});

export const {login, logout, twitterData,setOTP, userData} = userSlice.actions;
export default userSlice.reducer;