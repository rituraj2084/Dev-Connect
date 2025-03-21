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

  return (
    <div className="flex flex-col items-center my-10">
      <h1 className="font-bold text-white text-3xl">Connections</h1>
      {connections.map((connection) => {
        const { _id, firstName, lastName, age, gender, about, photoUrl } =
          connection;
        return (
          <div
            key={_id}
            className="flex items-center m-4 p-4 gap-10 bg-base-300 rounded-lg w-1/2"
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
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
