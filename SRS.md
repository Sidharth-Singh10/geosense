# Software Requirements Specification (SRS)

## GeoSense — Geospatial Land Measurement Platform

| Field           | Value                                   |
|-----------------|-----------------------------------------|
| **Version**     | 1.0                                     |
| **Date**        | March 11, 2026                          |
| **Project**     | GeoSense                                |
| **Repository**  | https://github.com/Sidharth-Singh10/geosense |
| **License**     | MIT                                     |

---

## Table of Contents

1. [Introduction](#1-introduction)
   1. [Purpose](#11-purpose)
   2. [Scope](#12-scope)
   3. [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
   4. [References](#14-references)
   5. [Overview](#15-overview)
2. [Overall Description](#2-overall-description)
   1. [Product Perspective](#21-product-perspective)
   2. [Product Functions](#22-product-functions)
   3. [User Classes and Characteristics](#23-user-classes-and-characteristics)
   4. [Operating Environment](#24-operating-environment)
   5. [Design and Implementation Constraints](#25-design-and-implementation-constraints)
   6. [Assumptions and Dependencies](#26-assumptions-and-dependencies)
3. [System Architecture](#3-system-architecture)
   1. [High-Level Architecture](#31-high-level-architecture)
   2. [Technology Stack](#32-technology-stack)
   3. [External Interfaces](#33-external-interfaces)
4. [Specific Requirements](#4-specific-requirements)
   1. [Functional Requirements](#41-functional-requirements)
   2. [Non-Functional Requirements](#42-non-functional-requirements)
5. [Data Requirements](#5-data-requirements)
   1. [Data Flow](#51-data-flow)
   2. [API Contracts](#52-api-contracts)
6. [User Interface Requirements](#6-user-interface-requirements)
   1. [Pages and Navigation](#61-pages-and-navigation)
   2. [Component Inventory](#62-component-inventory)
7. [Appendices](#7-appendices)
   1. [Project Structure](#71-project-structure)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification documents the functional and non-functional requirements for GeoSense, a web-based geospatial land measurement platform. It is intended for developers, testers, project managers, and stakeholders involved in the development, deployment, and maintenance of the system.

### 1.2 Scope

GeoSense is a browser-based application that allows users to measure the area of land parcels directly from satellite/map imagery. The system integrates:

- A **Next.js frontend** providing an interactive map interface with drawing capabilities.
- An **external ML backend** powered by the Segment-Anything Model (SAM) for boundary detection and area calculation.
- **Google Maps Platform** for satellite imagery, geocoding, and place search.

The platform supports both single-area measurement (interactive map drawing) and bulk image processing (batch upload). Documented accuracy ranges from 75% to 90%.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term        | Definition                                                              |
|-------------|-------------------------------------------------------------------------|
| SAM         | Segment-Anything Model — a foundation model for image segmentation      |
| Roboflow    | A platform for computer vision data annotation and model deployment     |
| SRS         | Software Requirements Specification                                     |
| API         | Application Programming Interface                                       |
| UI          | User Interface                                                          |
| UX          | User Experience                                                         |
| Konva       | An HTML5 Canvas JavaScript framework for 2D drawing                     |
| Geocoding   | Converting addresses/place names into geographic coordinates            |
| Scale Value | The meters-per-pixel ratio at the current map zoom level                |

### 1.4 References

- [GeoSense Repository](https://github.com/Sidharth-Singh10/geosense)
- [GeoSense Demo Video](https://drive.google.com/file/d/1SN7KI1FBtuXRM0s3r9nWUarDeCnij7WY/view?usp=sharing)
- [Segment-Anything Model (SAM)](https://segment-anything.com/)
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Next.js Documentation](https://nextjs.org/docs)

### 1.5 Overview

The remainder of this document is organized as follows: Section 2 provides an overall description of the product. Section 3 covers system architecture and technology choices. Section 4 details specific functional and non-functional requirements. Section 5 describes data requirements and API contracts. Section 6 covers user interface requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

GeoSense is a standalone web application composed of two subsystems:

1. **Frontend (this repository)** — A Next.js single-page application responsible for all user interaction, map rendering, drawing overlays, screenshot capture, and result display.
2. **Backend (external)** — A Python-based ML inference server that receives map screenshots, runs SAM-based segmentation, and returns computed land area. The backend is deployed separately and communicates over HTTP.

The frontend depends on third-party services:
- **Google Maps JavaScript API** — Map tiles, satellite imagery, Places autocomplete.
- **Google Maps Places API** — Location search and geocoding.

### 2.2 Product Functions

The system provides the following high-level functions:

| ID    | Function                     | Description                                                                 |
|-------|------------------------------|-----------------------------------------------------------------------------|
| PF-01 | Interactive Globe View       | 3D globe visualization for geographic orientation and place selection       |
| PF-02 | Place Search                 | Autocomplete-based location search using Google Places API                  |
| PF-03 | Satellite Map Display        | High-resolution satellite imagery via Google Maps                           |
| PF-04 | Area Selection Drawing       | User draws a rectangle on the map to define the region of interest          |
| PF-05 | Screenshot Capture           | Programmatic capture of the map viewport for backend processing             |
| PF-06 | Land Area Computation        | Backend processes the screenshot using SAM and returns the area in acres    |
| PF-07 | Measurement History          | Sidebar panel displaying all measurements taken in the current session      |
| PF-08 | Bulk Image Upload            | Upload multiple images with configuration for batch area computation        |
| PF-09 | Batch Result Management      | View, manage, and export bulk processing results                           |
| PF-10 | Result Export                 | Export bulk processing results as PDF                                       |

### 2.3 User Classes and Characteristics

| User Class           | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| General User         | Any user accessing the web interface to measure land area. No authentication required.            |
| Land Surveyor        | Professional users who need approximate area measurements from satellite imagery.                 |
| Bulk Processor       | Users uploading multiple images for batch area computation (e.g., for large-scale land analysis). |

All user classes interact with the same interface. No role-based access control is currently implemented.

### 2.4 Operating Environment

| Component         | Requirement                                                                |
|-------------------|----------------------------------------------------------------------------|
| Client Browser    | Modern browsers supporting ES2020+ (Chrome 90+, Firefox 88+, Edge 90+, Safari 15+) |
| Client Device     | Desktop or tablet with minimum 1280×720 resolution recommended             |
| Frontend Server   | Node.js 18+ runtime; deployed via Vercel or equivalent                     |
| Backend Server    | Python runtime with SAM model; accessible over HTTP on port 9000           |
| Network           | Internet access required for Google Maps API; backend must be reachable from the client |

### 2.5 Design and Implementation Constraints

1. **Google Maps API Key** — A valid API key with Maps JavaScript API and Places API enabled is required.
2. **Backend Availability** — The ML backend must be running and network-accessible for area computation to function.
3. **Browser APIs** — The application relies on Canvas API and `html2canvas`/`dom-to-image-more` for screenshot capture, which may have cross-origin limitations.
4. **Model Accuracy** — SAM-based segmentation provides 75–90% accuracy; results are approximate.
5. **No Persistent Storage** — Measurements are stored only in client-side React state and are lost on page refresh.

### 2.6 Assumptions and Dependencies

1. The Google Maps API key is valid and has sufficient quota.
2. The ML backend is deployed and reachable at the configured base URL.
3. Users have a stable internet connection for loading map tiles.
4. Satellite imagery quality at the target location is sufficient for segmentation.
5. The SAM model and Roboflow annotations are pre-trained and deployed on the backend.

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client Browser                    │
│                                                     │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │  Globe   │→ │ Google Map│→ │  Konva Drawing   │  │
│  │  View    │  │ + Places  │  │  Overlay         │  │
│  └──────────┘  └───────────┘  └────────┬─────────┘  │
│                                        │ screenshot  │
│  ┌──────────────────┐  ┌──────────────┐│             │
│  │  Sidebar         │← │  Results     ││             │
│  │  (Measurements)  │  │  Processing  │←             │
│  └──────────────────┘  └──────┬───────┘              │
│                               │                      │
└───────────────────────────────┼──────────────────────┘
                                │ HTTP POST
                                ▼
┌───────────────────────────────────────────────────────┐
│                    ML Backend (SAM)                    │
│                                                       │
│  POST /img   → Single image segmentation + area calc  │
│  POST /bulk/ → Batch image processing                 │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

#### Frontend

| Layer          | Technology                          | Version  |
|----------------|-------------------------------------|----------|
| Framework      | Next.js (App Router)                | 15.1.6   |
| UI Library     | React                               | 18.x     |
| Styling        | Tailwind CSS                        | 3.4.1    |
| Maps           | @vis.gl/react-google-maps           | 1.5.1    |
| 3D Globe       | globe.gl + Three.js                 | 2.39.7   |
| Drawing        | react-konva                         | 19.0.2   |
| Screenshots    | html2canvas, dom-to-image-more      | —        |
| Animations     | Framer Motion, @react-spring/web    | —        |
| HTTP Client    | Axios                               | 1.7.9    |
| Icons          | Lucide React                        | 0.475.0  |
| Notifications  | React Toastify                      | 11.0.3   |

#### Backend (External)

| Layer          | Technology                          |
|----------------|-------------------------------------|
| ML Model       | Segment-Anything Model (SAM)        |
| Annotation     | Roboflow                            |
| Protocol       | HTTP REST API                       |

### 3.3 External Interfaces

#### 3.3.1 Google Maps JavaScript API
- **Purpose**: Render satellite map tiles, provide map controls (zoom, pan, tilt), and supply map scale values.
- **Integration**: Via `@vis.gl/react-google-maps` React wrapper.
- **Data exchanged**: Map tile requests, geocoding queries, place details.

#### 3.3.2 Google Places API
- **Purpose**: Autocomplete place search to navigate to a specific location.
- **Integration**: Via `@vis.gl/react-google-maps` `useMapsLibrary("places")`.
- **Data exchanged**: Search query string → list of place predictions → place geometry (lat/lng, viewport).

#### 3.3.3 ML Backend API
- **Purpose**: Receive map screenshots and return computed land area.
- **Protocol**: HTTP POST with `multipart/form-data`.
- **Base URL**: Configurable (currently `http://192.168.82.43:9000`).

---

## 4. Specific Requirements

### 4.1 Functional Requirements

#### FR-01: 3D Globe Visualization

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-01                                                                       |
| **Priority** | High                                                                        |
| **Description** | The system shall render an interactive 3D globe with Earth textures and cloud layers. |
| **Input**    | None (renders on page load).                                                |
| **Behavior** | The globe auto-rotates. When a place is selected, the globe animates (flies) to the selected coordinates, then transitions to the 2D map view. |
| **Output**   | Visual 3D globe rendered using WebGL.                                       |

#### FR-02: Place Search with Autocomplete

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-02                                                                       |
| **Priority** | High                                                                        |
| **Description** | The system shall provide a search bar with autocomplete suggestions powered by Google Places API. |
| **Input**    | User types a location query (partial address, place name, etc.).            |
| **Behavior** | As the user types, the system fetches and displays place predictions. On selection, the system extracts the geometry (lat/lng, viewport) and navigates the map/globe to that location. |
| **Output**   | Selected place coordinates stored in application state; map/globe pans accordingly. |

#### FR-03: Satellite Map Display

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-03                                                                       |
| **Priority** | High                                                                        |
| **Description** | The system shall display a Google Maps satellite view of the selected location. |
| **Input**    | Geographic coordinates and zoom level.                                      |
| **Behavior** | The map renders satellite imagery with scale control enabled. The map type is fixed to `satellite`. Heading and tilt are set to 0 for an overhead view. |
| **Output**   | Interactive satellite map with zoom/pan controls.                           |

#### FR-04: Area Selection via Rectangle Drawing

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-04                                                                       |
| **Priority** | High                                                                        |
| **Description** | The system shall allow the user to draw a rectangle on the map overlay to define the region of interest. |
| **Input**    | User clicks and drags on the map to draw a rectangle.                       |
| **Behavior** | When the drawing overlay is active (toggled via the "Route" button in the navbar), a transparent Konva canvas layer appears over the map. The user draws a rectangle by clicking and dragging. The rectangle coordinates (x1, y1, x2, y2) relative to the canvas are recorded. |
| **Output**   | Rectangle coordinates and dimensions stored in application state.           |

#### FR-05: Map Screenshot Capture

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-05                                                                       |
| **Priority** | High                                                                        |
| **Description** | The system shall capture a screenshot of the map viewport for backend processing. |
| **Input**    | Map DOM element reference.                                                  |
| **Behavior** | Upon completing a rectangle drawing, the system uses `dom-to-image-more` or `html2canvas` to capture the map container as a PNG image. The image is cropped to the drawn rectangle bounds. |
| **Output**   | PNG image blob ready for upload.                                            |

#### FR-06: Land Area Computation

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-06                                                                       |
| **Priority** | High                                                                        |
| **Description** | The system shall send the captured screenshot and rectangle metadata to the ML backend and receive the computed land area. |
| **Input**    | PNG screenshot, rectangle coordinates (x1, y1, x2, y2), image dimensions (width, height), map scale value (meters/pixel). |
| **Behavior** | The system sends a `POST /img` request with multipart form data. The backend runs SAM segmentation and returns the area in acres along with an annotated image. |
| **Output**   | Area value (in acres) and processed image (hex-encoded PNG).                |

#### FR-07: Measurement History Sidebar

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-07                                                                       |
| **Priority** | Medium                                                                      |
| **Description** | The system shall display a sidebar listing all measurements taken in the current session. |
| **Input**    | Measurement results from FR-06.                                             |
| **Behavior** | Each measurement entry shows the area value and optionally a thumbnail of the processed image. Users can delete individual measurements or clear all. The sidebar is toggled via the navbar. |
| **Output**   | Visual list of measurements with area values.                               |

#### FR-08: Bulk Image Upload

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-08                                                                       |
| **Priority** | Medium                                                                      |
| **Description** | The system shall allow users to upload multiple images along with a JSON configuration file for batch area computation. |
| **Input**    | Multiple image files (PNG/JPG) and a JSON config file specifying parameters (scale, coordinates, settings). |
| **Behavior** | The system sends a `POST /bulk/` request with all images and the JSON config. The backend processes each image and returns results. |
| **Output**   | Batch results with per-image area values, success/failure status, and optional processed images. |

#### FR-09: Batch Result Management

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-09                                                                       |
| **Priority** | Medium                                                                      |
| **Description** | The system shall allow users to create, switch between, and delete batches. |
| **Input**    | User interactions (create batch, switch batch, delete batch).               |
| **Behavior** | Each batch maintains its own set of results. A summary shows total images processed, successes, failures, and success rate. |
| **Output**   | Batch-specific result views with summary statistics.                        |

#### FR-10: Result Export as PDF

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-10                                                                       |
| **Priority** | Low                                                                         |
| **Description** | The system shall allow users to export bulk processing results as a PDF document. |
| **Input**    | User clicks "Export PDF" button.                                            |
| **Behavior** | The system generates a PDF containing the batch results summary and per-image details. |
| **Output**   | Downloadable PDF file.                                                      |

#### FR-11: Navigation Bar

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-11                                                                       |
| **Priority** | High                                                                        |
| **Description** | The system shall provide a top navigation bar with search, overlay toggle, sidebar toggle, and branding. |
| **Input**    | User interactions (click buttons, type in search).                          |
| **Behavior** | The navbar contains: (1) GeoSense logo, (2) Place search autocomplete, (3) "Route" button to toggle the drawing overlay, (4) sidebar toggle button. |
| **Output**   | Responsive navigation bar rendered at the top of the page.                  |

#### FR-12: Landing Page

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | FR-12                                                                       |
| **Priority** | Medium                                                                      |
| **Description** | The system shall display a landing page with animated text and a call-to-action button. |
| **Input**    | None (renders on page load at `/`).                                         |
| **Behavior** | The landing page shows the GeoSense branding with SplitText scroll animation and DecryptedText scramble-to-reveal effects. A "Get Started" button navigates to the `/globe` route. |
| **Output**   | Animated landing page.                                                      |

### 4.2 Non-Functional Requirements

#### NFR-01: Performance

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-01                                                                      |
| **Requirement** | The map view shall render at a minimum of 30 FPS during pan and zoom interactions. |
| **Rationale** | Smooth map interaction is critical for accurate rectangle drawing.          |

#### NFR-02: Response Time

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-02                                                                      |
| **Requirement** | Single-image area computation shall return results within 30 seconds under normal network conditions. |
| **Rationale** | Users expect timely feedback after drawing a selection.                     |

#### NFR-03: Browser Compatibility

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-03                                                                      |
| **Requirement** | The application shall function correctly on the latest two major versions of Chrome, Firefox, Edge, and Safari. |
| **Rationale** | Broad browser support maximizes accessibility.                             |

#### NFR-04: Responsiveness

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-04                                                                      |
| **Requirement** | The UI shall be usable on screens with a minimum width of 1024px. The layout should adapt gracefully to larger screens. |
| **Rationale** | Map-based applications require sufficient screen real estate.              |

#### NFR-05: Accuracy

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-05                                                                      |
| **Requirement** | Land area measurements shall achieve 75–90% accuracy compared to ground-truth survey data. |
| **Rationale** | As documented in the project overview; acceptable for estimation use cases. |

#### NFR-06: Usability

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-06                                                                      |
| **Requirement** | A new user shall be able to complete a single area measurement within 2 minutes without external guidance. |
| **Rationale** | The workflow (search → draw → view result) should be intuitive.            |

#### NFR-07: Availability

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-07                                                                      |
| **Requirement** | The frontend shall be available 99.5% of the time when deployed on a managed platform (e.g., Vercel). Backend availability is managed separately. |
| **Rationale** | Standard SLA for web applications.                                         |

#### NFR-08: Scalability

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-08                                                                      |
| **Requirement** | The frontend shall support at least 100 concurrent users without degradation. Backend scalability is outside the scope of this frontend SRS. |
| **Rationale** | Next.js on Vercel auto-scales; the bottleneck is the ML backend.           |

#### NFR-09: Security

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-09                                                                      |
| **Requirement** | API keys and sensitive configuration shall be stored in environment variables, not hardcoded in source. HTTPS shall be used in production. |
| **Rationale** | Prevent credential exposure and ensure data integrity in transit.          |

#### NFR-10: Maintainability

| Field        | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **ID**       | NFR-10                                                                      |
| **Requirement** | The codebase shall follow component-based architecture with clear separation of concerns. ESLint rules shall be enforced. |
| **Rationale** | Facilitates onboarding and long-term maintenance.                          |

---

## 5. Data Requirements

### 5.1 Data Flow

```
User Action          Frontend                        Backend
───────────          ────────                        ───────
Search place    →  Google Places API  →  Coordinates
Select place    →  Update map center/zoom
Toggle overlay  →  Show Konva canvas
Draw rectangle  →  Record (x1, y1, x2, y2)
                →  Capture screenshot (PNG)
                →  Read map scale (m/px)
                →  POST /img ──────────────→  SAM segmentation
                                              Area calculation
                ←  { area, image_blob } ←──  Response
Display result  ←  Add to measurements[]
                →  Render in sidebar

Bulk upload     →  POST /bulk/ ────────────→  Batch processing
                ←  { results[] } ←─────────  Response
Display results ←  Render batch summary
```

### 5.2 API Contracts

#### 5.2.1 Single Area Measurement — `POST /img`

**Request** (`multipart/form-data`):

| Field      | Type    | Description                                |
|------------|---------|--------------------------------------------|
| `file`     | File    | PNG screenshot of the map viewport         |
| `x1`       | Number  | Left X coordinate of the selection rectangle |
| `y1`       | Number  | Top Y coordinate of the selection rectangle  |
| `x2`       | Number  | Right X coordinate of the selection rectangle |
| `y2`       | Number  | Bottom Y coordinate of the selection rectangle |
| `width`    | Number  | Width of the captured image in pixels       |
| `height`   | Number  | Height of the captured image in pixels      |
| `scaleVal` | Number  | Map scale in meters per pixel               |

**Response** (`application/json`):

| Field         | Type   | Description                                |
|---------------|--------|--------------------------------------------|
| `area`        | Number | Computed land area in acres                |
| `image_blob`  | String | Hex-encoded PNG of the segmented image     |

#### 5.2.2 Bulk Processing — `POST /bulk/`

**Request** (`multipart/form-data`):

| Field    | Type     | Description                                    |
|----------|----------|------------------------------------------------|
| `files`  | File[]   | Array of image files                           |
| `params` | JSON     | Configuration object (scale, coordinates, settings) |

**Response** (`application/json`):

| Field     | Type     | Description                                   |
|-----------|----------|-----------------------------------------------|
| `results` | Array   | Array of result objects                        |

Each result object:

| Field          | Type    | Description                               |
|----------------|---------|-------------------------------------------|
| `success`      | Boolean | Whether processing succeeded              |
| `filename`     | String  | Original filename                         |
| `area`         | Number  | Computed area in acres (if successful)    |
| `outputImage`  | String  | Processed image data (if successful)      |
| `error`        | String  | Error message (if failed)                 |

---

## 6. User Interface Requirements

### 6.1 Pages and Navigation

| Route           | Page             | Description                                              |
|-----------------|------------------|----------------------------------------------------------|
| `/`             | Landing Page     | Hero section with animated text and "Get Started" CTA    |
| `/globe`        | Globe + Map View | 3D globe → satellite map with navbar, sidebar, drawing   |
| `/maps`         | Map View         | Direct satellite map view (standalone)                   |
| `/bulk-upload`  | Bulk Upload      | Image upload form, batch management, results display     |

**Navigation flow**:

```
Landing Page (/)
    │
    ▼ "Get Started"
Globe View (/globe)
    │
    ▼ Place search → fly-to animation
Map View (embedded in /globe)
    │
    ▼ Toggle overlay → draw rectangle → view results
Sidebar (measurements panel)
```

### 6.2 Component Inventory

| Component            | Location                      | Responsibility                                  |
|----------------------|-------------------------------|-------------------------------------------------|
| `HeroSection`        | `app/components/hero_section.jsx` | Landing page content, CTA button              |
| `Navbar`             | `app/components/navbar.jsx`       | Search bar, overlay toggle, sidebar toggle    |
| `Sidebar`            | `app/components/sidebar.jsx`      | Measurement list, clear/delete actions        |
| `Gmaps` (Map)        | `app/components/map.jsx`          | Google Maps rendering, scale tracking         |
| `PlaceAutocomplete`  | `app/components/autocomplete.jsx` | Google Places search input                    |
| `DrawRectangles`     | `app/components/konva.jsx`        | Konva canvas overlay, rectangle drawing, screenshot + API call |
| `CanvasOverlay`      | `app/components/overlay.jsx`      | Alternate canvas-based polygon drawing        |
| `UserContext`        | `app/components/user_context.jsx` | Global state provider (coordinates, measurements, flags) |
| `SplitText`          | `app/ui_comp/text.js`             | Scroll-triggered letter animation             |
| `DecryptedText`      | `app/ui_comp/de_para.js`          | Scramble-to-reveal text effect                |

---

## 7. Appendices

### 7.1 Project Structure

```
geosense/
├── app/
│   ├── page.jsx                    # Landing page
│   ├── layout.js                   # Root layout with providers
│   ├── globals.css                 # Tailwind base styles
│   ├── bulk-upload/
│   │   └── page.jsx                # Bulk image upload & processing
│   ├── globe/
│   │   └── page.jsx                # 3D globe + map view
│   ├── maps/
│   │   └── page.jsx                # Standalone map view
│   ├── components/
│   │   ├── hero_section.jsx        # Landing hero section
│   │   ├── navbar.jsx              # Top navigation bar
│   │   ├── sidebar.jsx             # Measurements sidebar
│   │   ├── map.jsx                 # Google Maps component
│   │   ├── autocomplete.jsx        # Places autocomplete
│   │   ├── konva.jsx               # Konva drawing overlay
│   │   ├── overlay.jsx             # Canvas drawing overlay
│   │   └── user_context.jsx        # Global state context
│   └── ui_comp/
│       ├── text.js                 # SplitText animation
│       └── de_para.js              # DecryptedText animation
├── stable_pages/
│   └── maps-stable.jsx             # Alternate stable map implementation
├── public/                         # Static assets (logos, SVGs, textures)
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.mjs             # Tailwind CSS configuration
├── postcss.config.mjs              # PostCSS configuration
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation
```
