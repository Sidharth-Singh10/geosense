"use client";
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [overlayOn, setOverlayOn] = useState(false);

  return (
    <UserContext.Provider value={{ selectedPlace, setSelectedPlace,overlayOn, setOverlayOn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
