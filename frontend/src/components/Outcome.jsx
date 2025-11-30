import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { createOutcomeApiUrl, sortOutcomeApiUrl, token } from './common/Config';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import UpdateOutcome from './modals/UpdateOutcome.jsx';

const Outcome = () => {

    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [outcomes, setOutcomes] = useState([]);
    const [selectedOutcome, setSelectedOutcome] = useState();

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = (outcome) => {
        setShowModal(true);
        setSelectedOutcome(outcome);
    };

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm();

    const onSubmit = async (data) => {

        const formData = { ...data, course_id: params.id };

        try {
            setLoading(true);
            const res = await fetch(`${createOutcomeApiUrl}`, {
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
                const newOutcomes = [...outcomes, result.data];
                setOutcomes(newOutcomes);
                toast.success(result.message);
                reset();
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    const fetchOutcomes = async () => {

        try {
            const res = await fetch(`${createOutcomeApiUrl}?course_id=${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const result = await res.json();

            if (result.status === 200) {
                setOutcomes(result.data)
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    const deleteOutcome = async (id) => {
        if (confirm("Are you sure, you want to delete?")) {
            try {
                const res = await fetch(`${createOutcomeApiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const result = await res.json();

                if (result.status === 200) {
                    const newOutcomes = outcomes.filter(outcome => outcome.id !== id)
                    setOutcomes(newOutcomes);
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

        const reorderedItems = Array.from(outcomes);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setOutcomes(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updateOutcomes) => {
        try {
            
            const res = await fetch(`${sortOutcomeApiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({outcomes: updateOutcomes}),
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
        fetchOutcomes();
    }, [])


    return (
        <>
            <div className="card shadow border-0">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between">
                        <h4 className="h5 mb-3">Outcome</h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <textarea
                            id="outcome"
                            {
                            ...register('outcome', {
                                required: "The outcome field is required."
                            })
                            }
                            className={`form-control ${errors.outcome && 'is-invalid'}`}
                            placeholder="Enter Outcome"
                        >
                        </textarea>
                        {
                            errors.outcome && <p className='invalid-feedback'>{errors.outcome.message}</p>
                        }
                        <button disabled={loading} className="btn my-3 btn-primary">{loading === false ? "Save" : "Please wait..."}</button>
                    </form>
                    <div className="space-y-2">

                        <DragDropContext onDragEnd={handleDragEnd} >
                            <Droppable droppableId="list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {
                                            outcomes.map((outcome, index) => (
                                                <Draggable key={outcome.id} draggableId={`${outcome.id}`} index={index}>

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
                                                                    <div className='ps-2'>{outcome.text}</div>
                                                                    <div className="d-flex">
                                                                        <Link className="text-primary me-1" onClick={() => handleShow(outcome)}>
                                                                            <BsPencilSquare />
                                                                        </Link>
                                                                        <Link className="text-danger" onClick={() => deleteOutcome(outcome.id)}>
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

            <UpdateOutcome
                selectedOutcome={selectedOutcome}
                showModal={showModal}
                handleClose={handleClose}
                outcomes={outcomes}
                setOutcomes={setOutcomes}
            />

        </>
    )
}

export default Outcome