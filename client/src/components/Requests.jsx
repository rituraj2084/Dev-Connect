import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequest } from '../utils/requestsSlice';

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + '/user/requests/received', {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.error(error);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + '/request/review/' + status + '/' + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;
  if (requests.length == 0)
    return <div className="flex justify-center my-6">No requests found!!</div>;

  return (
    <div className="flex flex-col items-center my-10">
      <h1 className="font-bold text-white text-3xl">Requests</h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, age, gender, about, photoUrl } =
          request?.fromUserId;
        return (
          <div
            key={_id}
            className="flex items-center m-4 p-4 bg-base-300 rounded-lg w-1/2"
          >
            <div>
              <img
                src={photoUrl}
                alt="Photo"
                className="rounded-full w-20 h-20"
              />
            </div>
            <div className="text-left mx-4">
              <h2 className="text-xl font-bold">
                {firstName + ' ' + lastName}
              </h2>
              {age && gender && (
                <p>
                  {age} {gender}
                </p>
              )}
              <p>{about}</p>
            </div>
            <div>
              <button
                className="btn btn-primary mx-2"
                onClick={() => reviewRequest('rejected', _id)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => reviewRequest('accepted', _id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
