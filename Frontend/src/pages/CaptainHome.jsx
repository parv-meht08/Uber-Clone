/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopup from "../components/RidePopup";
import ConfirmRidePopup from "../components/ConfirmRidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainHome = () => {
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const { socket } = useContext(SocketContext);
  const { captain, isLoading } = useContext(CaptainDataContext);

  const [ride, setRide] = useState(null);

  // Socket connection effect
  useEffect(() => {
    if (!socket || !captain || isLoading) {
      console.log('Waiting for socket or captain data...', { 
        socketExists: !!socket, 
        captainExists: !!captain, 
        isLoading 
      });
      return;
    }

    const handleConnect = () => {
      console.log('Socket connected, joining as captain:', captain._id);
      setIsConnected(true);
      socket.emit("join", { userId: captain._id, userType: "captain" });
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
      setIsConnected(false);
    };

    // Set up event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);

    // If already connected, join immediately
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
    };
  }, [socket, captain, isLoading]);

  // Ride request handler effect
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewRide = (data) => {
      console.log('New ride received:', data);
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on('new-ride', handleNewRide);

    return () => {
      socket.off('new-ride', handleNewRide);
    };
  }, [socket, isConnected]);

  // Location update effect
  useEffect(() => {
    if (!socket || !captain || !isConnected) return;

    const updateLocation = () => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Sending location update:', { latitude, longitude });

          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              type: "Point",
              coordinates: [longitude, latitude]
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );
    };

    // Update location immediately and then every 10 seconds
    updateLocation();
    const locationInterval = setInterval(updateLocation, 10000);

    return () => clearInterval(locationInterval);
  }, [socket, captain, isConnected]);

  useGSAP(() => {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, { transform: "translateY(0)" });
    } else {
      gsap.to(ridePopupPanelRef.current, { transform: "translateY(100%)" });
    }
  }, [ridePopupPanel]);

  useGSAP(() => {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, { transform: "translateY(0)" });
    } else {
      gsap.to(confirmRidePopupPanelRef.current, { transform: "translateY(100%)" });
    }
  }, [confirmRidePopupPanel]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen">
      <div className="fixed p-3 top-0 flex items-center justify-between w-full z-10">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <Link
            to="/captain/profile"
            className="h-10 w-10 bg-white rounded-full flex items-center justify-center"
          >
            <i className="text-lg ri-menu-line"></i>
          </Link>
        </div>
      </div>

      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://preview.redd.it/no-bunching-on-the-1-today-v0-nzpdd01nd9od1.png?auto=webp&s=e51976ed1310b4b897ce9355e46b8ef7cf333ed1"
          alt="uber-map"
        />
      </div>

      <div className="h-2/5 p-6">
        {captain ? (
          <CaptainDetails />
        ) : (
          <div>No captain data available</div>
        )}
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 translate-y-full bg-white px-3 py-10 pt-12 bottom-0"
      >
        <RidePopup
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
          ride={ride}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed h-screen w-full z-10 translate-y-full bg-white px-3 py-10 pt-12 bottom-0"
      >
        <ConfirmRidePopup
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
