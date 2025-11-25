import { Link } from 'react-router-dom'
import CourseImage from '../../components/common/course/CourseImage'
import CourseLevel from '../../components/common/course/CourseLevel'
import CourseEnrollmentCount from '../../components/common/course/CourseEnrollmentCount'
import Rating from '../../components/common/course/Rating'

const EnrolledCourses = ({ enrollment }) => {
  return (
    <div className="col-md-4">
      <div className='card border-0'>
        <div className='card-img-top'>

          <CourseImage imgUrl={enrollment?.course?.course_small_image} title={enrollment?.course?.title} />

        </div>
        <div className='card-body'>
          <div className="card-title">
            {enrollment.course.title}
          </div>

          <div className="meta d-flex py-2">
            {enrollment?.course?.level &&
              <CourseLevel level={enrollment.course.level.name} />
            }

            <CourseEnrollmentCount enrollments_count={enrollment.course.enrollments_count} />

            <Rating rating={enrollment.course.rating} />
          </div>

        </div>
        <div className="card-footer bg-white">
          <div className="d-flex py-2 justify-content-between align-items-center">
            <div className="add-to-cart">
              <Link to={`/account/watch-course/${enrollment.course_id}`} className="btn btn-primary" >Watch Now</Link>
            </div>
            <Link to={`/account/leave-rating/${enrollment.course_id}`}>Leave rating</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnrolledCourses