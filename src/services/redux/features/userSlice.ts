import {createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface  isSending{
  value:string
  token: string
}

const initialState: isSending = {
  value: "",
  token:""
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
    twitterAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
  },
});

export const {login, logout, twitterAccessToken} = userSlice.actions;
export default userSlice.reducer;