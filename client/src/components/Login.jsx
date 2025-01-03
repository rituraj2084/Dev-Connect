import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('ritu@gmail.com');
  const [password, setPassword] = useState('Ritu@123');

  const handleLoginClick = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3000/login',
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex justify-center mt-5">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
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
          <div className="card-actions justify-center">
            <button className="btn btn-primary my-2" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
