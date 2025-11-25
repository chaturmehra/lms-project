import React from 'react'
import { BsFillStarFill } from 'react-icons/bs'

const Rating = ({ rating }) => {
    return (
        <div className="rating ps-4">
            <div className="d-flex align-items-center">
                <div className="icon">
                    <BsFillStarFill />
                </div>
                <div className="text ps-2">{rating}</div>
            </div>
        </div>
    )
}

export default Rating