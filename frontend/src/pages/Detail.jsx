import React, { useEffect, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import ReactPlayer from 'react-player'
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchCourseDetail, convertMinutesToHours, token, enrollCourse, currency } from '../components/common/Config';
import { LuMonitorPlay } from 'react-icons/lu';
import Loading from '../components/common/Loading';
import FreePreview from '../components/common/course/FreePreview';
import toast from 'react-hot-toast';
import CourseImage from '../components/common/course/CourseImage';
import Reviews from '../components/common/Reviews';
import CourseDetailSkeleton from '../components/common/course/CourseDetailSkeleton';

const Detail = () => {

  const [rating, setRating] = useState(4.0);
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [freeLesson, setFreeLesson] = useState();

  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => setShowModal(false);
  const handleShow = (lesson) => {
    setShowModal(true);
    setFreeLesson(lesson)
  };

  const getCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${fetchCourseDetail}/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
        }
      });

      const result = await res.json();
      setLoading(false);
      if (result.status === 200) {
        setCourse(result.data);
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  }

  const handleEnrollCourse = async () => {

    var data = {
      course_id: course.id
    }
    try {
      const res = await fetch(enrollCourse, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("result", result)
      if (result.status === 200) {
        toast.success(result.message)
      } else if (result.status === 401 || result.message === "Unauthenticated.") {
        toast.error("Please login to enroll in this course.")
        // navigate('/account/login');
        navigate(`/account/login?redirect=${location.pathname}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  }

  useEffect(() => {
    getCourse();
  }, [])

  return (
    <>
      {freeLesson &&
        <FreePreview
          showModal={showModal}
          handleClose={handleClose}
          freeLesson={freeLesson}
        />
      }

      <div className='container pb-5 pt-3'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/courses">Courses</Link></li>
            {course?.title && <li className="breadcrumb-item active" aria-current="page">{course?.title}</li>}
          </ol>
        </nav>
        {loading == true && <div className='mt-5'><CourseDetailSkeleton /></div>}
        {loading == false && course &&
          <div className='row my-5'>
            <div className='col-lg-8'>
              <h2>{course.title}</h2>
              <div className='d-flex'>
                <div className='mt-1'>
                  <span className="badge bg-green">{course?.category?.name}</span>
                </div>
                <div className='d-flex ps-3'>
                  <div className="text pe-2 pt-1">{course.rating}</div>
                  <Rating initialValue={course.rating} size={20} readonly />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <span className="text-muted d-block">Level</span>
                  <span className="fw-bold">{course?.level?.name}</span>
                </div>
                <div className="col">
                  <span className="text-muted d-block">Students</span>
                  <span className="fw-bold">{course.enrollments_count}</span>
                </div>
                <div className="col">
                  <span className="text-muted d-block">Language</span>
                  <span className="fw-bold">{course?.language?.name}</span>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12 mt-4'>
                  <div className='border bg-white rounded-3 p-4'>
                    <h3 className='mb-3  h4'>Overview</h3>
                    {course?.description}
                  </div>
                </div>
                <div className='col-md-12 mt-4'>
                  <div className='border bg-white rounded-3 p-4'>
                    <h3 className='mb-3 h4'>What you will learn</h3>
                    <ul className="list-unstyled mt-3">
                      {course.outcomes && course.outcomes.map(outcome => {
                        return (
                          <li className="d-flex align-items-center mb-2" key={outcome.id}>
                            <span className="text-success me-2">&#10003;</span>
                            <span>{outcome.text}</span>
                          </li>
                        )

                      })}


                    </ul>
                  </div>
                </div>

                <div className='col-md-12 mt-4'>
                  <div className='border bg-white rounded-3 p-4'>
                    <h3 className='mb-3 h4'>Requirements</h3>
                    <ul className="list-unstyled mt-3">
                      {course.requirements && course.requirements.map(requirement => {
                        return (
                          <li className="d-flex align-items-center mb-2" key={requirement.id}>
                            <span className="text-success me-2">&#10003;</span>
                            <span>{requirement.text}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>

                <div className='col-md-12 mt-4'>
                  <div className='border bg-white rounded-3 p-4'>
                    <h3 className="h4 mb-3">Course Structure</h3>
                    <p>
                      {course.chapters_count} Chapters . {course.total_lessons} Lectures . {convertMinutesToHours(course.total_duration)}
                    </p>
                    <Accordion defaultActiveKey="0" id="courseAccordion">
                      {course.chapters && course.chapters.map((chapter, index) => {
                        return (
                          <Accordion.Item eventKey={index} key={chapter.id}>
                            <Accordion.Header>
                              {chapter.title} <span className="ms-3 text-muted">({chapter.lessons_count} lectures - {convertMinutesToHours(chapter.lessons_sum_duration)})</span>
                            </Accordion.Header>
                            <Accordion.Body>
                              <ListGroup>
                                {chapter.lessons && chapter.lessons.map(lesson => {
                                  return (
                                    <ListGroup.Item key={lesson.id}>
                                      <div className='row'>
                                        <div className='col-md-9'>
                                          <LuMonitorPlay className='me-2' />
                                          {lesson.title}
                                        </div>
                                        <div className='col-md-3'>
                                          <div className='d-flex justify-content-end'>
                                            {lesson.is_free_preview == 'yes' &&
                                              <Badge bg="primary">
                                                <Link onClick={() => handleShow(lesson)} className="text-white text-decoration-none">Preview</Link>
                                              </Badge>
                                            }
                                            <span className="text-muted ms-2">{convertMinutesToHours(lesson.duration)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </ListGroup.Item>)
                                })}
                              </ListGroup>
                            </Accordion.Body>
                          </Accordion.Item>
                        )
                      })}
                    </Accordion>
                  </div>
                </div>

                {course.reviews && <Reviews reviews={course.reviews} />}

              </div>
            </div>
            <div className='col-lg-4'>
              <div className='border rounded-3 bg-white p-4 shadow-sm'>

                <CourseImage imgUrl={course?.course_small_image} title={course?.title} />

                <Card.Body className='mt-3'>
                  <h3 className="fw-bold">{currency}{course.price}</h3>
                  {course.cross_price && <div className="text-muted text-decoration-line-through">{currency}{course.cross_price}</div>}
                  {/* Buttons */}
                  <div className="mt-4">
                    <button onClick={() => handleEnrollCourse()} className="btn btn-primary w-100">
                      <i className="bi bi-ticket"></i> Enroll Now
                    </button>
                  </div>
                </Card.Body>
                <Card.Footer className='mt-4'>
                  <h6 className="fw-bold">This course includes</h6>
                  <ListGroup variant="flush">

                    <ListGroup.Item className='ps-0'>
                      <i className="bi bi-infinity text-primary me-2"></i>
                      Full lifetime access
                    </ListGroup.Item>
                    <ListGroup.Item className='ps-0'>
                      <i className="bi bi-tv text-primary me-2"></i>
                      Access on mobile and TV
                    </ListGroup.Item>
                    <ListGroup.Item className='ps-0'>
                      <i className="bi bi-award-fill text-primary me-2"></i>
                      Certificate of completion
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Footer>
              </div>
            </div>
          </div>
        }
      </div>

    </>
  )
}

export default Detail