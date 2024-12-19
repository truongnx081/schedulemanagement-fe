// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    userInfo: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.isLoggedIn = true;
            state.userInfo = action.payload.userInfo;
        },
        logoutUser(state) {
            state.isLoggedIn = false;
            state.userInfo = null;
        },
    },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
