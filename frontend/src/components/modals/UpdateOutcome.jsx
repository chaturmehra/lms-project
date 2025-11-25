import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { createOutcomeApiUrl, token } from '../common/Config';
import toast from 'react-hot-toast';

const UpdateOutcome = ({ selectedOutcome, showModal, handleClose, outcomes, setOutcomes }) => {

    const [loading, setLoading] = useState(false);
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {

        try {
            setLoading(true);
            const res = await fetch(`${createOutcomeApiUrl}/${selectedOutcome.id}`, {
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
                const updatedOutcomes = outcomes.map(outcome => outcome.id == result.data.id ? {...outcome, text: result.data.text} : outcome )
                setOutcomes(updatedOutcomes);
                toast.success(result.message);
                handleClose();
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        if (selectedOutcome) {
            reset({
                outcome: selectedOutcome.text
            })
        }
    }, [selectedOutcome])


    return (
        <Modal size="lg" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Outcome</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Outcome</label>
                        <textarea
                            {
                            ...register('outcome', {
                                required: "The outcome field is required."
                            })
                            }
                            className={`form-control ${errors.outcome && 'is-invalid'}`}
                            placeholder="Enter outcome"
                        >
                        </textarea>
                        {
                            errors.outcome && <p className='invalid-feedback'>{errors.outcome.message}</p>
                        }
                    </div>
                    <button disabled={loading} className="btn btn-primary">{loading === false ? "Update" : "Please wait..."}</button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default UpdateOutcome