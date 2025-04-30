import React, { useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import html2canvas from "html2canvas";
import { takeScreenshot, checkIfBrowserSupported } from "@xata.io/screenshot";
import axios from "axios";
import { useUserContext } from "./user_context";
import { toast } from "react-toastify";

function DrawRectangles({ divRef, setSvgContent }) {
  const { overlayOn, setOverlayOn, setImageBlob, scaleVal, addMeasurement } =
    useUserContext();

  const [rectangles, setRectangles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newRect, setNewRect] = useState(null);

  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    setIsDrawing(true);
    setNewRect({ x, y, width: 0, height: 0 });

    setStartPoint({ x, y }); // Store start point
    setDimensions({ width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    setNewRect((prev) => ({
      ...prev,
      width: x - prev.x,
      height: y - prev.y,
    }));

    setEndPoint({ x, y }); // Store end point

    setDimensions({
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
    });
  };

  const handleMouseUp = async () => {
    if (newRect) setRectangles([...rectangles, newRect]);
    setNewRect(null);
    setIsDrawing(false);
    console.log("new rect: is ", newRect);
    console.log("🔹 Start Point:", startPoint);
    console.log("🔹 End Point:", endPoint);
    console.log("📏 Width:", dimensions.width, " | Height:", dimensions.height);

    if (checkIfBrowserSupported()) {
      setOverlayOn((prev) => !prev);
      takeScreenshot().then((screenshot) => {
        /**
         * This is a base64-encoded string representing your screenshot.
         * It can go directly into an <img>'s `src` attribute, or be sent to a server to store.
         */
        cropTopFromBase64(screenshot, 105).then((croppedBase64) => {
          console.log(croppedBase64);
          uploadScreenshot(croppedBase64); // Use the cropped image
        });
      });
    }
  };

  async function uploadScreenshot(base64Data) {
    // Convert base64 to a Blob
    const byteCharacters = atob(base64Data.split(",")[1]); // Remove the data URL prefix
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });

    console.log("⬆️ Uploading screenshot with values:");
    console.log("x1:", startPoint.x + 100);
    console.log("y1:", startPoint.y + 100);
    console.log("x2:", endPoint.x + 150);
    console.log("y2:", endPoint.y + 100);
    console.log("width:", dimensions.width);
    console.log("height:", dimensions.height);
    console.log("scaleVal:", scaleVal);
    console.log("file blob:", blob);

    const formData = new FormData();
    formData.append("file", blob, "screenshot.png"); // Append file
    formData.append("x1", startPoint.x + 100);
    formData.append("y1", startPoint.y + 100);
    formData.append("x2", endPoint.x + 150);
    formData.append("y2", endPoint.y + 100);
    // formData.append("x1", startPoint.x);
    // formData.append("y1", startPoint.y);
    // formData.append("x2", endPoint.x);
    // formData.append("y2", endPoint.y);
    formData.append("width", dimensions.width);
    formData.append("height", dimensions.height); // Name it "file" and give it a filename
    formData.append("scaleVal", scaleVal);

    try {
      // Workssss

      const response = await axios.post(
        "http://192.168.82.43:9000/img",
        formData,
        {
          responseType: "json",
        }
      );

      console.log("Response:", response.data);

      // Add the measurement to the context
      if (response.data && response.data.image_blob) {
        const maskArea = response.data.area || 0;
        addMeasurement(maskArea, response.data.image_blob);

        // Show success toast
        toast.success(`Area calculated: ${maskArea.toFixed(2)} acres`);
      }
    } catch (error) {
      console.error("Error sending screenshot:", error);
      toast.error("Failed to calculate area. Please try again.");
    }
  }

  function downloadHexImage(hexString, filename = "image.png") {
    // Convert hex string to a Uint8Array
    const bytes = new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    // Create a Blob from the byte array (type: PNG)
    const blob = new Blob([bytes], { type: "image/png" });

    // Create an object URL and trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Clean up
  }

  function cropTopFromBase64(base64, cropHeight) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // New height after cropping
        const newHeight = img.height - cropHeight;

        canvas.width = img.width;
        canvas.height = newHeight;

        // Draw only the lower part of the image (cropping the top)
        ctx.drawImage(
          img,
          0,
          cropHeight,
          img.width,
          newHeight,
          0,
          0,
          img.width,
          newHeight
        );

        // Convert back to base64
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = base64;
    });
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="bg-transparent"
    >
      <Layer>
        {rectangles.map((rect, i) => (
          <Rect key={i} {...rect} stroke="blue" strokeWidth={2} />
        ))}
        {newRect && <Rect {...newRect} stroke="blue" strokeWidth={2} />}
      </Layer>
    </Stage>
  );
}

export default DrawRectangles;
