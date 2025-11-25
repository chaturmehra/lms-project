import React, { useEffect, useState } from 'react'
import { fetchCategories, token } from './Config';
import { Link } from 'react-router-dom';

const Footer = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState();

    const getCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(fetchCategories, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();
            setLoading(false);
            if (result.status === 200) {
                setCategories(result.data);
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        getCategories();
    }, [])

    return (
        <footer >
            <div className='pt-5 container mt-5'>
                <div className='row pb-3 gy-4 justify-content-center'>

                    <div className='col-lg-3 col-12'>
                        <div className='col-lg-12 col-md-6 col-12 pe-lg-5'>
                            <h2>LMS</h2>
                            <p>Join our Learning Management System and explore a wide range of courses to enhance your skills and achieve your goals.</p>
                        </div>
                    </div>

                    <div className='col-lg-3 col-md-6 col-12'>
                        <h2>Popular Categories</h2>
                        <ul>
                            {loading == false && categories?.slice(0, 5).map(category => {
                                return (
                                    <li key={category.id}><Link to={`/courses?category=${category.id}`}>{category.name}</Link></li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className='col-lg-3 col-md-6 col-12'>
                        <h2>Quick Links</h2>
                        <ul>
                            <li><Link to={`/account/login`}>Login</Link></li>
                            <li><Link to={`/account/register`}>Register</Link></li>
                            <li><Link to={`/my-account`}>My Account</Link></li>
                            <li><Link to={`/courses`}>Courses</Link></li>
                        </ul>
                    </div>

                </div>
                <div className='row copyright'>
                    <div className='col-md-12 text-center py-4'>
                        &copy; {new Date().getFullYear()} All Rights Reserverd
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
