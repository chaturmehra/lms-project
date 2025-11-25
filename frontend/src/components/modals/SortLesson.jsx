import { MdDragIndicator } from 'react-icons/md'
import Modal from 'react-bootstrap/Modal';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from 'react';
import { sortLessonApiUrl, token } from '../common/Config';
import toast from 'react-hot-toast';

const SortLesson = ({ showLessonReorderModal, handleCloseLessonReorder, selectedLesson, setChapters }) => {

    const [lessons, setLessons] = useState([]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(lessons);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setLessons(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updateLesson) => {
        try {

            const res = await fetch(`${sortLessonApiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ lessons: updateLesson }),
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

    useEffect(() => {
        if (selectedLesson) {
            setLessons(selectedLesson)
        }
    }, [selectedLesson])


    return (
        <Modal size="lg" show={showLessonReorderModal} onHide={handleCloseLessonReorder}>
            <Modal.Header closeButton>
                <Modal.Title>Reorder Lessons</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pb-5'>
                <div className="space-y-2">

                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        lessons.map((lesson, index) => (
                                            <Draggable key={lesson.id} draggableId={`${lesson.id}`} index={index}>

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
                                                                <div className='ps-2'>{lesson.title}</div>
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
            </Modal.Body>
        </Modal >
    )
}

export default SortLesson