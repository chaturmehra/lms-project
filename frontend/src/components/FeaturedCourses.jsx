import { useEffect, useState } from 'react';
import Course from './Course'
import { fetchFeaturedCourses, token } from './common/Config';
import { CourseCardSkeleton } from './common/course/CourseCardSkeleton';

const FeaturedCourses = () => {

    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState();

    const getFeaturedCourses = async () => {
        try {
            setLoading(true)
            const res = await fetch(fetchFeaturedCourses, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();
            setLoading(false)
            if (result.status === 200) {
                setFeaturedCourses(result.data);
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        getFeaturedCourses();
    }, [])

    return (
        <section className='section-3 my-5'>
            <div className="container">
                <div className='section-title py-3  mt-4'>
                    <h2 className='h3'>Featured Courses</h2>
                    <p>Discover courses designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className="row gy-4">
                    {loading && [...Array(4)].map((_, index) => <CourseCardSkeleton key={index} addClass="col-lg-3" />)}
                    {loading == false &&
                        featuredCourses?.map(course =>
                            <Course
                                key={course.id}
                                course={course}
                                customClasses="col-lg-3 col-md-6"
                            />
                        )
                    }
                </div>
            </div>
        </section>
    )
}

export default FeaturedCourses
