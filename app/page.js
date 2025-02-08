"use client";

import { APIProvider, Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";

export default function Home() {
  return (
    <APIProvider apiKey={"AIzaSyCBUWqISO_DOQUKhwb7q09wQteK87WOEec"} onLoad={() => console.log("Maps API has loaded.")}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1>Hello</h1>
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
          onCameraChanged={(ev) =>
            console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
          }
          className="w-full h-[500px]"
        />
      </div>
    </APIProvider>
  );
}
