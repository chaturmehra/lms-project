import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { createLessonApiUrl, token } from '../common/Config';
import toast from 'react-hot-toast';

const CreateLesson = ({ showModal, handleClose, chapters, setChapters }) => {

    const [loading, setLoading] = useState(false);
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {

        // const formData = { ...data, course_id: params.id };

        try {
            setLoading(true);
            const res = await fetch(`${createLessonApiUrl}`, {
                method: 'POST',
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
                setChapters({ type: "UPDATE_CHAPTER", payload: result.chapter });
                toast.success(result.message);
                reset();
                handleClose();
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    return (
        <Modal size="lg" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Lesson</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                        <label className="form-label">Title</label>
                        <input
                            {
                            ...register('title', {
                                required: "The title field is required."
                            })
                            }
                            className={`form-control ${errors.title && 'is-invalid'}`}
                            placeholder="Enter title"
                        />
                        {
                            errors.title && <p className='invalid-feedback'>{errors.title.message}</p>
                        }
                    </div>
                    <button disabled={loading} className="btn btn-primary">{loading === false ? "Update" : "Please wait..."}</button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default CreateLesson