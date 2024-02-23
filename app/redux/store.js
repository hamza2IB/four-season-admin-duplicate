'use client'

import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import userReducer from './slices/user'

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['user'],
}

const rootReducer = combineReducers({
	user: userReducer,
	// blogs: blogReducer,
	// inboxes: inboxReducer,
	// quotations: quotationReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
})

export const persistor = persistStore(store)
