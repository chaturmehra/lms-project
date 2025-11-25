import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserSidebar from '../../../components/account/UserSidebar';
import { changeCourseStatusApiUrl, courseMetadataApiUrl, createCourseApiUrl, token } from '../../../components/common/Config';
import Breadcrumb from '../../../components/common/Breadcrumb';
import Outcome from '../../../components/Outcome';
import Requirements from '../../../components/Requirements';
import EditCoverImage from '../../../components/EditCoverImage';
import Chapters from '../../../components/Chapters';

const EditCourse = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState([]);

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm({
        defaultValues: async () => {
            const res = await fetch(`${createCourseApiUrl}/${params.id}`, {
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
                    title: result.data.title,
                    category: result.data.category_id,
                    level: result.data.level_id,
                    language: result.data.language_id,
                    description: result.data.description,
                    price: result.data.price,
                    cross_price: result.data.cross_price
                })

                setCourse(result.data);
            }
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await fetch(`${createCourseApiUrl}/${params.id}`, {
                method: 'PUT',
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

    const getCourseMetaData = async (data) => {
        try {
            const res = await fetch(courseMetadataApiUrl, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();

            if (result.status === 200) {
                setCategories(result.categories);
                setLevels(result.levels);
                setLanguages(result.languages);
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    const changeStatus = async (course) => {
        try {

            const status = (course.status == 1) ? 0 : 1;
            const res = await fetch(`${changeCourseStatusApiUrl}/${course.id}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: status }),
            });

            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);
                setCourse({ ...course, status: result.course.status })
            } else {
                toast.error(result.message);
                //console.log("Somthing went wrong.")
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        getCourseMetaData();
    }, [])

    return (
        <section className='section-4'>
            <div className='container pb-5 pt-3'>

                <Breadcrumb page_name={"Edit Course"} />

                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-between'>
                            <h2 className='h3 mb-0 pb-0'>Edit Course</h2>
                            <div>
                                <Link onClick={() => changeStatus(course)} className='btn btn-primary me-2'>
                                {course.status == 0 ? "Publish" : "Unpublished" }
                                </Link>
                                <Link to='/account/my-courses' className='btn btn-primary'>Back</Link>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar />
                    </div>
                    <div className='col-lg-9'>

                        <div className="row">
                            <div className="col-md-7">
                                <div className="card p-4 border-0 shadow-lg mb-3">
                                    <h4 className="h5 border-bottom pb-3 mb-3">Course Details</h4>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">Title</label>
                                            <input
                                                {
                                                ...register('title', {
                                                    required: "The title field is required."
                                                })
                                                }
                                                type="text"
                                                placeholder='Title'
                                                className={`form-control ${errors.title && 'is-invalid'}`}
                                            />
                                            {
                                                errors.title && <p className='invalid-feedback'>{errors.title.message}</p>
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label">Category</label>
                                            <select
                                                id="category"
                                                className={`form-select ${errors.category && 'is-invalid'}`}
                                                {
                                                ...register('category', {
                                                    required: "The category field is required."
                                                })
                                                }
                                            >
                                                <option value="">Select Category</option>
                                                {
                                                    categories?.map(category => {
                                                        return (
                                                            <option value={category.id} key={category.id}>{category.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                errors.category && <p className='invalid-feedback'>{errors.category.message}</p>
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="level" className="form-label">Level</label>
                                            <select
                                                id="level"
                                                className={`form-select ${errors.level && 'is-invalid'}`}
                                                {
                                                ...register('level', {
                                                    required: "The level field is required."
                                                })
                                                }
                                            >
                                                <option value="">Select Level</option>
                                                {
                                                    levels?.map(level => {
                                                        return (
                                                            <option value={level.id} key={level.id}>{level.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                errors.level && <p className='invalid-feedback'>{errors.level.message}</p>
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="language" className="form-label">Language</label>
                                            <select
                                                id="language"
                                                className={`form-select ${errors.language && 'is-invalid'}`}
                                                {
                                                ...register('language', {
                                                    required: "The language field is required."
                                                })
                                                }
                                            >
                                                <option value="">Select a Language</option>
                                                {
                                                    languages?.map(language => {
                                                        return (
                                                            <option value={language.id} key={language.id}>{language.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                errors.language && <p className='invalid-feedback'>{errors.language.message}</p>
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea
                                                id="description"
                                                {
                                                ...register('description')
                                                }
                                                className={`form-control`}
                                                placeholder="Description"
                                                rows={5}
                                            >
                                            </textarea>
                                        </div>
                                        <h4 className="h5 border-bottom pb-3 mb-3 mt-4">Pricing</h4>
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label">Sell Price</label>
                                            <input
                                                {
                                                ...register('price', {
                                                    required: "The sell price field is required."
                                                })
                                                }
                                                className={`form-control ${errors.price && 'is-invalid'}`}
                                                placeholder="Sell Price"
                                                id="price"
                                                type="number"
                                            />
                                            {
                                                errors.price && <p className='invalid-feedback'>{errors.price.message}</p>
                                            }
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="cross_price" className="form-label">Cross Price</label>
                                            <input
                                                {
                                                ...register('cross_price')
                                                }
                                                className={`form-control`}
                                                placeholder="Cross Price"
                                                id="cross_price"
                                                type="number"
                                            />
                                        </div>
                                        <button disabled={loading} className="btn btn-primary">{loading === false ? "Update" : "Please wait..."}</button>
                                    </form>
                                </div>

                                <Chapters course={course} params={params} />

                            </div>
                            <div className="col-md-5">

                                <Outcome />

                                <Requirements />

                                <EditCoverImage course={course} setCourse={setCourse} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EditCourse