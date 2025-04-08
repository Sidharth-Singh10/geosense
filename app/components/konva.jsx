// export default DrawRectangles;
import React, { useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
// import "./k.css"
import html2canvas from "html2canvas";
import { takeScreenshot, checkIfBrowserSupported } from "@xata.io/screenshot";
import axios from "axios";
import { useUserContext } from "./user_context";
import { toast } from "react-toastify";
function DrawRectangles({ divRef, setSvgContent }) {
  const { overlayOn, setOverlayOn, setImageBlob, scaleVal } = useUserContext();

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

    //
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
          downloadScreenshot(croppedBase64); // Use the cropped image
        });
        // downloadScreenshot(screenshot);

        // console.log(screenshot);
      });
    }
  };

  async function downloadScreenshot(base64Data) {
    // Convert base64 to a Blob
    const byteCharacters = atob(base64Data.split(",")[1]); // Remove the data URL prefix
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });

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
    formData.append("scaleVal",scaleVal);
    try {
      // Previous working Code

      // const response = await axios.post(
      //   "https://4b42-2409-40e3-38a-44f0-a079-2f29-5124-d5df.ngrok-free.app/svg",
      //   formData,
      //   // {
      //   //   responseType: "blob", // Ensures we receive binary image data
      //   // }
      // );
      // console.log(response);
      // const imageUrl = document.createElement("a");
      // const img = document.createElement("img");

      // img.src = URL.createObjectURL(response.data.svg);
      // divRef.current.innerHTML = "";
      // img.style.position = "absolute";
      // img.style.zIndex = "999";
      // divRef.current.appendChild(img);
      // console.log(response.headers);
      // const maskArea = response.headers["x-mask-area"];
      // console.log((scaleVal * scaleVal * maskArea) / 4046.85642);
      // console.log("Scale Value:", scaleVal);
      // console.log("Mask Area:", maskArea);

      // toast.success(
      //   "Area(sq.metres): ",
      //   (scaleVal * scaleVal * maskArea) / 4046.85642
      // );

      // New code start here

      const response = await axios.post(
        "https://faa5-2409-40e3-102c-8d07-5ee-b428-81c1-ee76.ngrok-free.app/img",
        formData,
        {
          responseType: "json",
        }
      );
      console.log(response);
      console.log("gaudhindeeee madarchoddddddddddddd")
      console.log(response.data.image_blob);
      // setSvgContent(response.data.svg);
      downloadHexImage(response.data.image_blob, "screenshot.png");
      // const svgWrapper = document.createElement("div");
      // svgWrapper.innerHTML = response.data.svg;
      // svgWrapper.style.position = "absolute";
      // svgWrapper.style.top = "0";
      // svgWrapper.style.left = "0";
      // svgWrapper.style.width = "100%";
      // svgWrapper.style.height = "100%";
      // svgWrapper.style.zIndex = "9999";
      // svgWrapper.style.pointerEvents = "none";
      // svgWrapper.style.backgroundColor = "black";

      // const previousSvgWrappers =
      //   divRef.current.querySelectorAll(".svg-overlay");
      // previousSvgWrappers.forEach((wrapper) => wrapper.remove());

      // svgWrapper.classList.add("svg-overlay");

      // divRef.current.appendChild(svgWrapper);

      // toast.success(
      //   `Area(sq.metres): ${(
      //     (scaleVal * scaleVal * maskArea) /
      //     4046.85642
      //   ).toFixed(4)}`
      // );
    } catch (error) {
      console.error("Error sending screenshot:", error);
    }
  }
  function downloadHexImage(hexString, filename = 'image.png') {
    // Convert hex string to a Uint8Array
    const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  
    // Create a Blob from the byte array (type: PNG)
    const blob = new Blob([bytes], { type: 'image/png' });
  
    // Create an object URL and trigger download
    const link = document.createElement('a');
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
