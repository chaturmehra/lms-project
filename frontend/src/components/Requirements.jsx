import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { createRequirementApiUrl, sortRequirementApiUrl, token } from './common/Config';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import UpdateRequirement from './modals/UpdateRequirement';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Requirements = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [requirements, setRequirements] = useState([]);
    const [selectedRequirement, setSelectedRequirement] = useState();

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = (requirement) => {
        setShowModal(true);
        setSelectedRequirement(requirement);
    };

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm();


    const onSubmit = async (data) => {

        const formData = { ...data, course_id: params.id };

        try {
            setLoading(true);
            const res = await fetch(`${createRequirementApiUrl}`, {
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
                const newRequirements = [...requirements, result.data];
                setRequirements(newRequirements);
                toast.success(result.message);
                reset();
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    const fetchRequirements = async () => {

        try {
            const res = await fetch(`${createRequirementApiUrl}?course_id=${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const result = await res.json();

            if (result.status === 200) {
                setRequirements(result.data)
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    const deleteRequirement = async (id) => {
        if (confirm("Are you sure, you want to delete?")) {
            try {
                const res = await fetch(`${createRequirementApiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const result = await res.json();

                if (result.status === 200) {
                    const newRequirements = requirements.filter(requirement => requirement.id !== id)
                    setRequirements(newRequirements);
                    toast.success(result.message);
                } else {
                    console.log("Somthing went wrong.")
                }
            } catch (error) {
                toast.error("Server error. Please try again later.");
            }
        }
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(requirements);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setRequirements(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (UpdateRequirements) => {
        try {

            const res = await fetch(`${sortRequirementApiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ requirements: UpdateRequirements }),
            });

            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        fetchRequirements();
    }, [])


    return (
        <>
            <div className="card shadow border-0 mt-3">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between">
                        <h4 className="h5 mb-3">Requirements</h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <textarea
                            id="requirement"
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
                        <button disabled={loading} className="btn my-3 btn-primary">{loading === false ? "Save" : "Please wait..."}</button>
                    </form>
                    <div className="space-y-2">
                        <DragDropContext onDragEnd={handleDragEnd} >
                            <Droppable droppableId="list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {
                                            requirements.map((requirement, index) => (
                                                <Draggable key={requirement.id} draggableId={`${requirement.id}`} index={index}>

                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="mt-2 border px-2 py-2 bg-white shadow-lg rounded"
                                                        >
                                                            <div className="d-flex">
                                                                <div>
                                                                    <MdDragIndicator />
                                                                </div>
                                                                <div className="d-flex justify-content-between w-100">
                                                                    <div className='ps-2'>{requirement.text}</div>
                                                                    <div className="d-flex">
                                                                        <Link className="text-primary me-1" onClick={() => handleShow(requirement)}>
                                                                            <BsPencilSquare />
                                                                        </Link>
                                                                        <Link className="text-danger" onClick={() => deleteRequirement(requirement.id)}>
                                                                            <FaTrashAlt />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>

            <UpdateRequirement
                selectedRequirement={selectedRequirement}
                showModal={showModal}
                handleClose={handleClose}
                requirements={requirements}
                setRequirements={setRequirements}
            />

        </>
    )
}

export default Requirements