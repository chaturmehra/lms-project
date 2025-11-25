import React, { useContext, useState } from 'react'
import UserSidebar from '../../components/account/UserSidebar'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { changePasswordApiUrl, token } from '../../components/common/Config';
import { AuthContext } from '../../components/context/Auth';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {

  const { handleSubmit, register, formState: { errors }, setError, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setOldShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);
  const [showConPassword, setConShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(changePasswordApiUrl, {
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
        reset({
          old_password: "",
          new_password: "",
          new_password_confirmation: ""
        });
      } else if (result.errors) {
        Object.values(result.errors).forEach(errArr => {
          toast.error(errArr[0]);
        });
      } else if (result.message) {
        toast.error(result.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  }

  return (
    <section className='section-4'>
      <div className='container pb-5 pt-3'>

        <Breadcrumb page_name={"Change Password"} />

        <div className='row'>
          <div className='col-md-12 mt-5 mb-3'>
            <div className='d-flex justify-content-between'>
              <h2 className='h4 mb-0 pb-0'>Change Password</h2>
            </div>
          </div>
          <div className='col-lg-3 account-sidebar'>
            <UserSidebar />
          </div>
          <div className='col-lg-9'>
            <div className='row'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='card border-0'>
                  <div className='card-body'>
                    <div className='row change-password-page'>
                      <div className='mb-3'>
                        <label htmlFor="old_password" className='form-label'>Old Password</label>
                        <input
                          {
                          ...register('old_password', {
                            required: "The old password field is required."
                          })
                          }
                          type={showOldPassword ? "text" : "password"}
                          placeholder='Enter old password'
                          className={`form-control ${errors.old_password && 'is-invalid'}`}
                        />
                        <span
                          onClick={() => setOldShowPassword(!showOldPassword)}
                          className='eyeslash-icon'
                        >
                          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {
                          errors.old_password && <p className='invalid-feedback'>{errors.old_password.message}</p>
                        }
                      </div>
                      <div className='mb-3'>
                        <label htmlFor="new_password" className='form-label'>New Password</label>
                        <input
                          {
                          ...register('new_password', {
                            required: "The new password field is required."
                          })
                          }
                          type={showNewPassword ? "text" : "password"}
                          placeholder='Enter new password'
                          className={`form-control ${errors.new_password && 'is-invalid'}`}
                        />
                        <span
                          onClick={() => setNewShowPassword(!showNewPassword)}
                          className='eyeslash-icon'
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {
                          errors.new_password && <p className='invalid-feedback'>{errors.new_password.message}</p>
                        }
                      </div>
                      <div className='mb-3'>
                        <label htmlFor="new_password_confirmation" className='form-label'>Confirm Password</label>
                        <input
                          {
                          ...register('new_password_confirmation', {
                            required: "The confirm password field is required."
                          })
                          }
                          type={showConPassword ? "text" : "password"}
                          placeholder='Enter confirm password'
                          className={`form-control ${errors.new_password_confirmation && 'is-invalid'}`}
                        />
                        <span
                          onClick={() => setConShowPassword(!showConPassword)}
                          className='eyeslash-icon'
                        >
                          {showConPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {
                          errors.new_password_confirmation && <p className='invalid-feedback'>{errors.new_password_confirmation.message}</p>
                        }
                      </div>
                      <div className='d-flex justify-content-between align-items-center'>
                        <button disabled={loading} className='btn btn-primary'>{loading === false ? "Update" : "Please wait..."}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChangePassword