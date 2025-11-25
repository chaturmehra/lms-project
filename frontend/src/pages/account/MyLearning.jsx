import React, { useEffect, useState } from 'react'
import UserSidebar from '../../components/account/UserSidebar'
import EnrolledCourses from './EnrolledCourses'
import Breadcrumb from '../../components/common/Breadcrumb'
import { enrollmentsApiUrl, token } from '../../components/common/Config'
import Loading from '../../components/common/Loading'
import toast from 'react-hot-toast'
import NotFound from '../../components/common/NotFound'
import { CourseCardSkeleton } from '../../components/common/course/CourseCardSkeleton'

const MyLearning = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const res = await fetch(enrollmentsApiUrl, {
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
                setEnrollments(result.data);
            }
        } catch (error) {
            setLoading(false);
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        fetchEnrollments();
    }, [])

    return (
        <section className='section-4'>
            <div className='container pb-5 pt-3'>

                <Breadcrumb page_name={"My Learning"} />

                <div className='row'>
                    <div className='d-flex justify-content-between  mt-5 mb-3'>
                        <h2 className='h4 mb-0 pb-0'>My Learning</h2>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar />
                    </div>
                    <div className='col-lg-9'>
                        <div className='row gy-4'>
                            {loading && [...Array(3)].map((_, index) => <CourseCardSkeleton key={index} addClass="col-lg-4"/>)}
                            {loading === false && enrollments.length == 0 && <NotFound />}

                            {loading === false &&
                                enrollments?.map(enrollment =>
                                    <EnrolledCourses
                                        key={enrollment.id}
                                        enrollment={enrollment}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyLearning
