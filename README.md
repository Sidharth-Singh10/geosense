# GeoSense

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Implementation](#technical-implementation)
- [Technical Dependencies](#technical-dependencies)
- [Installation Process](#installation-process)
  - [1. Repository Setup](#1-repository-setup)
  - [2. Development Server](#2-development-server)
- [Project Structure](#project-structure)
- [Licensing](#licensing)

## Overview

GeoSense-Backend is an advanced machine learning system designed for precise land boundary detection. The system utilizes the Segment-Anything Model (SAM) architecture to achieve highly accurate boundary detection in geospatial data. Through integration with Roboflow for data annotation, the system provides comprehensive land segmentation capabilities with documented accuracy rates of 75-90%.

## Key Features

- **Interactive Maps**: Utilize dynamic maps to visualize geospatial data seamlessly.
- **Responsive Design**: Ensures optimal viewing across various devices with Tailwind CSS integration.
- **Fast Performance**: Built with Next.js for server-side rendering and efficient performance.
- **Google Maps API Integration**: Uses Google Maps API for advanced mapping capabilities.

## Technical Implementation

GeoSense leverages modern web technologies to deliver a robust geospatial analysis platform:

- **Frontend Framework**: Developed using Next.js, enabling server-side rendering and optimized performance.
- **Styling**: Tailwind CSS is employed for efficient and consistent styling across the application.
- **Mapping Integration**: Incorporates mapping libraries and Google Maps API to render interactive geospatial data visualizations.

## Technical Dependencies

The project relies on the following primary components:

- **Next.js**: React-based framework for server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Mapping Libraries**: Tools and libraries for embedding and interacting with maps.
- **Google Maps API**: Provides accurate geospatial data and mapping functionality.

## Installation Process

### 1. Repository Setup

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/Sidharth-Singh10/geosense.git
cd geosense
```

### 2. Development Server

Install the necessary dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

```
geosense/
├── app/
│   ├── page.js                # Main page component
│   └── ...                    # Other application components
├── public/                    # Public assets
├── styles/
│   ├── globals.css            # Global CSS file
│   └── ...                    # Other styling files
├── .gitignore                 # Git ignore file
├── README.md                  # Project documentation
├── next.config.js             # Next.js configuration
├── package.json               # Project metadata and dependencies
└── ...                        # Other configuration and source files
```

## Licensing

This project is licensed under the MIT License. For more details, refer to the [LICENSE](https://github.com/Sidharth-Singh10/geosense/blob/main/LICENSE) file in the repository.
