import React, { useContext } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import { Link } from 'react-router-dom';

const CaptainProfile = () => {
  const { captain, isLoading } = useContext(CaptainDataContext);

  if (isLoading || !captain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/captain-home" className="text-2xl">
          <i className="ri-arrow-left-line"></i>
        </Link>
        <h1 className="text-xl font-semibold">Profile</h1>
        <div className="w-8"></div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="h-20 w-20 bg-gray-200 rounded-full mr-4"></div>
          <div>
            <h2 className="text-xl font-semibold">
              {captain.fullname ? `${captain.fullname.firstname} ${captain.fullname.lastname}` : 'Captain'}
            </h2>
            <p className="text-gray-600">{captain.phone || 'No phone number'}</p>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      {captain.vehicle && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle Type</span>
              <span className="font-medium">{captain.vehicle.vehicleType || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle Number</span>
              <span className="font-medium">{captain.vehicle.vehicleNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">License Number</span>
              <span className="font-medium">{captain.vehicle.licenseNumber || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {captain.rating || '4.8'}
            </div>
            <div className="text-gray-600">Rating</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {captain.totalTrips || '0'}
            </div>
            <div className="text-gray-600">Trips</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainProfile;
