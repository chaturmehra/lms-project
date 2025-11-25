import { Link, useNavigate } from 'react-router-dom';
import UserSidebar from '../../../components/account/UserSidebar';
import { useForm } from 'react-hook-form';
import { createCourseApiUrl, token } from '../../../components/common/Config';
import toast from 'react-hot-toast';
import Breadcrumb from '../../../components/common/Breadcrumb';

const CreateCourse = ({ placeholder }) => {
    const navigate = useNavigate();
    const { handleSubmit, register, formState: { errors }, setError } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await fetch(createCourseApiUrl, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);
                navigate('/account/courses/edit/' + result.data.id);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    return (
        <section className='section-4'>
            <div className='container pb-5 pt-3'>
                
                <Breadcrumb page_name={"Create Course"} />

                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-between'>
                            <h2 className='h3 mb-0 pb-0'>Create Course</h2>
                            <Link to='/account/my-courses' className='btn btn-primary'>Back</Link>
                        </div>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar />
                    </div>
                    <div className='col-lg-9'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='card border-0'>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className='mb-3'>
                                            <label htmlFor="" className='form-label'>Title</label>
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
                                        <div>
                                            <button className='btn btn-primary'>Continue</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default CreateCourse;