import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { createCourseApiUrl, token } from '../common/Config'
import CourseImage from '../common/course/CourseImage'
import Rating from '../common/course/Rating'
import CourseLevel from '../common/course/CourseLevel'
import CourseEnrollmentCount from '../common/course/CourseEnrollmentCount'

const CourseCard = ({ course, setCourses }) => {

    const deleteCourse = async (id) => {
        if (confirm("Are you sure, you want to delete?")) {
            try {
                const res = await fetch(`${createCourseApiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const result = await res.json();

                if (result.status === 200) {
                    const newCourses = course.filter(outcome => course.id !== id)
                    setCourses(newCourses);
                    toast.success(result.message);
                } else {
                    console.log("Somthing went wrong.")
                }
            } catch (error) {
                toast.error("Server error. Please try again later.");
            }
        }
    }

    return (
        <div className="col-md-4">
            <div className='card border-0'>
                <div className='card-img-top'>
                    <span className={`fw-bold badge ${course.status == 1 ? "bg-success text-white" : "bg-light text-muted"} position-absolute top-0 end-0 m-2`}>{course.status == 1 ? "Published" : "Draft"}</span>

                    <CourseImage imgUrl={course?.course_small_image} title={course?.title} />
                    
                </div>
                <div className='card-body'>
                    <div className="card-title ">
                        {course.title}
                    </div>
                    <div className="meta d-flex py-2">
                        {course.level &&
                            <CourseLevel level={course.level.name} />
                        }
                        
                        <CourseEnrollmentCount enrollments_count={course.enrollments_count} />

                        <Rating rating={course.rating}/>
                    </div>
                </div>
                <div className="card-footer bg-white">
                    <div className="d-flex py-2 justify-content-between align-items-center">
                        <div className="add-to-cart">
                            <Link to={`/account/courses/edit/${course.id}`} className="btn btn-primary">Edit</Link>
                            <Link onClick={() => deleteCourse(course.id)} className="btn btn-danger ms-2">Delete</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseCard
