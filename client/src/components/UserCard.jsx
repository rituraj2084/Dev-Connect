import axios from 'axios';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, age, gender, about, photoUrl } = user;
  const dispatch = useDispatch();
  const handleRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + '/request/' + status + '/' + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt="profile-photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        {age && gender && (
          <p>
            {age} {gender}
          </p>
        )}
        <p>{about}</p>
        <div className="card-actions justify-center">
          <button
            className="btn btn-primary"
            onClick={() => handleRequest('ignored', _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleRequest('interested', _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
