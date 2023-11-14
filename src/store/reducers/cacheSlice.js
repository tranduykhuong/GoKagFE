import { createSlice } from '@reduxjs/toolkit';

const cacheSlice = createSlice({
  name: 'cache',
  initialState: {},
  reducers: {
    addToCache: (state, action) => {
      const { cacheKey, data, expiration } = action.payload;
      state[cacheKey] = { data, expiration };
    },
    clearCache: (state, action) => {
      Object.keys(state).forEach((key) => {
        delete state[key];
      });
    },
  },
});

export const { addToCache, clearCache } = cacheSlice.actions;

export default cacheSlice.reducer;
