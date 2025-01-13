/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LokkingForDriver from "../components/LokkingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { useContext } from "react";
import {UserDataContext} from "../context/userContext";

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
  const [searchType, setSearchType] = useState("pickup");
  const [pickUpSuggestion, setPickUpSuggestion] = useState([]);
  const [destinationSuggestion, setDestinationSuggestion] = useState([]);
  const [fare, setFare] = useState({});
  const [displayFare, setDisplayFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);

  const {socket} = useContext(SocketContext)
  const {user} = useContext(UserDataContext)

  useEffect(() => {
    // Only emit if both socket and user are available
    if (socket && user && user._id) {
      try {
        socket.emit("join", {userType: "user", userId: user._id});
        console.log("Emitted join event for user:", user._id);
      } catch (error) {
        console.error("Error emitting join event:", error);
      }
    } else {
      console.log("Waiting for socket and user to be available");
    }
  }, [socket, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: {
            query: searchType === "pickup" ? pickUp : dest,
            type: searchType,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        if (searchType === "pickup") {
          setPickUpSuggestion(response.data.suggestions);
        } else {
          setDestinationSuggestion(response.data.suggestions);
        }
      }
    } catch (error) {
      console.error(
        "Error fetching suggestions:",
        error.response?.data || error.message
      );
    }
  };

  const handlePickupInputClick = () => {
    setSearchType("pickup");
    setPanelOpen(true);
  };

  const handleDestInputClick = () => {
    setSearchType("destination");
    setPanelOpen(true);
  };

  const handlePickupChange = async (e) => {
    setPickUp(e.target.value);
    if (e.target.value.trim()) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: {
              query: e.target.value,
              type: "pickup",
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          setPickUpSuggestion(response.data.suggestions);
        }
      } catch (error) {
        console.error(
          "Error fetching suggestions:",
          error.response?.data || error.message
        );
      }
    } else {
      setPickUpSuggestion([]);
    }
  };

  const handleDestChange = async (e) => {
    setdest(e.target.value);
    if (e.target.value.trim()) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: {
              query: e.target.value,
              type: "destination",
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          setDestinationSuggestion(response.data.suggestions);
        }
      } catch (error) {
        console.error(
          "Error fetching suggestions:",
          error.response?.data || error.message
        );
      }
    } else {
      setDestinationSuggestion([]);
    }
  };

  useGSAP(
    function () {
      if (panelOpen && panelRef.current) {
        gsap.to(panelRef.current, {
          height: "70%",
        });
        if (panelClose.current) {
          gsap.to(panelClose.current, {
            opacity: 1,
          });
        }
      } else if (panelRef.current) {
        gsap.to(panelRef.current, {
          height: "0%",
        });
        if (panelClose.current) {
          gsap.to(panelClose.current, {
            opacity: 0,
          });
        }
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (!vehiclePanelRef.current) return;
      gsap.to(vehiclePanelRef.current, {
        transform: vehiclePanel ? "translateY(0)" : "translateY(100%)",
      });
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (!vehicleFoundRef.current) return;
      gsap.to(vehicleFoundRef.current, {
        transform: vehicleFound ? "translateY(0)" : "translateY(100%)",
      });
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (!cofirmRideRef.current) return;
      gsap.to(cofirmRideRef.current, {
        transform: cofirmRidePanel ? "translateY(0)" : "translateY(100%)",
      });
    },
    [cofirmRidePanel]
  );

  useGSAP(
    function () {
      if (!waitingDriverRef.current) return;
      gsap.to(waitingDriverRef.current, {
        transform: waitingDriver ? "translateY(0)" : "translateY(100%)",
      });
    },
    [waitingDriver]
  );

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ride/get-fare`,
        {
          params: {
            pickUp,
            dest,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setFare(response.data);
        setDisplayFare({
          car: `₹${response.data.car.fare} (${response.data.car.distance}km)`,
          bike: `₹${response.data.bike.fare} (${response.data.bike.distance}km)`,
          auto: `₹${response.data.auto.fare} (${response.data.auto.distance}km)`,
        });
      }
    } catch (error) {
      console.error(
        "Error fetching fare:",
        error.response?.data || error.message
      );
    }
  }

  async function createRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/create`,
        {
          pickUp,
          dest,
          fare: fare[vehicleType].fare,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        console.log("Ride created:", response.data);
      }
    } catch (error) {
      console.error(
        "Error creating ride:",
        error.response?.data || error.message
      );
    }
  }

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
              onClick={handlePickupInputClick}
              value={pickUp}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-2"
              type="text"
              placeholder="add a pickup location"
            />
            <input
              onClick={handleDestInputClick}
              value={dest}
              onChange={handleDestChange}
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-2"
              type="text"
              placeholder="enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="mt-2 w-full bg-green-500 text-white font-semibold p-2 rounded-lg"
          >
            Find Trip
          </button>
        </div>

        <div ref={panelRef} className="pl-5 h-0 bg-white">
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            pickUp={pickUp}
            setPickUp={setPickUp}
            dest={dest}
            setDest={setdest}
            searchType={searchType}
          />
        </div>

      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 translate-y-full bg-white px-3 py-10 pt-12 bottom-0"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={displayFare}
          pickUp={pickUp}
          dest={dest}
          setCofirmRidePanel={setCofirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div
        ref={cofirmRideRef}
        className="fixed w-full z-10 translate-y-full bg-white px-3 py-6 pt-12 bottom-0"
      >
        <ConfirmRide
          createRide={createRide}
          setVehiclePanel={setVehiclePanel}
          setVehicleFound={setVehicleFound}
          setCofirmRidePanel={setCofirmRidePanel}
          pickUp={pickUp}
          dest={dest}
          fare={displayFare}
          vehicleType={vehicleType}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 translate-y-full bg-white px-3 py-6 pt-12 bottom-0"
      >
        <LokkingForDriver
          pickUp={pickUp}
          dest={dest}
          fare={displayFare}
          vehicleType={vehicleType}
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
