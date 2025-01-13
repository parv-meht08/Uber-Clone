/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from "react";

// Create the CaptainDataContext
export const CaptainDataContext = createContext();

export const CaptainDataProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null); // Initialize as null
  const [isLoading, setIsLoading] = useState(true); // Initialize as loading

  useEffect(() => {
    // Simulate data fetching (Replace with your actual API request)
    setTimeout(() => {
      // Replace this with your actual fetched data
      const fetchedData = {
        fullname: { firstname: "Parv", lastname: "Mehta" },
        earnings: "₹506.3",
        location: { ltd: 12.34, lng: 56.78 },
      };
      
      // Update state with fetched data
      setCaptain(fetchedData);
      setIsLoading(false); // Mark loading as false after data is fetched
    }, 2000); // Simulate a 2-second delay
  }, []); // Empty dependency array, so this runs only once when the component mounts

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain, isLoading }}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainDataProvider;
