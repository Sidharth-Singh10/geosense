"use client";
import React, { useState, useEffect } from "react";
import { X, Info, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useUserContext } from "./user_context";
import { toast } from "react-toastify";

export default function Sidebar() {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    measurements, 
    clearMeasurements,
    deleteMeasurement
  } = useUserContext();
  
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  // Handle clear all measurements with confirmation
  const handleClearAll = () => {
    setShowConfirmClear(true);
  };
  
  const confirmClear = () => {
    clearMeasurements();
    setShowConfirmClear(false);
    toast.success("All measurements cleared");
  };
  
  const cancelClear = () => {
    setShowConfirmClear(false);
  };
  
  // Format the area number with commas and 2 decimal places
  const formatArea = (area) => {
    if (!area && area !== 0) return "N/A";
    return area.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 bg-white/10 backdrop-blur-lg border-l border-white/20 shadow-lg shadow-black/20 transition-transform duration-300 z-[999] ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/20">
        <h2 className="text-xl font-semibold text-white">Measurements</h2>
        <div className="flex items-center gap-3">
          {measurements.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-white/70 hover:text-white transition px-3 py-1 rounded border border-white/20 text-sm hover:bg-white/10"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/70 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="overflow-auto h-[calc(100vh-64px)] p-4">
        {measurements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/70">
            <Info size={48} className="mb-4" />
            <p className="text-center">No measurements yet. Draw an area on the map to measure it.</p>
          </div>
        ) : (
          measurements.map((measurement, index) => (
            <div 
              key={index} 
              className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10 shadow-sm relative group"
            >
              {/* Delete button */}
              <button 
                onClick={() => {
                  deleteMeasurement(index);
                  toast.info("Measurement deleted");
                }}
                className="absolute top-3 right-3 text-white/40 hover:text-white/90 transition opacity-0 group-hover:opacity-100"
                title="Delete measurement"
              >
                <X size={16} />
              </button>
              
              <div className="mb-3">
                <h3 className="text-lg font-medium text-white mb-2">Area #{index + 1}</h3>
                <p className="text-white/90 font-mono">
                  {formatArea(measurement.area)} acres
                </p>
              </div>
              
              {measurement.imageBlob && (
                <div className="mt-4 relative bg-black/20 rounded-lg overflow-hidden">
                  <img
                    src={`data:image/png;base64,${measurement.base64Image}`}
                    alt={`Measurement ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
              
              <div className="mt-3 text-xs text-white/60">
                {measurement.timestamp}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Confirmation Dialog for Clear All */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-white/10">
            <div className="flex items-center text-amber-400 mb-4">
              <AlertTriangle className="mr-2" size={24} />
              <h3 className="text-lg font-semibold">Confirm Clear All</h3>
            </div>
            
            <p className="text-white/80 mb-6">
              Are you sure you want to clear all measurements? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelClear}
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}