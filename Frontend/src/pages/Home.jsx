/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LokkingForDriver from "../components/LokkingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

const Home = () => {
  const [pickUp, setPickUp] = useState("");
  const [dest, setdest] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelClose = useRef(null);
  const cofirmRideRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingDriverRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [cofirmRidePanel, setCofirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingDriver, setWaitingDriver] = useState(false);

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
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (cofirmRidePanel) {
        gsap.to(cofirmRideRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(cofirmRideRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [cofirmRidePanel]
  );
  
  useGSAP(
    function () {
      if (waitingDriver) {
        gsap.to(waitingDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingDriver]
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
        className="fixed w-full z-10 translate-y-full bg-white px-3 py-10 pt-12 bottom-0"
      >
        <VehiclePanel
          setCofirmRidePanel={setCofirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div
        ref={cofirmRideRef}
        className="fixed w-full z-10 translate-y-full bg-white px-3 py-6 pt-12 bottom-0"
      >
        <ConfirmRide
          setVehiclePanel={setVehiclePanel}
          setVehicleFound={setVehicleFound}
          setCofirmRidePanel={setCofirmRidePanel}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 translate-y-full bg-white px-3 py-6 pt-12 bottom-0"
      >
        <LokkingForDriver
          setVehiclePanel={setVehiclePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={waitingDriverRef}
        className="fixed w-full z-10 bg-white px-3 py-6 pt-12 bottom-0"
      >
        <WaitingForDriver setWaitingDriver={setWaitingDriver} />
      </div>
    </div>
  );
};

export default Home;
