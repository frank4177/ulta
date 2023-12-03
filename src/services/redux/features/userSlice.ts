import {createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface  isSending{
  value:string
}

const initialState: isSending = {
  value: ""
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
  
  
  },
});

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;