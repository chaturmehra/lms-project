import React from 'react'

const CourseImage = ({ imgUrl, title }) => {
    return (
        <>
            {imgUrl ? (
                <img src={imgUrl} alt={title} className='img-fluid' />
            ) : (
                <div
                    className={`d-flex justify-content-center align-items-center img-fluid`}
                    style={{
                        background: "#dddddd",
                        textAlign: "center",
                        padding: "10px",
                        height: "213.71px"
                    }}
                >
                    <span style={{ fontSize: "30px", fontWeight: 600, color: "#999999" }}>{title}</span>
                </div>
            )}

        </>
    )
}

export default CourseImage