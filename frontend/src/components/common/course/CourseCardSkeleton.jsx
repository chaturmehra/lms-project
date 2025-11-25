import React from 'react'

export const CourseCardSkeleton = ({ addClass }) => {
    return (
        <div className={`${addClass} col-md-6 course-card`}>
            <div className="card border-0">
                <div className="card-img-top">
                    <div className="skeleton skeleton-img"></div>
                </div>
                <div className="card-body">
                    <div className="skeleton skeleton-title mb-3"></div>
                    <div className="skeleton skeleton-meta mb-2"></div>
                    <div className="skeleton skeleton-meta mb-2"></div>
                    <div className="skeleton skeleton-meta mb-2"></div>
                </div>
                <div className="card-footer bg-white">
                    <div className="d-flex py-2 justify-content-between align-items-center">
                        <div className="skeleton skeleton-price"></div>
                        <div className="skeleton skeleton-btn"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
