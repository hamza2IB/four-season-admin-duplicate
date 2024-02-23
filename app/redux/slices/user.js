import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	userData: {},
	token: null,
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserData: (state, action) => {
			state.userData = action.payload.user
			state.token = action.payload.token
		},
	},
})

export const { setUserData } = userSlice.actions

export default userSlice.reducer
