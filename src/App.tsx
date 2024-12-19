import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import SideBar from "./component/sidebar/Sidebar.tsx";
import Header from "./component/sidebar/Header.tsx";
import Footer from "./component/Footer.jsx";
import { useDispatch } from 'react-redux';
import { getStudentInfo } from './api/Student.js'
import { getAdminInforAPI } from './api/admin.js'
import { getInstructorInforAPI } from './api/Instructor.js'
import { setUser } from './reducers/userSlice.tsx';
import { getUserScope } from "./utils/authUtils.ts";
import { initFlowbite } from 'flowbite';
import { ROLE } from './enum/Role.tsx'
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [sideMenuIsExpand, setSideMenuIsExpand] = useState(true);
  const dispatch = useDispatch();

  const handleUserInfor = async () => {
    const role = getUserScope();
    let response;
    try {
      if (role === ROLE.ADMIN) {
        response = await getAdminInforAPI();
      }
      else if (role === ROLE.STUDENT) {
        response = await getStudentInfo();
      }
      else if (role === ROLE.INSTRUCTOR) {
        response = await getInstructorInforAPI();
      }
      if (response && response.statusCode === 200) {
        dispatch(setUser({
          userInfo: response.data,
        }));
      }
    } catch (error) {
      console.log("Lỗi lấy thông tin sinh viên: ", error)
    }
  }


  useEffect(() => {
    handleUserInfor();
    initFlowbite(); // Reinitialize Flowbite components
  }, []);

  return (
    <>
      <Header />
      <div className="relative min-h-screen md:flex">
        {/* sidemenu */}
        <SideBar setExpand={setSideMenuIsExpand} />
        {/* content */}
        <div
          className={`flex-1 min-h-screen mx-0 bg-slate-100 transition-all duration-300 ease-in-out ${sideMenuIsExpand ? "md:ml-72" : "md:ml-20"
            }`}
        >
          <Outlet />
          <Footer />
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
    </>
  );
}

export default App;
