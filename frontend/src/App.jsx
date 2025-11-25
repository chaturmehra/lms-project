import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyCourses from './pages/account/MyCourses';
import EnrolledCourses from './pages/account/EnrolledCourses';
import WatchCourses from './pages/account/WatchCourses';
import ChangePassword from './pages/account/ChangePassword';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MyLearning from './pages/account/MyLearning';
import Dashboard from './pages/account/Dashboard';
import CreateCourse from './pages/account/courses/CreateCourse';
import { Toaster } from 'react-hot-toast';
import { RequireAuth } from './components/common/RequireAuth';
import { CheckAuth } from './components/common/CheckAuth';
import EditCourse from './pages/account/courses/EditCourse';
import Account from './pages/account/Account';
import EditLesson from './pages/account/EditLesson';
import LeaveRating from './pages/account/LeaveRating';

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/course-detail/:id' element={<Detail />} />

          <Route element={<CheckAuth />}>
            <Route path='/account/login' element={<Login />} />
            <Route path='/account/register' element={<Register />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path='/account/dashboard' element={<Dashboard />} />
            <Route path='/my-account' element={<Account />} />
            <Route path='/account/courses/create' element={<CreateCourse />} />
            <Route path='/account/courses/edit/:id' element={<EditCourse />} />
            <Route path='/account/my-courses' element={<MyCourses />} />
            <Route path='/account/my-learning' element={<MyLearning />} />
            <Route path='/account/watch-course/:id' element={<WatchCourses />} />
            <Route path='/account/leave-rating/:id' element={<LeaveRating />} />
            <Route path='/account/change-password' element={<ChangePassword />} />
            <Route path='/account/edit-lesson/:id/:courseId' element={<EditLesson />} />
          </Route>

        </Routes>
 
        <Footer />
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </BrowserRouter>
    </>
  )
}

export default App
