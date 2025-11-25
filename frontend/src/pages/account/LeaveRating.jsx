import React, { useEffect, useState } from 'react'
import UserSidebar from '../../components/account/UserSidebar'
import { Breadcrumb } from 'react-bootstrap'
import { Rating } from 'react-simple-star-rating'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchCourseDetail, saveRating, token } from '../../components/common/Config'

const LeaveRating = () => {

    const params = useParams();
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [courseName, setCourseName] = useState();
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    const handleRating = (rate) => {
        setRating(rate);
    }
    
    const onSubmit = async (data) => {

        data.course_id = params.id;
        data.rating = rating;

        try {
            setLoading(true);
            const res = await fetch(`${saveRating}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            setLoading(false);

            if (result.status === 200) {
                toast.success(result.message);
                reset();
                setRating();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${fetchCourseDetail}/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            const result = await res.json();
            setLoading(false);
            if (result.status === 200) {
                setCourseName(result.data.title);
            }
        } catch (error) {
            setLoading(false);
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        fetchCourse();
    }, [])

    return (
        <section className='section-4'>
            <div className='container pb-5 pt-3'>

                <Breadcrumb page_name={"Leave Rating"} />

                <div className='row'>
                    <div className='d-flex justify-content-between  mt-5 mb-3'>
                        <h2 className='h4 mb-0 pb-0'>Leave Rating / {courseName} </h2>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar />
                    </div>
                    <div className='col-lg-9'>
                        <div className="card p-4 border-0 shadow-lg">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label className="form-label">Comment</label>
                                    <textarea
                                        {
                                        ...register('comment', {
                                            required: "The comment field is required."
                                        })
                                        }
                                        className={`form-control ${errors.comment && 'is-invalid'}`}
                                        placeholder="What your personal feedback?">

                                    </textarea>
                                    {
                                        errors.comment && <p className='invalid-feedback'>{errors.comment.message}</p>
                                    }
                                </div>
                                <div className="mb-3">
                                    <Rating
                                        onClick={handleRating}
                                        initialValue={rating}
                                    />
                                </div>
                                <button disabled={loading} className="btn btn-primary">{loading === false ? "Save" : "Please wait..."}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LeaveRating