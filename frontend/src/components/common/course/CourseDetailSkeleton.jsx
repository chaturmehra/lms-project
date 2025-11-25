const CourseDetailSkeleton = () => {
    return (
        <div className="row my-5 course-card-detail">
            <div className="col-lg-8">
                <div className="skeleton-title skeleton mb-3"></div>

                <div className="d-flex">
                    <div className="skeleton-badge skeleton"></div>
                    <div className="d-flex ps-3">
                        <div className="skeleton-rating skeleton"></div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col">
                        <div className="skeleton-text-small skeleton"></div>
                        <div className="skeleton-text skeleton"></div>
                    </div>
                    <div className="col">
                        <div className="skeleton-text-small skeleton"></div>
                        <div className="skeleton-text skeleton"></div>
                    </div>
                    <div className="col">
                        <div className="skeleton-text-small skeleton"></div>
                        <div className="skeleton-text skeleton"></div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="skeleton-box skeleton"></div>
                    </div>

                    <div className="col-md-12 mt-4">
                        <div className="skeleton-box skeleton"></div>
                    </div>

                    <div className="col-md-12 mt-4">
                        <div className="skeleton-box skeleton"></div>
                    </div>
                </div>
            </div>

            <div className="col-lg-4">
                <div className="border rounded-3 bg-white p-4 shadow-sm">
                    <div className="skeleton-img skeleton mb-3"></div>

                    <div className="skeleton-price skeleton mb-2"></div>
                    <div className="skeleton-price-small skeleton mb-4"></div>
                    <div className="skeleton-btn skeleton"></div>
                </div>
            </div>
        </div>

    )
}

export default CourseDetailSkeleton