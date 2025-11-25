import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { createChapterApiUrl, token } from '../common/Config';
import toast from 'react-hot-toast';

const UpdateChapter = ({ selectedChapter, showUpdateChapterModal, handleCloseUpdateChapter, setChapters }) => {
    const [loading, setLoading] = useState(false);
    const [chapters, setChapter] = useState([]);
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {

        try {
            setLoading(true);
            const res = await fetch(`${createChapterApiUrl}/${selectedChapter.id}`, {
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
                setChapters({ type: "UPDATE_CHAPTER", payload: result.data });
                toast.success(result.message);
                handleCloseUpdateChapter();
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        if (selectedChapter) {
            reset({
                chapter: selectedChapter.title
            })
        }
    }, [selectedChapter])

    return (
        <Modal size="lg" show={showUpdateChapterModal} onHide={handleCloseUpdateChapter}>
            <Modal.Header closeButton>
                <Modal.Title>Update Chapter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="chapter" className="form-label">Title</label>
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
                    </div>
                    <button disabled={loading} className="btn btn-primary">{loading === false ? "Update" : "Please wait..."}</button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default UpdateChapter