/* eslint-disable no-unused-vars */
import React from 'react'

const RidePopup = () => {
  return (
    <div>
    <h5
      onClick={() => {
        props.setCofirmRidePanel(false);
      }}
      className="p-1 text-center w-[93%] absolute top-0"
    >
      <i className="text-3xl text-gray-200 ri-arrow-down-s-line"></i>
    </h5>
    <h3 className="text-2xl font-semibold mb-3">New Ride Availabel</h3>
      <div className='flex items-center justify-between mt-4'>
        <div className='flex items-center gap-3'>
            <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7SieSDnaZtBEq5mYqs-QZEOMuiED6aC6X0Q&s" alt="" />
            <h2 className='text-lg font-medium'>Harsh Patel</h2>
        </div>
        <h5 className='text-lg font-semibold'>2.2km</h5>
      </div>
    <div className="flex gap-2 flex-col justify-between items-center mb-3">
      <div className="w-full mt-5">
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="text-lg ri-map-pin-user-fill"></i>
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm -mt-1 text-gray-600 ">
              Kankariya Talab, Ahemdabad
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="text-lg ri-map-pin-fill"></i>
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm -mt-1 text-gray-600 ">
              Kankariya Talab, Ahemdabad
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-3">
          <i className="ri-currency-line"></i>
          <div>
            <h3 className="text-lg font-medium">₹193.20</h3>
            <p className="text-sm -mt-1 text-gray-600 ">Cash Cash</p>
          </div>
        </div>
      </div>

      <button onClick={()=>{props.setVehicleFound(true)
        props.setCofirmRidePanel(false)
      }} className="mt-5 w-full bg-green-600 text-white font-semibold p-2 rounded-lg">
        Confirm Ride
      </button>
      <button className="mt-1 w-full bg-gray-300 font-semibold p-2 rounded-lg">
        Ignore
      </button>
    </div>
  </div>
  )
}

export default RidePopup
