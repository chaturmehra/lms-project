import React from 'react'
import Modal from 'react-bootstrap/Modal';
import ReactPlayer from 'react-player';

const FreePreview = ({ showModal, handleClose, freeLesson }) => {

    return (
        <Modal size="lg" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{freeLesson.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ReactPlayer
                    width="100%"
                    height="100%"
                    controls
                    config={{
                        file: {
                            attributes: {
                                controlslist: 'nodownload'
                            }
                        }
                    }}
                    src={freeLesson.lesson_video_url}
                />
            </Modal.Body>
        </Modal>
    )
}

export default FreePreview