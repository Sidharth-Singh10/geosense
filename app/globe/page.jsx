"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import * as THREE from 'three';
import Maps from "../maps/page";
import Navbar from "../components/navbar";
export default function GlobePage() {
  const globeRef = useRef();

  const initGlobe = () => {
    const world = new Globe(globeRef.current, { animateIn: false })
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png");

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

  return (
    <>
      <Script src="//unpkg.com/globe.gl" onLoad={initGlobe} />
      <div className="bg-black">
      <Navbar />
      </div>
      <div style={{ margin: 0 }} className="z-10">
        <div ref={globeRef} id="globeViz" className="z-1000" />
      </div>
      <h1 className="">Hi there2</h1>
      <Maps />
    </>
  );
}
