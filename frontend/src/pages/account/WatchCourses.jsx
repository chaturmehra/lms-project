import React, { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { MdSlowMotionVideo } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link, useParams } from 'react-router-dom';
import { enrollWatchCourse, markAsComplete, saveUserActivity, token } from '../../components/common/Config';
import ReactPlayer from 'react-player';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/common/Breadcrumb';

const WatchCourses = () => {

  const params = useParams();
  const [watchCourse, setWatchCourse] = useState();
  const [activeLesson, setActiveLesson] = useState();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);

  const fetchWatchCourse = async () => {
    try {
      const res = await fetch(`${enrollWatchCourse}/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();
      if (result.status === 200) {
        setWatchCourse(result.data);
        setActiveLesson(result.activeLesson);
        setCompletedLessons(result.completedLessons);
        setProgress(result.progress);
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  }

  const showLesson = async (lesson) => {
    setActiveLesson(lesson);

    const data = {
      lesson_id: lesson.id,
      course_id: params.id,
      chapter_id: lesson.chapter_id
    }

    try {
      const res = await fetch(saveUserActivity, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result.status === 200) {

      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }

  }
  const markAsCompleteLesson = async (activeLesson) => {

    const data = {
      lesson_id: activeLesson.id,
      course_id: params.id,
      chapter_id: activeLesson.chapter_id
    }

    try {
      const res = await fetch(markAsComplete, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result.status === 200) {
        toast.success(result.message);
        setCompletedLessons(result.completedLessons);
        setProgress(result.progress);
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }

  }

  useEffect(() => {
    fetchWatchCourse();
  }, [])

  return (
    <>
      {watchCourse &&
        <section className='section-5 pt-3'>
          <div className='container'>

            <Breadcrumb page_name={"Watch Course"} />

            <div className='row'>
              <div className='col-md-8'>
                {activeLesson &&
                  <>
                    <div className='video'>
                      <ReactPlayer
                        width="100%"
                        height="100%"
                        controls
                        config={{
                          file: {
                            attributes: {
                              controlslist: 'nodownload'
                            }
                          }
                        }}
                        src={activeLesson.lesson_video_url}
                      />
                    </div>
                    <div className='meta-content'>
                      <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 pt-1'>
                        <h3 className='pt-2'>{activeLesson.title}</h3>
                        <div>
                          <Link className={`${completedLessons && completedLessons.includes(activeLesson.id) ? 'disabled' : ''} btn btn-primary px-3`} onClick={() => markAsCompleteLesson(activeLesson)}>
                            Mark as complete <IoMdCheckmarkCircleOutline size={20} />
                          </Link>
                        </div>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: activeLesson.description }}></div>
                    </div>
                  </>
                }
              </div>
              <div className='col-md-4'>
                <div className='card rounded-0'>
                  <div className='card-body'>
                    <div className='h6'>
                      <strong>{watchCourse.title}</strong>
                    </div>
                    <div className='py-2'>
                      <ProgressBar now={progress} />
                      <div className='pt-2'>
                        {progress}% complete
                      </div>
                    </div>
                    <Accordion flush>
                      {watchCourse.chapters && watchCourse.chapters.map((chapter, index) => {
                        return (
                          <Accordion.Item eventKey={index} key={chapter.id}>
                            <Accordion.Header>{chapter.title}</Accordion.Header>
                            <Accordion.Body className='pt-2 pb-0 ps-0'>
                              <ul className='lessons mb-0'>
                                {chapter.lessons && chapter.lessons.map(lesson => {
                                  return (
                                    <li className='pb-2' key={lesson.id}>
                                      <Link onClick={() => showLesson(lesson)} className={`${completedLessons && completedLessons.includes(lesson.id) ? 'text-success' : ''}`}>
                                        <MdSlowMotionVideo size={20} /> {lesson.title}
                                      </Link>
                                    </li>
                                  )
                                })}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        )
                      })}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      }
    </>
  )
}

export default WatchCourses