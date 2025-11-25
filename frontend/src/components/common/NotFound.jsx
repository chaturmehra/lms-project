import React from 'react'

const NotFound = ({ text, message }) => {
    return (
        <div className='col-12'>
            <div className='card shadow border-0 py-5 text-center'>
                <h4>{text ? text : 'Records not found.'}</h4>
                {message && <p>{message ? message : ""}</p>}
            </div>
        </div>
    )
}

export default NotFound