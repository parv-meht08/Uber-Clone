/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom';

const ConfirmRidePopup = (props) => {
  return (
    <div>
    <h5
      onClick={() => {
        props.setConfirmRidePopupPanel(false);
      }}
      className="p-1 text-center w-[93%] absolute top-0"
    >
      <i className="text-3xl text-gray-200 ri-arrow-down-s-line"></i>
    </h5>

    <h3 className="text-2xl font-semibold mb-3">Confirm This Ride To Start</h3>

    <div className="flex items-center justify-between p-2 bg-yellow-400 rounded-lg mt-4">
      <div className="flex items-center gap-3">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src="https://static1.squarespace.com/static/656f4e4dababbd7c042c4946/657236350931ee4538eea52c/65baf15103d8ad2826032a8a/1727029299965/how-to-stop-being-a-people-pleaser-1_1.jpg?format=1500w"
          alt=""
        />
        <h2 className="text-lg font-medium">Rahul Dave</h2>
      </div>
      <h5 className="text-lg font-semibold">2.2km</h5>
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

      <Link
        to='/captain-riding'
        className="mt-5 w-full bg-yellow-400 text-black font-semibold p-2 rounded-lg flex items-center justify-center"
      >
        Confirm Ride
      </Link>

      <button
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
          props.setRidePopupPanel(false)
        }}
        className="mt-1 w-full bg-red-500 text-white font-semibold p-2 rounded-lg"
      >
        Cancle Ride
      </button>
    </div>
  </div>
  )
}

export default ConfirmRidePopup
