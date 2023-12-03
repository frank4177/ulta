import {createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface  isSending{
  value:string
}

const initialState: isSending = {
  value: ""
}

const userSlice = createSlice({
  name: 'u',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  
  },
});

export const {login} = userSlice.actions;
export default userSlice.reducer;