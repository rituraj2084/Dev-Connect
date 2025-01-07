import axios from 'axios';
import UserCard from './UserCard';
import { BASE_URL } from '../utils/constants';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';

const Feed = () => {
  const dispatch = useDispatch();
  const userFeed = useSelector((store) => store.feed);
  const fetchFeed = async () => {
    if (userFeed) return;
    const res = await axios.get(BASE_URL + '/feed', { withCredentials: true });
    dispatch(addFeed(res.data));
  };
  useEffect(() => {
    fetchFeed();
  }, []);
  return (
    <>
      {userFeed && (
        <div className="flex justify-center my-10">
          <UserCard user={userFeed[0]} />
        </div>
      )}
    </>
  );
};

export default Feed;
