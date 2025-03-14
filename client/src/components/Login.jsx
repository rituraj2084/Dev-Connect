import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      const res = await axios.post(
        BASE_URL + '/login',
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate('/');
    } catch (error) {
      setError(error?.response?.data || 'Something went wrong!');
      console.error(error);
    }
  };
  const handleSignUpClick = async () => {
    try {
      const res = await axios.post(
        BASE_URL + '/signup',
        {
          firstName,
          lastName,
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      navigate('/profile');
    } catch (error) {
      setError(error?.response?.data || 'Something went wrong!');
      console.error(error);
    }
  };
  return (
    <div className="flex justify-center mt-5">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? 'Login' : 'SignUp'}
          </h2>
          {!isLoginForm && (
            <>
              <label className="form-control w-full max-w-xs my-1">
                <div className="label">
                  <span className="label-text">First Name:</span>
                </div>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered input-primary w-full max-w-xs"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs my-1">
                <div className="label">
                  <span className="label-text">Last Name:</span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered input-primary w-full max-w-xs"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </>
          )}
          <label className="form-control w-full max-w-xs my-1">
            <div className="label">
              <span className="label-text">Email Id:</span>
            </div>
            <input
              type="email"
              value={email}
              className="input input-bordered input-primary w-full max-w-xs"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="form-control w-full max-w-xs my-1">
            <div className="label">
              <span className="label-text">Password:</span>
            </div>
            <input
              type="password"
              value={password}
              className="input input-bordered input-primary w-full max-w-xs"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary my-2"
              onClick={isLoginForm ? handleLoginClick : handleSignUpClick}
            >
              {isLoginForm ? 'Login' : 'SignUp'}
            </button>
          </div>
          <p
            className="cursor-pointer text-center"
            onClick={() => setIsLoginForm((prevVal) => !prevVal)}
          >
            {isLoginForm
              ? 'New User? SignUp Here'
              : 'Existing User? Login Here'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
