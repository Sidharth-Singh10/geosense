"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import * as THREE from "three";
import Maps from "../maps/page";
import Navbar from "../components/navbar";
import { useUserContext } from "../components/user_context";
import DrawRectangles from "../components/konva";
export default function GlobePage() {
  const globeRef = useRef();
  const { overlayOn } = useUserContext();

  const initGlobe = () => {
    const world = (globeRef.current.__world = new Globe(globeRef.current, {
      animateIn: false,
    })
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png"));

    // Auto-rotate
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.35;

    // Add clouds sphere
    const CLOUDS_IMG_URL = "./clouds.png";
    const CLOUDS_ALT = 0.004;
    const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(
          world.getGlobeRadius() * (1 + CLOUDS_ALT),
          75,
          75
        ),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      world.scene().add(clouds);
      (function rotateClouds() {
        clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
        requestAnimationFrame(rotateClouds);
      })();
    });
  };

  // When the selectedPlace is not null or changed we need to rotate the map at high speed and zoom and scroll to the bottom of the screen.
  const { selectedPlace } = useUserContext();
  // console.log("Selected Place:", selectedPlace);
  useEffect(() => {
    if (selectedPlace) {
      const world = globeRef.current.__world;
      if (world) {
        // Increase rotation speed and zoom in with transition
        const targetRotationSpeed = 5;
        const targetZoom = 20; // Double the zoom value
        const transitionDuration = 2000; // Transition duration in milliseconds

        const initialRotationSpeed = world.controls().autoRotateSpeed;
        const initialZoom = world.camera().position.z;

        const startTime = performance.now();

        const animateTransition = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / transitionDuration, 1);

          world.controls().autoRotateSpeed =
            initialRotationSpeed +
            (targetRotationSpeed - initialRotationSpeed) * progress;
          world.camera().position.z =
            initialZoom + (targetZoom - initialZoom) * progress;

          if (progress < 1) {
            requestAnimationFrame(animateTransition);
          } else {
            // Scroll to the bottom of the screen
            window.scrollTo({
              top: document.body.scrollHeight,
            });
            // Increase the opacity of the element to be 100 on scroll
            const bottomElement = document.getElementById("map");
            if (bottomElement) {
              bottomElement.style.transition = `opacity ${transitionDuration}ms`;
              bottomElement.style.opacity = "1";
            }
            const navC = document.getElementById("navC");
            if (navC) {
              navC.style.background="transparent"
            }
          }
        };

        requestAnimationFrame(animateTransition);
      }
    }
    console.log("Selecteddd Place:", selectedPlace);
  }, [selectedPlace]);

  return (
    <>
      {/* <Script src="//unpkg.com/globe.gl" onLoad={initGlobe} />
      <div className="bg-black pt-8 pb-4 sticky top-0 z-50">
        <Navbar />
      </div>
      <div style={{ margin: 0 }} className="z-10">
        <div ref={globeRef} id="globeViz" className="z-1000" />
      </div>
      <Maps /> */}
        <Script src="//unpkg.com/globe.gl" onLoad={initGlobe} />
        <div id="navC" className="bg-black pt-8 pb-4 sticky top-0 z-[999]">
          <Navbar />
        </div>
        <div style={{ margin: 0 }} className="z-10">
          <div ref={globeRef} id="globeViz" className="z-1000" />
        </div>

        <Maps />

    
    </>
  );
}
