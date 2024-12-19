import { combineReducers } from 'redux';
import userReducer from './userSlice.tsx'; // Giả sử bạn đã có userReducer
import courseReducer from './courseSlice.tsx'
import majorReducer from './majorSlice.tsx'

// Kết hợp tất cả các reducer của bạn
const rootReducer = combineReducers({
    user: userReducer, // Đặt tên reducer và import reducer tương ứng
    course: courseReducer,
    major: majorReducer,
    // Thêm các reducer khác ở đây nếu cần
});

export default rootReducer;
