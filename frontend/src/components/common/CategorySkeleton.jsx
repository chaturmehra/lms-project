import React from 'react'

const CategorySkeleton = () => {
    return (
        <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow border-0">
                <div className="card-body">
                    <div className="skeleton skeleton-text"></div>
                </div>
            </div>
        </div>
    )
}

export default CategorySkeleton