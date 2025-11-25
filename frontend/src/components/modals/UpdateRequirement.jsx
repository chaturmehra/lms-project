import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { createRequirementApiUrl, token } from '../common/Config';
import toast from 'react-hot-toast';

const UpdateRequirement = ({ selectedRequirement, showModal, handleClose, requirements, setRequirements }) => {
    const [loading, setLoading] = useState(false);
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {

        try {
            setLoading(true);
            const res = await fetch(`${createRequirementApiUrl}/${selectedRequirement.id}`, {
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
                const updatedRequirements = requirements.map(requirement => requirement.id == result.data.id ? { ...requirement, text: result.data.text } : requirement)
                setRequirements(updatedRequirements);
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
        if (selectedRequirement) {
            reset({
                requirement: selectedRequirement.text
            })
        }
    }, [selectedRequirement])


    return (
        <Modal size="lg" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Requirement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Requirement</label>
                        <textarea
                            {
                            ...register('requirement', {
                                required: "The requirement field is required."
                            })
                            }
                            className={`form-control ${errors.requirement && 'is-invalid'}`}
                            placeholder="Enter requirement"
                        >
                        </textarea>
                        {
                            errors.requirement && <p className='invalid-feedback'>{errors.requirement.message}</p>
                        }
                    </div>
                    <button disabled={loading} className="btn btn-primary">{loading === false ? "Update" : "Please wait..."}</button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default UpdateRequirement