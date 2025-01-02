/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopup from "../components/RidePopup";

const CaptainHome = () => {
  return (
    <div className="h-screen">
      <div className="fixed p-3 top-0 flex items-center justify-between w-full z-10">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/home"
          className="h-10 w-10 bg-white rounded-full flex items-center justify-center"
        >
          <i className="text-lg ri-logout-circle-line"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://preview.redd.it/no-bunching-on-the-1-today-v0-nzpdd01nd9od1.png?auto=webp&s=e51976ed1310b4b897ce9355e46b8ef7cf333ed1"
          alt="uber-map"
        />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails/>
      </div>
      <div className="fixed w-full z-10 bg-white px-3 py-10 pt-12 bottom-0">
          <RidePopup/>
      </div>
    </div>
  );
};

export default CaptainHome;
