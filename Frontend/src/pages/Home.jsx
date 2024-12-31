/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";

const Home = () => {
  const [pickUp, setPickUp] = useState("");
  const [dest, setdest] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelClose = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
        });
        gsap.to(panelClose.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
        });
        gsap.to(panelClose.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: 'translateY(0)',
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );
  
  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-20 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber"
      />

      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://preview.redd.it/no-bunching-on-the-1-today-v0-nzpdd01nd9od1.png?auto=webp&s=e51976ed1310b4b897ce9355e46b8ef7cf333ed1"
          alt="uber-map"
        />
      </div>

      <div className=" flex flex-col justify-end h-screen absolute bottom-0 w-full">
        <div className="h-[30%] bg-white p-5 relative">
          <h5
            ref={panelClose}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 top-0 left-3 text-xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[37%] left-[2.25rem] bg-gray-500 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
              }}
              value={pickUp}
              onChange={(e) => setPickUp(e.target.value)}
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-2"
              type="text"
              placeholder="add a pickup location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
              }}
              value={pickUp}
              onChange={(e) => setPickUp(e.target.value)}
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-2"
              type="text"
              placeholder="enter you destination"
            />
          </form>
        </div>

        <div ref={panelRef} className="pl-5 h-0 bg-white">
          <LocationSearchPanel
           setPanelOpen={setPanelOpen}
           setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 translate-y-full bg-white px-3 py-10 pt-14 bottom-0"
      >
       <h5 onClick={()=>{
        setVehiclePanel(false);
      }} className="p-1 text-center w-[93%] absolute top-0"><i className="text-3xl text-gray-200 ri-arrow-down-s-line"></i></h5>
        <h3 className="text-2xl font-semibold mb-3">Choose a Vehicle</h3>

        <div className="flex border-2 active:border-black bg-gray-100 rounded-lg w-full items-center justify-between p-3 gap-1 mb-3">
          <img
            className="h-8"
            src="https://static.vecteezy.com/system/resources/thumbnails/046/836/811/small/side-view-white-car-png.png"
            alt=""
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
          <h2 className="text-lg font-semibold">₹156.3</h2>
        </div>

        <div className="flex border-2 active:border-black bg-gray-100 rounded-lg w-full items-center justify-between p-3 gap-1 mb-3">
          <img
            className="h-10"
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
            alt=""
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
          <h2 className="text-lg font-semibold">₹65</h2>
        </div>

        <div className="flex border-2 active:border-black bg-gray-100 rounded-lg w-full items-center justify-between p-3 gap-1 mb-3">
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
          <h2 className="text-lg font-semibold">₹118.6</h2>
        </div>
      </div>

    </div>
  );
};

export default Home;
