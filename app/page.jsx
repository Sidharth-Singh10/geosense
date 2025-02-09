"use client"
import React from "react";
import Gmaps from "./components/map";
import { useEffect, useRef, useState } from "react";
import DrawingOverlay from "./components/overlay";

export default function Home() {
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  return (
    <main className="h-screen ">
      <div className="h-1/2 ">
        <Gmaps></Gmaps>
      </div>
      <button onClick={() => setIsDrawingMode(!isDrawingMode)}>
        {isDrawingMode ? 'Disable' : 'Enable'} Drawing Mode
      </button>
      <DrawingOverlay isEnabled={isDrawingMode} />
    </main>
  );
}
