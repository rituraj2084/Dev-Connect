import { createSlice } from '@reduxjs/toolkit';

const requestsSlice = createSlice({
  name: 'requests',
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequest: (state, action) => {
      console.log('state: ', state);
      console.log('action: ', action);
      const newRequests = state.filter((user) => user._id !== action.payload);
      return newRequests;
    },
  },
});

export const { addRequests, removeRequest } = requestsSlice.actions;
export default requestsSlice.reducer;
