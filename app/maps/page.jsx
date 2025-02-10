"use client"
import React from "react";
import Gmaps from "@/app/components/map";
import { useState } from "react";
import DrawingOverlay from "@/app/components/overlay";

export default function Maps() {
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  return (
    <div className="h-screen">
        <Gmaps></Gmaps>
      <button onClick={() => setIsDrawingMode(!isDrawingMode)}>
        {isDrawingMode ? 'Disable' : 'Enable'} Drawing Mode
      </button>
      <DrawingOverlay isEnabled={isDrawingMode} />
    </div>
  );
}
