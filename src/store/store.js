import { configureStore } from '@reduxjs/toolkit';
import photoReducer from './reducers/photoSlice';
import cacheReducer from './reducers/cacheSlice';

const rootReducer = {
  photos: photoReducer,
  cache: cacheReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
