import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';
import UserCard from './UserCard';

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLasttName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [about, setAbout] = useState(user.about);
  const [gender, setGender] = useState(user.gender);
  const [age, setAge] = useState(user.age || '');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const handleSaveButton = async () => {
    setError('');
    try {
      const res = await axios.patch(
        BASE_URL + '/profile/edit',
        { firstName, lastName, photoUrl, about, gender, age },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      setError(error?.response?.data);
    }
  };
  return (
    <>
      <div className="flex justify-center gap-6 my-6">
        <div className="card bg-base-300 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>
            <label className="form-control w-full max-w-xs my-1">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                type="text"
                value={firstName}
                className="input input-bordered input-primary w-full max-w-xs"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-1">
              <div className="label">
                <span className="label-text">Last Name</span>
              </div>
              <input
                type="text"
                value={lastName}
                className="input input-bordered input-primary w-full max-w-xs"
                onChange={(e) => setLasttName(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-1">
              <div className="label">
                <span className="label-text">Gender</span>
              </div>
              <select
                className="select select-primary w-full max-w-xs"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </label>
            <label className="form-control w-full max-w-xs my-1">
              <div className="label">
                <span className="label-text">Age</span>
              </div>
              <input
                type="text"
                value={age}
                className="input input-bordered input-primary w-full max-w-xs"
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-1">
              <div className="label">
                <span className="label-text">Photo URL</span>
              </div>
              <input
                type="text"
                value={photoUrl}
                className="input input-bordered input-primary w-full max-w-xs"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>

            <label className="form-control w-full max-w-xs my-1">
              <div className="label">
                <span className="label-text">About</span>
              </div>
              <textarea
                className="textarea textarea-primary"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              ></textarea>
            </label>
            {error && <p className="text-red-500">{error}</p>}

            <div className="card-actions justify-center">
              <button
                className="btn btn-primary my-2"
                onClick={handleSaveButton}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
        <UserCard
          user={{ firstName, lastName, age, gender, about, photoUrl }}
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully!!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
