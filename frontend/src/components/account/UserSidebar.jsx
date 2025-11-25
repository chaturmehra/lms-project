import React, { useContext } from 'react'
import { FaChartBar, FaDesktop, FaUserCircle, FaUserLock } from "react-icons/fa";
import { BsMortarboardFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const UserSidebar = () => {

    const { logout } = useContext(AuthContext)

    return (
        <div className='card border-0 shadow-lg mb-3'>
            <div className='card-body p-4'>
                <ul>
                    <li className='d-flex align-items-center'>
                        <NavLink to="/account/dashboard" className={({ isActive }) => (isActive ? "active-link" : "")}><FaChartBar size={16} className='me-2 ' /> Dashboard</NavLink>
                    </li>
                    <li className='d-flex align-items-center'>
                        <NavLink to="/my-account" className={({ isActive }) => (isActive ? "active-link" : "")}><FaUserCircle size={16} className='me-2 ' /> My Account</NavLink>
                    </li>

                    <li className='d-flex align-items-center'>
                        <NavLink to="/account/my-learning" className={({ isActive }) => (isActive ? "active-link" : "")}><BsMortarboardFill size={16} className='me-2' /> My Enrollments</NavLink>
                    </li>
                    <li className='d-flex align-items-center'>
                        <NavLink to="/account/my-courses" className={({ isActive }) => (isActive ? "active-link" : "")}><FaDesktop size={16} className='me-2' /> My Courses</NavLink>
                    </li>
                    <li className='d-flex align-items-center '>
                        <NavLink to="/account/change-password" className={({ isActive }) => (isActive ? "active-link" : "")}><FaUserLock size={16} className='me-2' /> Change Password</NavLink>
                    </li>
                    <li>
                        <Link onClick={logout} className='text-danger'><MdLogout size={16} className='me-2' /> Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default UserSidebar
