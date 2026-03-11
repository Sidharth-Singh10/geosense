# User Requirements Document (URD)

## GeoSense — Geospatial Land Measurement Platform

| Field           | Value                                   |
|-----------------|-----------------------------------------|
| **Version**     | 1.0                                     |
| **Date**        | March 11, 2026                          |
| **Project**     | GeoSense                                |
| **Repository**  | https://github.com/Sidharth-Singh10/geosense |

---

## Table of Contents

1. [Introduction](#1-introduction)
   1. [Purpose](#11-purpose)
   2. [Scope](#12-scope)
   3. [Intended Audience](#13-intended-audience)
   4. [Definitions](#14-definitions)
2. [User Characteristics](#2-user-characteristics)
   1. [User Profiles](#21-user-profiles)
   2. [User Skills and Experience](#22-user-skills-and-experience)
3. [User Requirements](#3-user-requirements)
   1. [General Requirements](#31-general-requirements)
   2. [Single Area Measurement](#32-single-area-measurement)
   3. [Bulk Processing](#33-bulk-processing)
   4. [Navigation and Exploration](#34-navigation-and-exploration)
   5. [Results and History](#35-results-and-history)
4. [Usability Requirements](#4-usability-requirements)
   1. [Ease of Use](#41-ease-of-use)
   2. [Feedback and Notifications](#42-feedback-and-notifications)
   3. [Visual Design](#43-visual-design)
   4. [Accessibility](#44-accessibility)
5. [Operational Requirements](#5-operational-requirements)
   1. [Performance Expectations](#51-performance-expectations)
   2. [Availability](#52-availability)
   3. [Platform Support](#53-platform-support)
6. [Constraints and Limitations](#6-constraints-and-limitations)
7. [User Workflow Descriptions](#7-user-workflow-descriptions)
   1. [Workflow 1 — Single Area Measurement](#71-workflow-1--single-area-measurement)
   2. [Workflow 2 — Bulk Image Processing](#72-workflow-2--bulk-image-processing)
8. [Acceptance Criteria](#8-acceptance-criteria)

---

## 1. Introduction

### 1.1 Purpose

This User Requirements Document captures the needs, expectations, and constraints of GeoSense users. It describes *what* users need the system to do from their perspective, independent of technical implementation. This document serves as the foundation for deriving system-level requirements in the SRS.

### 1.2 Scope

GeoSense is a web-based platform that allows users to measure land area from satellite imagery. Users interact with an interactive map, select a region of interest, and receive an area estimate powered by machine-learning-based boundary detection (SAM). The platform also supports batch processing of multiple images.

This document covers requirements for the **frontend web application** that users directly interact with. The ML backend is treated as an external service.

### 1.3 Intended Audience

| Audience               | Purpose                                                    |
|------------------------|------------------------------------------------------------|
| Developers             | Understand what users expect to build the right features   |
| UI/UX Designers        | Design interfaces aligned with user workflows              |
| Testers                | Derive test cases from user expectations                   |
| Project Managers       | Prioritize features based on user needs                    |
| Stakeholders           | Validate that the system meets user goals                  |

### 1.4 Definitions

| Term                | Definition                                                                 |
|---------------------|---------------------------------------------------------------------------|
| Area measurement    | The computed land area (in acres) for a user-selected region              |
| Region of interest  | The rectangular area a user draws on the map for analysis                 |
| Batch / Bulk upload | Processing multiple images in a single operation                          |
| Scale value         | The meters-per-pixel ratio at the current map zoom level                  |
| Fly-to animation    | Smooth transition from the globe view to a specific location on the map   |

---

## 2. User Characteristics

### 2.1 User Profiles

#### Profile 1: Casual User

| Attribute         | Description                                                        |
|-------------------|--------------------------------------------------------------------|
| **Who**           | Anyone curious about the area of a visible land parcel             |
| **Goal**          | Quickly get an approximate area measurement for a location         |
| **Frequency**     | Occasional, one-off usage                                          |
| **Technical skill** | Basic web browsing; no GIS knowledge required                    |

#### Profile 2: Land Surveyor / Real Estate Professional

| Attribute         | Description                                                        |
|-------------------|--------------------------------------------------------------------|
| **Who**           | Professionals who need preliminary area estimates                  |
| **Goal**          | Obtain area estimates for parcels before formal surveying          |
| **Frequency**     | Regular usage, multiple measurements per session                   |
| **Technical skill** | Familiar with maps and geospatial concepts                       |

#### Profile 3: Bulk Analyst

| Attribute         | Description                                                        |
|-------------------|--------------------------------------------------------------------|
| **Who**           | Users performing large-scale land analysis across multiple sites   |
| **Goal**          | Process many images at once and export structured results          |
| **Frequency**     | Periodic batch jobs                                                |
| **Technical skill** | Comfortable with file management and JSON configuration          |

### 2.2 User Skills and Experience

- Users are expected to be comfortable using a web browser and interacting with maps (pan, zoom, search).
- No programming or GIS expertise is required for single measurements.
- Bulk upload users should be able to prepare image files and JSON configuration.
- Users are not expected to understand the underlying ML model or segmentation process.

---

## 3. User Requirements

### 3.1 General Requirements

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| UR-01  | The user shall be able to access the platform from a web browser without installing software.  | High     |
| UR-02  | The user shall not be required to create an account or log in to use any feature.              | High     |
| UR-03  | The user shall be able to understand and start using the tool within 2 minutes.                | High     |
| UR-04  | The user shall receive clear feedback for every action (loading states, success, errors).      | High     |

### 3.2 Single Area Measurement

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| UR-05  | The user shall be able to search for any location by name or address.                          | High     |
| UR-06  | The user shall see satellite imagery of the searched location.                                 | High     |
| UR-07  | The user shall be able to draw a rectangular selection over the area they want measured.        | High     |
| UR-08  | The user shall receive the land area (in acres) of the selected region.                        | High     |
| UR-09  | The user shall see a visual representation of the detected land boundaries in the result.      | Medium   |
| UR-10  | The user shall be able to take multiple measurements in a single session.                      | High     |
| UR-11  | The user shall be able to zoom and pan the map freely before and after measurements.           | High     |

### 3.3 Bulk Processing

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| UR-12  | The user shall be able to upload multiple images at once for batch area computation.            | Medium   |
| UR-13  | The user shall be able to provide configuration parameters for batch processing.               | Medium   |
| UR-14  | The user shall see a summary of batch results (total, succeeded, failed, success rate).        | Medium   |
| UR-15  | The user shall be able to view individual results within a batch.                              | Medium   |
| UR-16  | The user shall be able to create, switch between, and delete batches.                          | Medium   |
| UR-17  | The user shall be able to export batch results as a PDF document.                              | Low      |

### 3.4 Navigation and Exploration

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| UR-18  | The user shall see an engaging landing page that explains the tool's purpose.                  | Medium   |
| UR-19  | The user shall experience a smooth visual transition from a 3D globe to the satellite map.     | Medium   |
| UR-20  | The user shall be able to navigate to any location on Earth using the globe or search.         | High     |
| UR-21  | The user shall have a clear entry point ("Get Started") to begin using the tool.               | High     |

### 3.5 Results and History

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| UR-22  | The user shall be able to view all measurements taken in the current session in a sidebar.     | High     |
| UR-23  | The user shall be able to delete individual measurements from the history.                     | Medium   |
| UR-24  | The user shall be able to clear all measurements at once.                                      | Medium   |
| UR-25  | The user shall be informed that measurements are session-only and not persisted across visits.  | Low      |

---

## 4. Usability Requirements

### 4.1 Ease of Use

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| UB-01  | The primary workflow (search → draw → result) shall require no more than 4 user actions.       | High     |
| UB-02  | The drawing overlay shall have an obvious toggle mechanism.                                    | High     |
| UB-03  | Map controls (zoom, pan) shall behave consistently with standard mapping applications.         | High     |
| UB-04  | The search bar shall be prominently placed and always visible on the map page.                 | High     |

### 4.2 Feedback and Notifications

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| UB-05  | The user shall see a loading indicator while area computation is in progress.                  | High     |
| UB-06  | The user shall see a toast notification upon successful measurement.                           | Medium   |
| UB-07  | The user shall see a clear error message if the backend is unreachable or processing fails.    | High     |
| UB-08  | The user shall see progress indicators during bulk upload and processing.                      | Medium   |

### 4.3 Visual Design

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| UB-09  | The interface shall use a modern, clean visual style with glassmorphism effects.               | Medium   |
| UB-10  | The landing page shall feature engaging animations that convey professionalism.                | Low      |
| UB-11  | The map shall occupy the maximum available screen area to aid precise drawing.                 | High     |
| UB-12  | The sidebar shall not obscure the map when open; it should overlay or push content.            | Medium   |

### 4.4 Accessibility

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| UB-13  | Interactive elements shall have sufficient contrast and clickable area (min 44×44px).          | Medium   |
| UB-14  | Toast notifications shall persist long enough to be read (minimum 3 seconds).                  | Medium   |
| UB-15  | The application shall be usable with keyboard and mouse.                                       | Medium   |

---

## 5. Operational Requirements

### 5.1 Performance Expectations

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| OP-01  | The map shall load within 3 seconds on a standard broadband connection.                        | High     |
| OP-02  | Place search autocomplete results shall appear within 500ms of typing.                         | High     |
| OP-03  | Area computation results shall be returned within 30 seconds of drawing completion.            | High     |
| OP-04  | The 3D globe shall render smoothly (≥30 FPS) on mid-range hardware.                           | Medium   |
| OP-05  | Bulk processing of 10 images shall complete within 5 minutes.                                  | Medium   |

### 5.2 Availability

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| OP-06  | The web application shall be accessible 24/7 when deployed to a managed hosting platform.      | High     |
| OP-07  | Downtime of the ML backend shall not crash the frontend; the user shall see a graceful error.  | High     |

### 5.3 Platform Support

| ID     | Requirement                                                                                    | Priority |
|--------|-----------------------------------------------------------------------------------------------|----------|
| OP-08  | The application shall work on Chrome, Firefox, Edge, and Safari (latest 2 major versions).     | High     |
| OP-09  | The application shall be optimized for desktop use (≥1024px viewport width).                   | High     |
| OP-10  | The application should be usable on tablets in landscape orientation.                           | Low      |

---

## 6. Constraints and Limitations

| ID     | Constraint                                                                                     |
|--------|-----------------------------------------------------------------------------------------------|
| CL-01  | Measurements are approximate (75–90% accuracy) and should not be used as legal survey data.    |
| CL-02  | Measurement history is not persisted — all data is lost when the browser tab is closed.        |
| CL-03  | Area computation requires the ML backend to be online and reachable.                           |
| CL-04  | Accuracy depends on satellite image quality, which varies by location and zoom level.          |
| CL-05  | The selection tool is limited to rectangular regions; irregular shapes are not supported.       |
| CL-06  | Google Maps API usage is subject to quota limits and billing.                                  |
| CL-07  | There is no user authentication; all users share the same access level.                        |

---

## 7. User Workflow Descriptions

### 7.1 Workflow 1 — Single Area Measurement

**Goal**: Measure the area of a land parcel at a specific location.

| Step | User Action                                   | System Response                                       |
|------|-----------------------------------------------|-------------------------------------------------------|
| 1    | Opens the GeoSense website                    | Landing page with hero section and "Get Started" button |
| 2    | Clicks "Get Started"                          | Navigates to the globe view                           |
| 3    | Types a location in the search bar            | Autocomplete suggestions appear                       |
| 4    | Selects a suggestion                          | Globe flies to the location; satellite map appears    |
| 5    | Clicks the "Route" button in the navbar       | Drawing overlay activates over the map                |
| 6    | Clicks and drags to draw a rectangle          | Rectangle renders on the overlay                      |
| 7    | Releases the mouse                            | Screenshot is captured; loading indicator appears     |
| 8    | Waits for processing                          | Backend processes image; result is returned           |
| 9    | Views the result                              | Area (in acres) appears; measurement added to sidebar |
| 10   | (Optional) Opens sidebar                      | Full list of session measurements displayed           |
| 11   | (Optional) Draws another rectangle            | Repeats steps 6–9                                     |

**Postconditions**: The user has one or more area measurements displayed in the sidebar.

### 7.2 Workflow 2 — Bulk Image Processing

**Goal**: Process multiple pre-captured images to compute area for each.

| Step | User Action                                   | System Response                                       |
|------|-----------------------------------------------|-------------------------------------------------------|
| 1    | Navigates to `/bulk-upload`                   | Bulk upload page with file input is displayed         |
| 2    | Selects multiple image files                  | File names listed in the upload area                  |
| 3    | Uploads a JSON config file with parameters    | Config file attached                                  |
| 4    | Clicks "Upload" / "Process"                   | Files sent to backend; progress indicator appears     |
| 5    | Waits for processing                          | Backend processes all images                          |
| 6    | Views the batch summary                       | Total, succeeded, failed, success rate displayed      |
| 7    | Clicks individual results                     | Per-image area and processed image shown              |
| 8    | (Optional) Clicks "Export PDF"                | PDF with results is generated and downloaded          |
| 9    | (Optional) Creates a new batch                | Fresh batch; previous batch retained for switching    |

**Postconditions**: The user has batch results with area values for all successfully processed images.

---

## 8. Acceptance Criteria

The following criteria must be met for the system to be considered acceptable from a user perspective:

| ID    | Criterion                                                                                       | Linked URs         |
|-------|-------------------------------------------------------------------------------------------------|--------------------|
| AC-01 | A user can search for a location, draw a selection, and receive an area measurement.            | UR-05 to UR-08     |
| AC-02 | The measurement result includes the area in acres and a boundary visualization.                  | UR-08, UR-09       |
| AC-03 | Multiple measurements can be taken and reviewed in the sidebar without page reload.              | UR-10, UR-22       |
| AC-04 | Bulk upload processes all submitted images and shows per-image results.                          | UR-12 to UR-15     |
| AC-05 | Batch results can be exported as a PDF.                                                         | UR-17              |
| AC-06 | The application works without login or account creation.                                        | UR-02              |
| AC-07 | Error states (backend down, API failure) are communicated clearly to the user.                   | UB-07              |
| AC-08 | The primary measurement workflow requires no more than 4 intentional user actions after landing.  | UB-01              |
| AC-09 | The application loads and renders correctly on Chrome, Firefox, Edge, and Safari.                | OP-08              |
| AC-10 | Area computation results are returned within 30 seconds under normal conditions.                 | OP-03              |
