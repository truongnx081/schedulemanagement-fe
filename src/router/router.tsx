import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../component/ProtectedRoute.tsx";
import App from "../App.tsx";
import IF from "../component/IF.tsx";
import { getUserScope } from "../utils/authUtils.ts";
import ErrorPage from "../common/ErrorPage.tsx";
import Login from "../common/login/Login.tsx";
import LogoutPage from "../common/LogoutPage.tsx";
import UnAuthorizedPage from "../common/UnAuthorizedPage.tsx";
import { ROLE } from "../enum/Role.tsx";
import HomePage from "../student/home-page/HomePage";
import HomePageInstructor from "../instructor/home-page/HomePageInstructor";
import EventDescription from "../common/event-description/EventDescription";
import NotificationDetail from "..//common/notification/NotificationDetail.tsx";
import PersonalInformation from "../common/personal-information/PersonalInformation.tsx";
import StudySchedule from "../student/study-schedule/StudySchedule";
import ExamSchedule from "../student/exam-schedule/ExamSchedule";
import CurrentSubject from "../student/current-subject/CurrentSubject";
import ChangeSchedule from "../student/current-subject/ChangeSchedule";
import RegisterSubject from "../student/register-subject/RegisterSubject";
import StudyHistory from "../student/study-history/StudyHistory";
import Calendar from "../student/calendar/Calendar";
import FindSubject from "../student/find-subject/FindSubject";
import TeachDay from "../instructor/teach-day/TeachDay";
import CheckAttendance from "../instructor/check-attendance/CheckAttendance";
import StudentList from "../instructor/student-list/StudentList";
import FindSubjectInstructor from "../instructor/find-subject/FindSubjectInstructor";
import TeachManage from "../instructor/teach-manage/TeachManage";
import OffedReplace from "../instructor/offed-replace/OffedReplace";
import ExamArrange from "../instructor/exam-arrange/ExamArrange";
import Statistic from "../admin/statistics/Statistic";
import ClassManage from "../admin/class-manage/ClassManage.tsx";
import TestdayManage from "../admin/testday-manage/TestdayManage.tsx";
import StudentManage from "../admin/student-manage/StudentManage.tsx";
import ScheduleManage from "../admin/schedule-manage/ScheduleManage.tsx";
import SemesterManage from "../admin/semester-manage/SemesterManage.tsx";
import InstructorManage from "../admin/instructor-manage/InstructorManage.tsx";
import EventManage from "../admin/event-manage/EventManage.tsx";
import EducationProgramManage from "../admin/education-program-manage/EducationProgramManage.tsx";
import SubjectManage from "../admin/subject-manage/SubjectManage.tsx";
import MarkedBoard from "../student/marked-board/MarkedBoard.jsx";


const role = getUserScope();

const router = createBrowserRouter([
  {
    path: "/dang-nhap",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dang-xuat",
    element: <LogoutPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/unauthorized",
    element: <UnAuthorizedPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute
        allowedRoles={[ROLE.ADMIN, ROLE.STUDENT, ROLE.INSTRUCTOR]}
      >
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <>
            <IF condition={role === ROLE.STUDENT}>
              <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
                <HomePage />
              </ProtectedRoute>
            </IF>
            <IF condition={role === ROLE.INSTRUCTOR}>
              <ProtectedRoute allowedRoles={[ROLE.INSTRUCTOR]}>
                <HomePageInstructor />
              </ProtectedRoute>
            </IF>
            <IF condition={role === ROLE.ADMIN}>
              <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
                <Statistic />
              </ProtectedRoute>
            </IF>
          </>
        ),
      },

      // {
      //   path: "/thong-tin-ca-nhan",
      //   element:
      //     <>
      //       <IF condition={role === ROLE.STUDENT}>
      //         < ProtectedRoute allowedRoles={[ROLE.STUDENT]} >
      //           <PersonalInformation />
      //         </ProtectedRoute>
      //       </IF>
      //       <IF condition={role === ROLE.INSTRUCTOR}>
      //         <ProtectedRoute allowedRoles={[ROLE.INSTRUCTOR]}>
      //           <PersonalInformation />
      //         </ProtectedRoute>
      //       </IF>
      //       <IF condition={role === ROLE.ADMIN}>
      //         <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
      //           <PersonalInformation />
      //         </ProtectedRoute>
      //       </IF>
      //     </>
      // },

      // COMMON ROLE
      {
        path: "/su-kien/:nameEvent",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT, ROLE.INSTRUCTOR]}>
            <EventDescription />
          </ProtectedRoute>
        ),
      },
      {
        path: "/thong-bao/:nameNotification",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT, ROLE.INSTRUCTOR, ROLE.ADMIN]}>
            <NotificationDetail />
          </ProtectedRoute>
        ),
      },

      // STUDENT ROLE
      {
        path: "/thong-tin-ca-nhan",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <PersonalInformation />
          </ProtectedRoute>
        ),
      },
      {
        path: "/lich-hoc",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <StudySchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: "/lich-thi",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <ExamSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mon-hoc-hien-tai",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <CurrentSubject />
          </ProtectedRoute>
        ),
      },
      {
        path: "/doi-lich-hoc/:codeSubject",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <ChangeSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dang-ky-mon-hoc",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <RegisterSubject />
          </ProtectedRoute>
        ),
      },
      {
        path: "/lich-su-hoc-tap",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <StudyHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bang-diem",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <MarkedBoard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/lich",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <Calendar />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tim-kiem-mon-hoc",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.STUDENT]}>
            <FindSubject />
          </ProtectedRoute>
        ),
      },

      // INSTRUCTOR ROLE
      {
        path: "/lich-day",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.INSTRUCTOR]}>
            <TeachDay />
          </ProtectedRoute>
        ),
      },
      {
        path: "/diem-danh/:codeSubject/:codeClazz",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.INSTRUCTOR]}>
            <CheckAttendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "/danh-sach-sinh-vien/:codeSubject/:codeClazz",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.INSTRUCTOR]}>
            <StudentList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tim-mon-hoc",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.INSTRUCTOR]}>
            <FindSubjectInstructor />
          </ProtectedRoute>
        ),
      },
      {
        path: "/danh-sach-lop-day",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.INSTRUCTOR]}>
            <TeachManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dat-lai-lich-nghi",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.INSTRUCTOR]}>
            <OffedReplace />
          </ProtectedRoute>
        ),
      },
      {
        path: "/xep-dot-thi/:codeSubject/:codeClazz",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.INSTRUCTOR]}>
            <ExamArrange />
          </ProtectedRoute>
        ),
      },

      // ADMIN ROLE
      {
        path: "/quan-ly-sinh-vien",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <StudentManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quan-ly-giang-vien",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <InstructorManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quan-ly-su-kien",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <EventManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quan-ly-chuong-trinh-dao-tao",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <EducationProgramManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quan-ly-mon-hoc",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <SubjectManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quan-ly-hoc-ky",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <SemesterManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quan-ly-lop-hoc",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <ClassManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quan-ly-lich-hoc",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <ScheduleManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quan-ly-lich-thi",
        element: (
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <TestdayManage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
