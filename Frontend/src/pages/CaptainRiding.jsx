/* eslint-disable no-unused-vars */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const finishRidePanelRef = useRef(null)

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

  return (
    <div className="h-screen">
      <div className="fixed p-3 top-0 flex items-center justify-between w-full z-10">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white rounded-full flex items-center justify-center"
        >
          <i className="text-lg ri-logout-circle-line"></i>
        </Link>
      </div>

      <div className="h-4/5">
        <img
          className="h-full w-full object-cover"
          src="https://preview.redd.it/no-bunching-on-the-1-today-v0-nzpdd01nd9od1.png?auto=webp&s=e51976ed1310b4b897ce9355e46b8ef7cf333ed1"
          alt="uber-map"
        />
      </div>

      <div className="h-1/5 p-6 flex items-center relative justify-between bg-yellow-400"
      onClick={()=>{
        setFinishRidePanel(true)
      }}
      >
        <h5
          onClick={() => {}}
          className="p-1 text-center w-[95%] absolute top-0"
        >
          <i className="text-3xl text-gray-600 ri-arrow-drop-up-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">4 km away</h4>
        <button  className="bg-green-600 text-white font-semibold p-3 px-8 rounded-lg">
          Complete Ride
        </button>
      </div>

      <div ref={finishRidePanelRef} className="fixed h-screen w-full z-10 translate-y-full bg-white px-3 py-10 pt-12 bottom-0">
          <FinishRide setFinishRidePanel={setFinishRidePanel}/>
      </div>

    </div>
  );
};

export default CaptainRiding;
