import React, { useEffect, useState, useRef, useMemo } from 'react'
import UserSidebar from '../../components/account/UserSidebar'
import { createChapterApiUrl, createCourseApiUrl, createLessonApiUrl, token } from '../../components/common/Config';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import EditLessonVideo from '../../components/EditLessonVideo';
import JoditEditor from 'jodit-react';

const EditLesson = ({ placeholder }) => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [chapters, setChapter] = useState([]);
    const [lesson, setLesson] = useState([]);
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [checked, setChecked] = useState(false);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: placeholder || ''
        }),
        [placeholder]
    );

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm({
        defaultValues: async () => {
            const res = await fetch(`${createLessonApiUrl}/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();

            if (result.status === 200) {
                reset({
                    title: result.data.title,
                    chapter: result.data.chapter_id,
                    duration: result.data.duration,
                    is_free_preview: result.data.is_free_preview,
                    status: result.data.status,
                    // video: result.data.video
                })
                setContent(result.data.description)
                setChecked(result.data.is_free_preview == "yes" ? true : false);
                setLesson(result.data);
            }
        }
    });

    const onSubmit = async (data) => {
        try {
            data.description = content;
            setLoading(true);
            const res = await fetch(`${createLessonApiUrl}/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            setLoading(false);

            if (result.status === 200) {
                toast.success(result.message);
            } else {
                const errors = result.errors;
                Object.keys(errors).forEach(field => {
                    setError(field, { message: errors[field][0] })
                })
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    const fetchChapter = async () => {
        try {

            const res = await fetch(`${createChapterApiUrl}?course_id=${params.courseId}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const result = await res.json();

            if (result.status === 200) {
                setChapter(result.data)
            } else {
                console.log("Somthing went wrong")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        fetchChapter();
    }, [])

    return (
        <section className='section-4'>
            <div className='container pb-5 pt-3'>

                <Breadcrumb page_name={"Edit Lesson"} />

                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-between'>
                            <h2 className='h3 mb-0 pb-0'>Edit Lesson</h2>
                            <div>
                                <Link to={`/account/courses/edit/${params.courseId}`} className='btn btn-primary'>Back</Link>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar />
                    </div>
                    <div className='col-lg-9'>

                        <div className="row">
                            <div className="col-md-7">
                                <div className="card p-4 border-0 shadow-lg mb-3">
                                    <h4 className="h5 border-bottom pb-3 mb-3">Basic Information</h4>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">Title</label>
                                            <input
                                                {
                                                ...register('title', {
                                                    required: "The title field is required."
                                                })
                                                }
                                                type="text"
                                                placeholder='Title'
                                                className={`form-control ${errors.title && 'is-invalid'}`}
                                            />
                                            {
                                                errors.title && <p className='invalid-feedback'>{errors.title.message}</p>
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="chapter" className="form-label">Chapter</label>
                                            <select
                                                id="chapter"
                                                className={`form-select ${errors.chapter && 'is-invalid'}`}
                                                {
                                                ...register('chapter', {
                                                    required: "The chapter field is required."
                                                })
                                                }
                                            >
                                                <option value="">Select Chapter</option>
                                                {
                                                    chapters?.map(chapter => {
                                                        return (
                                                            <option value={chapter.id} key={chapter.id}>{chapter.title}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="duration" className="form-label">Duration (in minutes)</label>
                                            <input
                                                {
                                                ...register('duration', {
                                                    required: "The duration field is required."
                                                })
                                                }
                                                className={`form-control ${errors.duration && 'is-invalid'}`}
                                                placeholder="Duration"
                                                id="duration"
                                                type="number"
                                            />
                                            {
                                                errors.duration && <p className='invalid-feedback'>{errors.duration.message}</p>
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <JoditEditor
                                                ref={editor}
                                                value={content}
                                                config={config}
                                                tabIndex={1}
                                                onBlur={newContent => setContent(newContent)}
                                                onChange={newContent => { }}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="status" className="form-label">Status</label>
                                            <select
                                                id="status"
                                                className={`form-select ${errors.status && 'is-invalid'}`}
                                                {
                                                ...register('status', {
                                                    required: "The status field is required."
                                                })
                                                }
                                            >
                                                <option value="">Select Status</option>
                                                <option value={1}>Active</option>
                                                <option value={0}>Inactive</option>
                                            </select>
                                            {
                                                errors.status && <p className='invalid-feedback'>{errors.status.message}</p>
                                            }
                                        </div>
                                        <div className="d-flex">
                                            <input
                                                {
                                                ...register('is_free_preview')
                                                }
                                                className="form-check-input"
                                                id="customSwitch"
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) => setChecked(e.target.checked)}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="customSwitch">Free Lesson</label>
                                        </div>
                                        <button disabled={loading} className="btn btn-primary mt-3">{loading === false ? "Update" : "Please wait..."}</button>
                                    </form>
                                </div>

                            </div>
                            <div className="col-md-5">

                                <EditLessonVideo lesson={lesson} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EditLesson