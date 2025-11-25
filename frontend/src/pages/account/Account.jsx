import React, { useState } from 'react'
import UserSidebar from '../../components/account/UserSidebar'
import Breadcrumb from '../../components/common/Breadcrumb'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { profileApiUrl, token, updateProfileApiUrl } from '../../components/common/Config'
import toast from 'react-hot-toast'

const Account = () => {

    const [loading, setLoading] = useState(false);
    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm({
        defaultValues: async () => {
            const res = await fetch(`${profileApiUrl}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();

            if (result.status === 200) {
                reset({
                    name: result.data.name,
                    email: result.data.email,
                })
            }
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await fetch(`${updateProfileApiUrl}`, {
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
            } else {
                const errors = result.errors;
                Object.keys(errors).forEach(field => {
                    setError(field, { message: errors[field][0] })
                })
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    return (
        <section className='section-4'>
            <div className='container pb-5 pt-3'>

                <Breadcrumb page_name={"Profile"} />

                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-between'>
                            <h2 className='h4 mb-0 pb-0'>Account</h2>
                        </div>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar />
                    </div>
                    <div className='col-lg-9'>
                        <div className="card p-4 border-0 shadow-lg">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3 ">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        {
                                        ...register('name', {
                                            required: "The name field is required."
                                        })
                                        }
                                        className={`form-control ${errors.name && 'is-invalid'}`}
                                        placeholder="Name"
                                        type="text"
                                    />
                                    {
                                        errors.name && <p className='invalid-feedback'>{errors.name.message}</p>
                                    }
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input
                                        {
                                        ...register('email', {
                                            required: "The email field is required.",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })
                                        }
                                        className={`form-control ${errors.email && 'is-invalid'}`}
                                        placeholder="Email"
                                        type="text"
                                    />
                                    {
                                        errors.email && <p className='invalid-feedback'>{errors.email.message}</p>
                                    }
                                </div>
                                <button disabled={loading} className="btn btn-primary mt-3">{loading === false ? "Update" : "Please wait..."}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Account