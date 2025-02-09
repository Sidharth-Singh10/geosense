"use client"

import { useState, useRef, useEffect } from "react"

export default function DrawingOverlay({ isEnabled }) {
  const [points, setPoints] = useState([])
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      }
    }
  }, [points])

  const handleClick = (event) => {
    if (!isEnabled) return

    const newPoint = { x: event.clientX, y: event.clientY }
    setPoints((prevPoints) => {
      const updatedPoints = [...prevPoints, newPoint]

      // Check if the new point closes the loop
      if (updatedPoints.length > 3 && isPointClose(newPoint, updatedPoints[0])) {
        alert("Loop closed!")
        return []
      }

      return updatedPoints
    })
  }

  const isPointClose = (point1, point2, threshold = 20) => {
    const dx = point1.x - point2.x
    const dy = point1.y - point2.y
    return Math.sqrt(dx * dx + dy * dy) < threshold
  }

  if (!isEnabled) return null

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        cursor: "crosshair",
      }}
    />
  )
}

