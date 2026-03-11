# Sequence Diagrams

## GeoSense — Geospatial Land Measurement Platform

---

## Table of Contents

1. [Single Area Measurement (End-to-End)](#1-single-area-measurement-end-to-end)
2. [Place Search with Autocomplete](#2-place-search-with-autocomplete)
3. [Globe-to-Map Transition](#3-globe-to-map-transition)
4. [Rectangle Drawing and Screenshot Capture](#4-rectangle-drawing-and-screenshot-capture)
5. [Area Computation (Backend Interaction)](#5-area-computation-backend-interaction)
6. [Measurement History Management](#6-measurement-history-management)
7. [Bulk Image Upload and Processing](#7-bulk-image-upload-and-processing)
8. [Error Handling — Backend Unavailable](#8-error-handling--backend-unavailable)

---

## 1. Single Area Measurement (End-to-End)

This is the primary workflow covering a full measurement from landing to result.

```mermaid
sequenceDiagram
    actor User
    participant LP as Landing Page
    participant Globe as Globe View
    participant Navbar
    participant Places as Google Places API
    participant Map as Google Map
    participant Konva as Konva Overlay
    participant Screenshot as Screenshot Lib
    participant Backend as ML Backend (SAM)
    participant Sidebar

    User->>LP: Opens GeoSense (/)
    LP-->>User: Render hero section with animations

    User->>LP: Clicks "Get Started"
    LP->>Globe: Navigate to /globe

    Globe-->>User: Render 3D globe (auto-rotating)

    User->>Navbar: Types location in search bar
    Navbar->>Places: getPlacePredictions(query)
    Places-->>Navbar: Place predictions list
    Navbar-->>User: Display autocomplete suggestions

    User->>Navbar: Selects a place
    Navbar->>Places: getDetails(placeId)
    Places-->>Navbar: Place geometry (lat, lng, viewport)
    Navbar->>Globe: Update coordinates in UserContext

    Globe->>Globe: Fly-to animation (point of view)
    Globe->>Map: Transition to satellite map view
    Map-->>User: Render satellite imagery at location

    User->>Navbar: Clicks "Route" button
    Navbar->>Konva: Set overlay visible = true
    Konva-->>User: Transparent drawing canvas appears over map

    User->>Konva: Click + drag to draw rectangle
    Konva->>Konva: Record (x1, y1, x2, y2)
    User->>Konva: Release mouse (mouseup)

    Konva->>Screenshot: Capture map container as PNG
    Screenshot-->>Konva: PNG image blob

    Konva->>Map: Read current scale value (m/px)
    Map-->>Konva: scaleVal

    Konva->>Backend: POST /img {file, x1, y1, x2, y2, width, height, scaleVal}
    Note over Konva,Backend: Loading indicator shown to user

    Backend->>Backend: SAM segmentation + area calculation
    Backend-->>Konva: {area (acres), image_blob (hex PNG)}

    Konva->>Sidebar: Add measurement {area, image} to state
    Konva-->>User: Toast notification "Measurement complete"
    Sidebar-->>User: Update measurement list
```

---

## 2. Place Search with Autocomplete

Detailed interaction for the search functionality.

```mermaid
sequenceDiagram
    actor User
    participant Search as Search Input (Navbar)
    participant Context as UserContext
    participant Places as Google Places API
    participant MapView as Map / Globe

    User->>Search: Types characters (e.g. "New Del")
    Search->>Search: Debounce input (wait for pause)

    Search->>Places: AutocompleteService.getPlacePredictions({input})
    Places-->>Search: predictions[]

    Search-->>User: Render dropdown with suggestions

    User->>Search: Clicks "New Delhi, India"
    Search->>Places: PlacesService.getDetails({placeId})
    Places-->>Search: {geometry: {location, viewport}}

    Search->>Context: setCoordinates({lat, lng})
    Search->>Context: setViewport(viewport)

    Context-->>MapView: State update triggers re-render
    MapView->>MapView: Pan and zoom to new coordinates
    MapView-->>User: Map centered on selected location
```

---

## 3. Globe-to-Map Transition

The animated transition when a user selects a place from the globe view.

```mermaid
sequenceDiagram
    actor User
    participant Globe as Globe Component
    participant Context as UserContext
    participant MapComp as Map Component
    participant GMap as Google Maps API

    Note over User,GMap: User has selected a place — coordinates are in UserContext

    Context-->>Globe: coordinates updated (lat, lng)

    Globe->>Globe: pointOfView({lat, lng, altitude}, 2000ms)
    Note over Globe: Smooth fly-to animation over 2 seconds

    Globe->>Globe: Animation complete
    Globe->>Globe: Set showMap = true

    Globe-->>MapComp: Map component renders (conditionally)

    MapComp->>GMap: Initialize map at (lat, lng), zoom level, satellite type
    GMap-->>MapComp: Map tiles loaded
    MapComp-->>User: Satellite map visible with controls
```

---

## 4. Rectangle Drawing and Screenshot Capture

The drawing interaction and subsequent screenshot process.

```mermaid
sequenceDiagram
    actor User
    participant Konva as Konva Stage/Layer
    participant KRect as Konva Rect Shape
    participant DomToImg as dom-to-image-more
    participant MapDOM as Map DOM Element

    Note over User,MapDOM: Drawing overlay is active

    User->>Konva: mousedown at (startX, startY)
    Konva->>Konva: isDrawing = true
    Konva->>KRect: Create rect at (startX, startY, 0, 0)

    User->>Konva: mousemove to (currentX, currentY)
    Konva->>KRect: Update width = currentX - startX
    Konva->>KRect: Update height = currentY - startY
    KRect-->>User: Rectangle visually resizes in real-time

    User->>Konva: mouseup at (endX, endY)
    Konva->>Konva: isDrawing = false
    Konva->>Konva: Store {x1: startX, y1: startY, x2: endX, y2: endY}

    Konva->>DomToImg: toPng(mapContainerElement)
    DomToImg->>MapDOM: Render DOM to canvas
    MapDOM-->>DomToImg: Canvas with map pixels
    DomToImg-->>Konva: Full-size PNG data URL

    Konva->>Konva: Crop PNG to rectangle bounds
    Konva->>Konva: Convert to Blob for upload
```

---

## 5. Area Computation (Backend Interaction)

The API call and response handling.

```mermaid
sequenceDiagram
    participant Konva as Konva Component
    participant Axios as Axios HTTP Client
    participant Backend as ML Backend :9000
    participant SAM as SAM Model
    participant Context as UserContext
    participant Toast as React Toastify

    Konva->>Konva: Build FormData {file, x1, y1, x2, y2, width, height, scaleVal}

    Konva->>Axios: POST /img (FormData)
    Axios->>Backend: HTTP POST /img (multipart/form-data)

    Backend->>Backend: Parse form fields and image file
    Backend->>Backend: Crop image to rectangle coordinates
    Backend->>SAM: Run segmentation on cropped image
    SAM-->>Backend: Segmentation mask (boundary pixels)
    Backend->>Backend: Calculate area from mask + scaleVal
    Backend->>Backend: Encode processed image as hex PNG

    Backend-->>Axios: 200 OK {area: 12.5, image_blob: "89504e47..."}
    Axios-->>Konva: Response data

    Konva->>Konva: Decode hex image_blob to displayable image
    Konva->>Context: addMeasurement({area: 12.5, image: decodedImg})
    Konva->>Toast: toast.success("Area: 12.5 acres")
    Toast-->>Konva: Notification displayed
```

---

## 6. Measurement History Management

Sidebar interactions for viewing and managing measurements.

```mermaid
sequenceDiagram
    actor User
    participant Navbar
    participant Sidebar
    participant Context as UserContext

    User->>Navbar: Clicks sidebar toggle button
    Navbar->>Sidebar: Set sidebar visible = true
    Sidebar-->>User: Sidebar slides in with measurement list

    Note over User,Context: Sidebar shows measurements from UserContext

    loop For each measurement
        Sidebar-->>User: Display area value + thumbnail
    end

    alt Delete single measurement
        User->>Sidebar: Clicks delete on measurement #3
        Sidebar->>Context: removeMeasurement(index: 3)
        Context-->>Sidebar: State updated (measurements array)
        Sidebar-->>User: Measurement #3 removed from list
    else Clear all measurements
        User->>Sidebar: Clicks "Clear All"
        Sidebar->>Context: clearAllMeasurements()
        Context-->>Sidebar: State updated (empty array)
        Sidebar-->>User: Empty sidebar with no measurements
    end

    User->>Navbar: Clicks sidebar toggle button
    Navbar->>Sidebar: Set sidebar visible = false
    Sidebar-->>User: Sidebar slides out
```

---

## 7. Bulk Image Upload and Processing

The complete bulk upload workflow.

```mermaid
sequenceDiagram
    actor User
    participant BulkPage as Bulk Upload Page
    participant FileInput as File Input
    participant Axios as Axios HTTP Client
    participant Backend as ML Backend :9000
    participant Results as Results Panel

    User->>BulkPage: Navigates to /bulk-upload
    BulkPage-->>User: Render upload form

    User->>FileInput: Selects image files (img1.png, img2.png, ...)
    FileInput-->>BulkPage: Files stored in state

    User->>FileInput: Selects JSON config file
    FileInput-->>BulkPage: Config parsed and stored

    User->>BulkPage: Clicks "Upload" / "Process"
    BulkPage->>BulkPage: Build FormData {files[], params: jsonConfig}

    BulkPage->>Axios: POST /bulk/ (FormData)
    Note over BulkPage,Backend: Progress indicator shown

    Axios->>Backend: HTTP POST /bulk/ (multipart/form-data)

    loop For each image
        Backend->>Backend: Process image with SAM
        Backend->>Backend: Calculate area
    end

    Backend-->>Axios: {results: [{success, filename, area, outputImage}, ...]}
    Axios-->>BulkPage: Response data

    BulkPage->>Results: Populate batch results
    Results-->>User: Batch summary (total: 10, success: 8, failed: 2, rate: 80%)

    User->>Results: Clicks on individual result
    Results-->>User: Show area value + processed image for that file

    alt Export results
        User->>Results: Clicks "Export PDF"
        Results->>Results: Generate PDF from batch data
        Results-->>User: Download PDF file
    end

    alt Create new batch
        User->>BulkPage: Clicks "New Batch"
        BulkPage->>BulkPage: Store current batch, initialize new one
        BulkPage-->>User: Fresh upload form (previous batch accessible)
    end
```

---

## 8. Error Handling — Backend Unavailable

Behavior when the ML backend is unreachable.

```mermaid
sequenceDiagram
    actor User
    participant Konva as Konva Component
    participant Axios as Axios HTTP Client
    participant Backend as ML Backend :9000
    participant Toast as React Toastify

    User->>Konva: Draws rectangle and releases mouse
    Konva->>Konva: Capture screenshot, build FormData

    Konva->>Axios: POST /img (FormData)
    Axios->>Backend: HTTP POST /img

    Note over Axios,Backend: Connection timeout / ECONNREFUSED

    Backend--xAxios: Network error (no response)
    Axios-->>Konva: Error: Network Error

    Konva->>Toast: toast.error("Failed to connect to server")
    Toast-->>User: Error notification displayed

    Note over User: User can retry by drawing again
    Note over User: Map and other features remain functional
```

---

## Diagram Legend

| Symbol    | Meaning                                          |
|-----------|--------------------------------------------------|
| `->>`     | Synchronous request / function call              |
| `-->>` | Response / return value                          |
| `--x`     | Failed request / error                           |
| `Note`    | Explanatory annotation                           |
| `loop`    | Repeated action                                  |
| `alt`     | Alternative flows (if/else)                      |
| `actor`   | Human user                                       |
| `participant` | System component or external service         |
