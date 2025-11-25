import React, { useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import CreateLesson from './modals/CreateLesson';
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import SortChapters from './modals/SortChapters';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { createChapterApiUrl, createLessonApiUrl, token } from './common/Config';
import Accordion from 'react-bootstrap/Accordion';
import { BsPencilSquare } from 'react-icons/bs';
import { AiOutlineDrag } from 'react-icons/ai';
import SortLesson from './modals/SortLesson';
import UpdateChapter from './modals/UpdateChapter';

const Chapters = ({ course, params }) => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState();
    const [selectedLesson, setSelectedLesson] = useState([]);

    const chapterReducer = (state, action) => {
        switch (action.type) {
            case "SET_CHAPTERS":
                return action.payload;

            case "ADD_CHAPTER":
                return [...state, action.payload];

            case "UPDATE_CHAPTER":
                return state.map(chapter => {
                    if (chapter.id === action.payload.id) {
                        return action.payload;
                    }
                    return chapter;
                })

            case "DELETE_CHAPTER":
                return state.filter(chapter => chapter.id !== action.payload);

            default:
                return state;
        }
    }
    const [chapters, setChapters] = useReducer(chapterReducer, []);

    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const handleClose = () => setShowModal(false);
    const handleShow = () => {
        setShowModal(true);
    };

    // Sort Chapter Modal
    const [showChapterReorderModal, setShowChapterReorderModal] = useState(false);
    const handleCloseChapterReorder = () => setShowChapterReorderModal(false);
    const handleShowChapterReorder = () => {
        setShowChapterReorderModal(true);
    };

    // Sort Lesson Modal
    const [showLessonReorderModal, setShowLessonReorderModal] = useState(false);
    const handleCloseLessonReorder = () => setShowLessonReorderModal(false);
    const handleShowLesson = (lessons) => {
        setShowLessonReorderModal(true);
        setSelectedLesson(lessons)
    };

    // Update Chapter Modal
    const [showUpdateChapterModal, setShowUpdateChapterModal] = useState(false);
    const handleCloseUpdateChapter = () => setShowUpdateChapterModal(false);
    const handleShowUpdateChapter = (chapter) => {
        setShowUpdateChapterModal(true);
        setSelectedChapter(chapter)
    };

    const onSubmit = async (data) => {

        const formData = { ...data, course_id: params.id };

        try {
            setLoading(true);
            const res = await fetch(`${createChapterApiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            setLoading(false);

            if (result.status === 200) {
                // const newOutcomes = [...outcomes, result.data];
                // setOutcomes(newOutcomes);
                setChapters({ type: "ADD_CHAPTER", payload: result.data })
                toast.success(result.message);
                reset();
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    const deleteChapter = async (id) => {
        if (confirm("Are you sure, you want to delete?")) {
            try {
                const res = await fetch(`${createChapterApiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const result = await res.json();

                if (result.status === 200) {
                    setChapters({ type: "DELETE_CHAPTER", payload: id });
                    toast.success(result.message);
                } else {
                    console.log("Somthing went wrong.")
                }
            } catch (error) {
                toast.error("Server error. Please try again later.");
            }
        }
    }

    const deleteLesson = async (id) => {
        if (confirm("Are you sure, you want to delete?")) {
            try {
                const res = await fetch(`${createLessonApiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const result = await res.json();

                if (result.status === 200) {
                    setChapters({ type: "UPDATE_CHAPTER", payload: result.chapter });
                    toast.success(result.message);
                } else {
                    console.log("Somthing went wrong.")
                }
            } catch (error) {
                toast.error("Server error. Please try again later.");
            }
        }
    }

    useEffect(() => {
        if (course.chapters) {
            setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
        }
    }, [course])

    return (
        <>
            <div className="card shadow border-0 mb-3">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between">
                        <h4 className="h5 mb-3">Create Chapter</h4>
                        <div>
                            <Link className="h6" onClick={() => handleShow()}>
                                <strong>
                                    <FaPlus size={12} />
                                    Create Lesson
                                </strong>
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            placeholder="Chapter"
                            {
                            ...register('chapter', {
                                required: "The chapter field is required."
                            })
                            }
                            className={`form-control ${errors.chapter && 'is-invalid'}`}
                            type="text"
                        />
                        {
                            errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>
                        }
                        <button disabled={loading} className="btn my-3 btn-primary">{loading === false ? "Save" : "Please wait..."}</button>
                    </form>
                    <div className="d-flex justify-content-between  mb-2 mt-4">
                        <h4 className="h5">Chapters</h4>
                        <Link className="h6" onClick={() => handleShowChapterReorder()}><strong><AiOutlineDrag size={12} /> Reorder Chapters</strong></Link>
                    </div>
                    <Accordion>
                        {chapters.map((chapter, index) => {
                            return (
                                <Accordion.Item eventKey={index} className='mb-2' key={chapter.id}>
                                    <Accordion.Header>{chapter.title}</Accordion.Header>
                                    <Accordion.Body>
                                        <div className="d-flex justify-content-between mb-2 mt-4">
                                            <h4 className="h5">Lessons</h4>
                                            {chapter?.lessons?.length > 0 && <Link className="h6" onClick={() => handleShowLesson(chapter.lessons)}><strong>Reorder Lessons</strong></Link>}
                                        </div>
                                        {
                                            chapter?.lessons?.length > 0 ? (
                                                chapter?.lessons?.map(lesson => {
                                                    return (
                                                        <div className="d-flex mt-2 border bg-white shadow-lg rounded row" key={lesson.id}>
                                                            <div className="col-md-8 px-3 py-2">{lesson.title}</div>
                                                            <div className="col-md-4 text-end px-3 py-2">
                                                                {lesson.duration > 0 &&
                                                                    <small className="fw-bold text-muted me-2">{lesson.duration}</small>
                                                                }
                                                                {lesson.is_free_preview == "yes" &&
                                                                    <span className="badge bg-success me-2">Preview</span>
                                                                }
                                                                <Link className="me-2" to={`/account/edit-lesson/${lesson.id}/${course.id}`}>
                                                                    <BsPencilSquare />
                                                                </Link>
                                                                <Link className="text-danger" onClick={() => deleteLesson(lesson.id)}>
                                                                    <FaTrashAlt />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <div className="d-flex mt-2 border bg-white shadow-lg rounded row">
                                                    <div className="col-md-8 px-3 py-2">{"No Lesson Found."}</div>
                                                </div>
                                            )
                                        }

                                        <button className="btn btn-sm btn-danger mt-3" onClick={() => deleteChapter(chapter.id)}>Delete Chapter</button>
                                        <button className="btn btn-sm btn-primary mt-3 ms-2" onClick={() => handleShowUpdateChapter(chapter)}>Update Chapter</button>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        })}
                    </Accordion>
                </div>
            </div>

            <UpdateChapter
                selectedChapter={selectedChapter}
                showUpdateChapterModal={showUpdateChapterModal}
                handleCloseUpdateChapter={handleCloseUpdateChapter}
                setChapters={setChapters}
            />

            <CreateLesson
                showModal={showModal}
                handleClose={handleClose}
                chapters={chapters}
                setChapters={setChapters}
            />

            <SortChapters
                showChapterReorderModal={showChapterReorderModal}
                handleCloseChapterReorder={handleCloseChapterReorder}
                course={course}
                chapters={chapters}
                setChapters={setChapters}
            />

            <SortLesson
                showLessonReorderModal={showLessonReorderModal}
                handleCloseLessonReorder={handleCloseLessonReorder}
                selectedLesson={selectedLesson}
                setChapters={setChapters}
            />

        </>
    )
}

export default Chapters