import React, { useEffect, useState } from 'react'
import UserSidebar from '../../components/account/UserSidebar'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import { myCoursesApiUrl, token } from '../../components/common/Config'
import CourseCard from '../../components/account/CourseCard'
import Loading from '../../components/common/Loading'
import NotFound from '../../components/common/NotFound'
import { CourseCardSkeleton } from '../../components/common/course/CourseCardSkeleton'

const MyCourses = () => {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {

    try {
      setLoading(true);
      const res = await fetch(`${myCoursesApiUrl}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const result = await res.json();
      setLoading(false);
      if (result.status === 200) {
        setCourses(result.courses)
      } else {
        console.log("Somthing went wrong.")
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  }

  useEffect(() => {
    fetchCourses();
  }, [])

  return (
    <section className='section-4'>
      <div className='container pb-5 pt-3'>

        <Breadcrumb page_name={"My Courses"} />

        <div className='row'>
          <div className='col-md-12 mt-5 mb-3'>
            <div className='d-flex justify-content-between'>
              <h2 className='h4 mb-0 pb-0'>My Courses</h2>
              <Link to="/account/courses/create" className='btn btn-primary'>Create</Link>
            </div>
          </div>
          <div className='col-lg-3 account-sidebar'>
            <UserSidebar />
          </div>
          <div className='col-lg-9'>
            <div className='row gy-4'>
              {loading && [...Array(3)].map((_, index) => <CourseCardSkeleton key={index} addClass="col-lg-4"/>)}
              {loading === false && courses.length == 0 && <NotFound />}

              {loading === false &&
                courses && courses?.map(course => {
                  return (
                    <CourseCard
                      course={course}
                      key={course.id}
                      setCourses={setCourses}
                    />
                  )
                })
              }

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyCourses