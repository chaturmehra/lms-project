import React from 'react'
import { Link } from 'react-router-dom'
import CourseImage from './common/course/CourseImage'
import { BsBriefcase, BsFillStarFill } from 'react-icons/bs'
import Rating from './common/course/Rating'
import CourseLevel from './common/course/CourseLevel'
import CourseEnrollmentCount from './common/course/CourseEnrollmentCount'
import { currency } from './common/Config'

const Course = ({ course, customClasses }) => {

    return (
        <div className={customClasses}>
            <div className='card border-0'>
                <div className='card-img-top'>
                    <CourseImage imgUrl={course?.course_small_image} title={course?.title} />
                </div>
                <div className='card-body'>
                    <div className="card-title">
                        {course?.title}
                    </div>
                    <div className="meta d-flex py-2">
                        {course?.level &&
                            <CourseLevel level={course.level.name} />
                        }

                        <CourseEnrollmentCount enrollments_count={course.enrollments_count} />
                        
                        <Rating rating={course.rating}/>

                    </div>
                </div>
                <div className="card-footer bg-white">
                    <div className="d-flex py-2 justify-content-between align-items-center">
                        {course?.price && <div className="price">{currency}{course.price}</div>}

                        <div className="add-to-cart">
                            <Link to={`/course-detail/${course.id}`} className="btn btn-primary" >Read More</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course