import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionsSlice';

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const fetchConnections = async () => {
    const res = await axios.get(BASE_URL + '/user/connections', {
      withCredentials: true,
    });
    dispatch(addConnections(res?.data?.data));
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length == 0) return <div>No connections found!!</div>;

  return connections.map((connection) => {
    const { firstName, lastName, age, gender, about, photoUrl } = connection;
    return (
      <div className="w-2/5 mx-auto">
        <div
          key={connection._id}
          className="flex items-center my-5 gap-10 bg-base-300 p-5 rounded-lg"
        >
          <div>
            <img src={photoUrl} alt="Photo" className="rounded-full w-28" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{firstName + ' ' + lastName}</h2>
            {age && gender && (
              <p>
                {age} {gender}
              </p>
            )}
            <p>{about}</p>
          </div>
        </div>
      </div>
    );
  });
};

export default Connections;
