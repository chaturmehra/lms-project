import { MdDragIndicator } from 'react-icons/md'
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from 'react-hot-toast';
import { sortChapterApiUrl, token } from '../common/Config';

const SortChapters = ({ showChapterReorderModal, handleCloseChapterReorder, course, chapters, setChapters }) => {

    const [chaptersData, setChaptersData] = useState([]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(chaptersData);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setChaptersData(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (UpdateChapters) => {
        try {

            const res = await fetch(`${sortChapterApiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ chapters: UpdateChapters }),
            });

            const result = await res.json();

            if (result.status === 200) {
                setChapters({ type: "SET_CHAPTERS", payload: result.chapters });
                toast.success(result.message);
            } else {
                console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        if (chapters) {
            setChaptersData(chapters);
        }
    }, [chapters])

    return (
        <Modal size="lg" show={showChapterReorderModal} onHide={handleCloseChapterReorder}>
            <Modal.Header closeButton>
                <Modal.Title>Sort Chapters</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pb-5'>
                <div className="space-y-2">
                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        chaptersData.map((chapter, index) => (
                                            <Draggable key={chapter.id} draggableId={`${chapter.id}`} index={index}>

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
                                                                <div className='ps-2'>{chapter.title}</div>
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

export default SortChapters