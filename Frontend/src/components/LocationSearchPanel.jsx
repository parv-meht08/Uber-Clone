/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React from "react";

const LocationSearchPanel = (props) => {
  const locations = [
    "24B, Near Nilkanth Marbels, Piplag Chokdi, Nadiad, Gujarat 387001",
    "25B, Near Santram Mandir, Nadiad, Gujarat 387001",
    "2Y, Near Vaniyawad, Vaniyawad Circle, Nadiad, Gujarat 387001",
    "4B, Near Kideny Hospital, Kideny Hospital, Nadiad, Gujarat 387001",
  ];

  return (
    <div>
      {locations.map(function (elem, idx) {
        return (
          <div key={idx}
          onClick={() => {
            props.setVehiclePanel(true)
            props.setPanelOpen(false)
          }}
            className="flex active:border-2 p-3 border-gray-100 active:border-black rounded-xl items-center justify-start gap-2 pr-3 my-2 mr-[13px]"
          >
            <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h4 className="font-medium">{elem}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
