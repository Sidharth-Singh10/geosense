import React, { useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
// import "./k.css"

function DrawRectangles() {
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

  const handleMouseUp = () => {
    if (newRect) setRectangles([...rectangles, newRect]);
    setNewRect(null);
    setIsDrawing(false);
    console.log("new rect: is ", newRect);
    console.log("🔹 Start Point:", startPoint);
    console.log("🔹 End Point:", endPoint);
    console.log("📏 Width:", dimensions.width, " | Height:", dimensions.height);
  };

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
