import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { loginApiUrl } from '../components/common/Config';
import toast from 'react-hot-toast';
import { AuthContext } from '../components/context/Auth';

const Login = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const redirectTo = params.get("redirect");

  const { handleSubmit, register, formState: { errors }, setError } = useForm();

  const onSubmit = async (data) => {
    await fetch(loginApiUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 200) {
          const userInfo = {
            name: result.name,
            id: result.id,
            token: result.token
          }
          localStorage.setItem('userInfoLms', JSON.stringify(userInfo));
          login(userInfo);

          // console.log("redirectToredirectTo", redirectTo);

          if (redirectTo) {
            navigate(redirectTo);
          } else {
            navigate('/account/dashboard');
          }
        } else {
          toast.error(result.message)
        }
      })
  }

  return (
    <div className='container py-5 mt-5'>
      <div className='d-flex align-items-center justify-content-center'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='card border-0 shadow login'>
            <div className='card-body p-4'>
              <h3 className='border-bottom pb-3 mb-3'>Login</h3>
              <div className='mb-3'>
                <label className='form-label' htmlFor="email">Email</label>
                <input
                  {
                  ...register('email', {
                    required: "The email field is required."
                  })
                  }
                  type="text"
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  placeholder='Email'
                />
                {
                  errors.email && <p className='invalid-feedback'>{errors.email.message}</p>
                }
              </div>

              <div className='mb-3'>
                <label className='form-label' htmlFor="password">Password</label>
                <input
                  {
                  ...register('password', {
                    required: "The password field is required."
                  })
                  }
                  type="password"
                  className={`form-control ${errors.password && 'is-invalid'}`}
                  placeholder='Password'
                />
                {
                  errors.password && <p className='invalid-feedback'>{errors.password.message}</p>
                }

              </div>

              <div className='d-flex justify-content-between align-items-center'>
                <button className='btn btn-primary'>Login</button>
                <Link to={`/account/register`} className='text-secondary'>Register Here</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login