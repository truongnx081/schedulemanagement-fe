
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    major: null
};

const majorSlice = createSlice({
    name: 'major',
    initialState,
    reducers: {
        setMajor(state, action) {
            state.major = action.payload.major;
        },
        removeMajor(state) {
            state.major = null;
        },
    },
});

export const { setMajor, removeMajor } = majorSlice.actions;
export default majorSlice.reducer;
