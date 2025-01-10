/* eslint-disable no-unused-vars */
import React, {useContext} from 'react'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = () => {
  const { captain, isLoading } = useContext(CaptainDataContext);
  
  // Check if captain is loading
  if (isLoading) {
    return <div>Loading...</div>; // Show loading while fetching data
  }

  // Check if captain is null and handle accordingly
  if (!captain) {
    return <div>No captain data available.</div>; // Handle case when captain data is not available
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-start gap-4">
          <img className="h-10 w-10 rounded-full object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7SieSDnaZtBEq5mYqs-QZEOMuiED6aC6X0Q&s" alt="" />
          <h4 className="text-lg font-medium capitalize">{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
        </div>
        <div>
          <h5 className="text-xl font-semibold">₹506.3</h5>
          <p className="text-sm text-gray-600">Earned</p>
        </div>
      </div>
      <div className="flex mt-6 p-6 bg-gray-100 rounded-xl justify-center gap-4 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-extralight ri-time-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-extralight ri-speed-up-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-extralight ri-booklet-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails
