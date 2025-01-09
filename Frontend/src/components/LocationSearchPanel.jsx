/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";

const LocationSearchPanel = ({ setPanelOpen, setVehiclePanel, pickUp, setPickUp, dest, setDest, searchType }) => {
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Fetch suggestions when component mounts or search input changes
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: {
          query: query,
          type: searchType
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      setSuggestions([]);
    }
    setLoading(false);
  };

  // Watch for changes in pickUp or dest values
  React.useEffect(() => {
    if (searchType === 'pickup') {
      fetchSuggestions(pickUp);
    } else {
      fetchSuggestions(dest);
    }
  }, [pickUp, dest, searchType]);

  const handleLocationSelect = (address) => {
    if (searchType === 'pickup') {
      setPickUp(address);
    } else {
      setDest(address);
    }
    // setPanelOpen(false);
    // setVehiclePanel(true);
  };

  return (
    <div>
      {loading ? (
        <div className="p-3">Loading...</div>
      ) : (
        suggestions.map((location, idx) => (
          <div
            key={location.place_id || idx}
            onClick={() => handleLocationSelect(location.description)}
            className="flex active:border-2 p-3 border-gray-100 active:border-black rounded-xl items-center justify-start gap-2 pr-3 my-2 mr-[13px]"
          >
            <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h4 className="font-medium">{location.description}</h4>
          </div>
        ))
      )}
    </div>
  );
};

export default LocationSearchPanel;
