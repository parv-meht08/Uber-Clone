/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const VehiclePanel = (props) => {
  const handleVehicleSelect = async (vehicleType) => {
    console.log("Pickup:", props.pickUp);
    console.log("Destination:", props.dest);

    if (!props.pickUp || !props.dest) {
      alert("Please select both pickup and destination locations");
      return;
    }

    try {
      await props.createRide(vehicleType);
      props.setVehiclePanel(false);
      props.setCofirmRidePanel(true);
    } catch (error) {
      // Format error messages from the array
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map((err) => err.msg || err.message || JSON.stringify(err))
          .join("\n");
        alert(errorMessages);
      } else {
        alert("Unable to create ride. Please try again.");
      }
    }
  };

  return (
    <div>
      <h5
        onClick={() => {
          props.setVehiclePanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-s-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-3">Choose a Vehicle</h3>

      <div
        onClick={() => {
          props.setCofirmRidePanel(true);
          props.selectVehicle('car');
        }}
        className="flex border-2 active:border-black bg-gray-100 rounded-lg w-full items-center justify-between p-3 gap-1 mb-3"
      >
        <img
          className="h-8"
          src="https://static.vecteezy.com/system/resources/thumbnails/046/836/811/small/side-view-white-car-png.png"
          alt="Car"
        />
        <div className="w-1/2">
          <h4 className="font-medium text-sm">
            Uber Go{" "}
            <span>
              <i className="ri-user-line"></i>4
            </span>
          </h4>
          <h5 className="text-gray-600 font-medium text-sm">2 mins away</h5>
          <p className="text-xs text-gray-500">Affordable Compact rides</p>
        </div>
        <h2 className="text-lg font-semibold">{props.fare.car}</h2>
      </div>

      <div
        onClick={() => {
          props.setCofirmRidePanel(true);
          props.selectVehicle('bike');
        }}
        className="flex border-2 active:border-black bg-gray-100 rounded-lg w-full items-center justify-between p-3 gap-1 mb-3"
      >
        <img
          className="h-10"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
          alt="Motorcycle"
        />
        <div className="w-1/2">
          <h4 className="font-medium text-sm">
            Moto{" "}
            <span>
              <i className="ri-user-line"></i>1
            </span>
          </h4>
          <h5 className="text-gray-600 font-medium text-sm">3 mins away</h5>
          <p className="text-xs text-gray-500">Affordable MotorCycle ride</p>
        </div>
        <h2 className="text-lg font-semibold">{props.fare.bike}</h2>
      </div>

      <div
        onClick={() => {
          props.setCofirmRidePanel(true);
          props.selectVehicle('auto');
        }}
        className="flex border-2 active:border-black bg-gray-100 rounded-lg w-full items-center justify-between p-3 gap-1 mb-3"
      >
        <img
          className="h-10"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
          alt=""
        />
        <div className="w-1/2">
          <h4 className="font-medium text-sm">
            Uber Auto{" "}
            <span>
              <i className="ri-user-line"></i>1
            </span>
          </h4>
          <h5 className="text-gray-600 font-medium text-sm">3 mins away</h5>
          <p className="text-xs text-gray-500">Affordable Auto ride</p>
        </div>
        <h2 className="text-lg font-semibold">{props.fare.auto}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
