"use client";
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [overlayOn, setOverlayOn] = useState(false);
  const [imageBlob, setImageBlob] = useState(null);
  const [scaleVal, setScaleVal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [measurements, setMeasurements] = useState([]);

  // Function to add a new measurement
  const addMeasurement = (area, imageBlob) => {
    // Convert hex string to base64
    const hexToBase64 = (hexString) => {
      // First convert hex to binary array
      const bytes = new Uint8Array(
        hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );

      // Then convert to base64
      let binary = "";
      bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
      return btoa(binary);
    };

    const newMeasurement = {
      area,
      imageBlob,
      base64Image: imageBlob ? hexToBase64(imageBlob) : null,
      timestamp: new Date().toLocaleString(),
    };

    setMeasurements((prev) => [newMeasurement, ...prev]);
    setSidebarOpen(true);
  };

  // Function to clear all measurements
  const clearMeasurements = () => {
    setMeasurements([]);
  };

  // Function to delete a single measurement by index
  const deleteMeasurement = (index) => {
    setMeasurements((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <UserContext.Provider
      value={{
        selectedPlace,
        setSelectedPlace,
        overlayOn,
        setOverlayOn,
        imageBlob,
        setImageBlob,
        scaleVal,
        setScaleVal,
        sidebarOpen,
        setSidebarOpen,
        measurements,
        setMeasurements,
        addMeasurement,
        clearMeasurements,
        deleteMeasurement,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
