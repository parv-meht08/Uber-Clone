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
  const [vehicleType, setVehicleType] = useState(null);

  const {socket} = useContext(SocketContext)
  const {user} = useContext(UserDataContext)

  useEffect(() => {
    socket.emit("join", {userType: "user", userId: user._id})
  }, [user])
  

  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      fullname: {
        firstname: 'John',
        lastname: 'Doe'
      },
      email: 'john.doe@example.com',
      password: 'securepassword',
      vehicle: {
        color: 'red',
        plate: 'XYZ123',
        capacity: 4,
        vehicleType: 'car'
      }
    };
    console.log('Payload:', payload);
    try {
      const response = await axios.post('http://localhost:4000/captains/register', payload);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      // Optionally display the error message to the user
      alert(`Registration failed: ${error.response?.data?.message || error.message}`);
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

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: {
            pickup: pickUp,
            destination: dest,
            vehicleType: "all",
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const cachedFare = {
        car: response.data.car
          ? `₹${Math.round(response.data.car.fare)}`
          : "N/A",
        auto: response.data.auto
          ? `₹${Math.round(response.data.auto.fare)}`
          : "N/A",
        moto: response.data.moto
          ? `₹${Math.round(response.data.moto.fare)}`
          : "N/A",
      };
      setFare(cachedFare);
    } catch (error) {
      console.error("Error fetching fare:", error);
      setFare({
        car: "N/A",
        auto: "N/A",
        moto: "N/A",
      });
    }
  }

  async function createRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup: pickUp,
          destination: dest,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Ride created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error response:", {
        status: error.response?.status,
        data: error.response?.data,
        errors: error.response?.data?.errors?.map((e) => ({
          field: e.path,
          message: e.msg,
          value: e.value,
        })),
      });

      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map((err) => `${err.path}: ${err.msg}`)
          .join("\n");
        console.error("Validation errors:", errorMessages);
      }
      throw error;
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
          fare={fare}
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
          fare={fare}
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
          fare={fare}
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
