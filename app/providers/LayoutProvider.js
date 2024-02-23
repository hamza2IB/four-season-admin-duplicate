'use client'
import React from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '../redux/store'

const CustomProvider = ({ children }) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
				<ToastContainer
					position='top-right'
					autoClose={10000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					draggable
					pauseOnHover
					theme='light'
				/>
			</PersistGate>
		</Provider>
	)
}

export default CustomProvider
