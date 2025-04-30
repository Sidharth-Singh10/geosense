"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileJson,
  Image as ImageIcon,
  X,
  Check,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Clipboard,
  // Add these imports for the results component
  BarChart,
  CheckCircle,
  Download,
  XCircle,
  ArrowUpRight,
  Percent,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

export default function BulkUploadPage() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [jsonFile, setJsonFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [processedResults, setProcessedResults] = useState([]);

  // Add batch management
  const [batches, setBatches] = useState({});
  const [activeBatch, setActiveBatch] = useState("default");

  const imageInputRef = useRef(null);
  const jsonInputRef = useRef(null);

  // Handle image files upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Filter for image files only
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      toast.warning("Some files were skipped because they weren't images");
    }

    // Create preview URLs for the images
    const newImages = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // Handle JSON file upload
  const handleJsonUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      toast.error("Please upload a valid JSON file");
      return;
    }

    // Validate JSON file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = JSON.parse(event.target.result);
        setJsonFile({
          file,
          name: file.name,
          size: file.size,
          content: jsonContent,
        });
        toast.success("JSON file validated successfully");
      } catch (error) {
        toast.error("Invalid JSON file format");
        setJsonFile(null);
      }
    };
    reader.readAsText(file);
  };

  // Remove an image from the list
  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview); // Clean up
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Remove the JSON file
  const removeJsonFile = () => {
    setJsonFile(null);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Handle form submission
  // Handle form submission
  // Update the handleSubmit function to properly set the processedResults
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!jsonFile) {
      toast.error("Please upload a JSON configuration file");
      return;
    }

    setIsUploading(true);

    // Save current batch state before processing
    if (activeBatch) {
      setBatches((prev) => ({
        ...prev,
        [activeBatch]: { images, jsonFile },
      }));
    }

    // Simulate progress for better UX
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 300);

    try {
      // Create FormData to send files and parameters
      const formData = new FormData();

      // Add all image files
      images.forEach((img) => {
        formData.append("files", img.file, img.name);
      });

      // Prepare parameters from the JSON file
      // We need to ensure each image has a corresponding parameter with matching ID
      let params;

      // If the JSON is already in the expected format with an array of parameters
      if (Array.isArray(jsonFile.content)) {
        params = jsonFile.content;
      } else {
        // Otherwise, create parameters for each image using the JSON config as a template
        params = images.map((img) => ({
          id: img.name,
          ...jsonFile.content, // Apply the JSON configuration to each image
        }));
      }

      // Add the params as a stringified JSON
      formData.append("params", JSON.stringify(params));

      // Send to backend
      const response = await fetch(
        "http://192.168.82.43:9000/bulk/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      console.log("Response:", result);

      clearInterval(interval);
      setUploadProgress(100);
      setUploadSuccess(true);

      // Store the results for the results page
      setProcessedResults(result.results);

      // Show results after a delay
      setTimeout(() => {
        setIsUploading(false);
        setShowResults(true);
      }, 1500);
    } catch (error) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error(`Upload failed: ${error.message}`);
      console.error("Upload error:", error);
    }
  };

  // Handle paste events for clipboard images
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        const imageName = `Pasted Image ${new Date().toLocaleTimeString()}.png`;
        const newImage = {
          file: new File([file], imageName, { type: file.type }),
          preview: URL.createObjectURL(file),
          name: imageName,
          size: file.size,
        };

        setImages((prev) => [...prev, newImage]);
        toast.success("Image pasted from clipboard");
      }
    }
  };

  // Add paste event listener on component mount
  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  // Create new batch
  const createNewBatch = () => {
    const batchName = prompt("Enter batch name:");
    if (!batchName) return;

    setBatches((prev) => ({
      ...prev,
      [batchName]: { images: [], jsonFile: null },
    }));
    setActiveBatch(batchName);
    setImages([]);
    setJsonFile(null);
    toast.success(`Created batch "${batchName}"`);
  };

  // Switch between batches
  const switchBatch = (batchName) => {
    // Save current batch state
    if (activeBatch) {
      setBatches((prev) => ({
        ...prev,
        [activeBatch]: { images, jsonFile },
      }));
    }

    // Load selected batch
    setActiveBatch(batchName);
    if (batches[batchName]) {
      setImages(batches[batchName].images || []);
      setJsonFile(batches[batchName].jsonFile || null);
    } else {
      setImages([]);
      setJsonFile(null);
    }
  };

  // Delete a batch
  const deleteBatch = (batchName) => {
    if (batchName === activeBatch) {
      setImages([]);
      setJsonFile(null);
      setActiveBatch("default");
    }

    setBatches((prev) => {
      const newBatches = { ...prev };
      delete newBatches[batchName];
      return newBatches;
    });

    toast.info(`Deleted batch "${batchName}"`);
  };

  // Reset the form and go back to upload view
  const handleBackToUpload = () => {
    setShowResults(false);
    setImages([]);
    setJsonFile(null);
    setUploadProgress(0);
    setUploadSuccess(false);
  };

  // Results component to be added to the BulkUploadPage component
  // Add this code to your BulkUploadPage.jsx file

  // First, add this to your imports at the top of the file:
  // import { BarChart, CheckCircle, Download, XCircle, ArrowUpRight, Percent } from "lucide-react";

  // Then add this function to display the results section:

  // Results component to be added to the BulkUploadPage component
  // Add this code to your BulkUploadPage.jsx file

  // First, add this to your imports at the top of the file:
  // import { BarChart, CheckCircle, Download, XCircle, ArrowUpRight, Percent } from "lucide-react";

  // Then add this function to display the results section:

  // Results component to be added to the BulkUploadPage component
  // Add this code to your BulkUploadPage.jsx file

  // First, add this to your imports at the top of the file:
  // import { Download } from "lucide-react";

  // Then add this function to display the results section:
  const ResultsSection = ({ results, onBackClick }) => {
    // Convert km² to acres (if needed)
    const sqKmToAcres = (sqKm) => {
      return sqKm * 247.105;
    };

    // Function to convert hex string to base64
    const hexToBase64 = (hexString) => {
      // First convert hex to binary array
      const bytes = new Uint8Array(
        hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );
      // Then convert to base64
      let binary = "";
      bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
      return btoa(binary);
    };

    // Function to download an image from its hex blob data
    const downloadImage = (imageBlob, filename) => {
      // Convert hex to base64 first
      const base64Data = hexToBase64(imageBlob);

      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: "image/png" });
      const url = URL.createObjectURL(blob);

      // Create download link and trigger click
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up
      URL.revokeObjectURL(url);
    };

    // Function to export all results as a PDF
    const exportAllResultsAsPDF = async (resultsData) => {
      try {
        // We'll need to dynamically import jsPDF
        const jspdfScript = document.createElement("script");
        jspdfScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        document.body.appendChild(jspdfScript);

        // Wait for the script to load
        await new Promise((resolve) => {
          jspdfScript.onload = resolve;
        });

        // Create new PDF document (A4 format)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - margin * 2;

        let yPosition = margin;

        // Add title
        doc.setFontSize(18);
        doc.text("Land Area Analysis Results", pageWidth / 2, yPosition, {
          align: "center",
        });
        yPosition += 15;

        // Only include successful results
        const successfulResults = resultsData.filter(
          (result) => result.success
        );

        // Process each result
        for (let i = 0; i < successfulResults.length; i++) {
          const result = successfulResults[i];

          // Check if we need a new page
          if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = margin;
          }

          // Add image name
          doc.setFontSize(14);
          doc.text(
            `Image ${i + 1}: ${result.filename || "Unnamed"}`,
            margin,
            yPosition
          );
          yPosition += 8;

          const acres_area = (result.area).toFixed(4);

          // Add area information
          if (result.area) {
            doc.setFontSize(12);
            doc.text(
              `Area: ${acres_area} acres`,
              margin,
              yPosition
            );
            yPosition += 8;
          }

          // Add image if available
          if (result.image_blob) {
            try {
              // Convert hex to base64
              const imgData = `data:image/png;base64,${hexToBase64(
                result.image_blob
              )}`;

              // Calculate image dimensions to fit on page
              const imgWidth = contentWidth;
              const imgHeight = 80; // Fixed height for consistency

              doc.addImage(
                imgData,
                "PNG",
                margin,
                yPosition,
                imgWidth,
                imgHeight
              );
              yPosition += imgHeight + 15; // Add space after image
            } catch (err) {
              console.error("Error adding image to PDF:", err);
              doc.text("[ Image could not be added ]", margin, yPosition);
              yPosition += 10;
            }
          }

          // Add separator between results (except for the last one)
          if (i < successfulResults.length - 1) {
            doc.setDrawColor(200);
            doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
            yPosition += 10;
          }
        }

        // Save the PDF
        doc.save("geosense_results.pdf");

        // Show success message
        toast.success("Results exported as PDF successfully");
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Failed to export results: " + error.message);
      }
    };

    // Calculate summary statistics
    const totalImages = results?.length || 0;
    const successfulResults =
      results?.filter((result) => result.success)?.length || 0;
    const failedResults = totalImages - successfulResults;
    const successRate =
      totalImages > 0 ? (successfulResults / totalImages) * 100 : 0;

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBackClick}
            className="flex items-center text-blue-400 hover:text-blue-300 transition mr-4"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Upload
          </button>
          <h1 className="text-2xl font-semibold">Processing Results</h1>
        </div>

        {/* Summary statistics */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <BarChart size={20} className="mr-2 text-blue-400" />
            Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-2xl font-bold">{totalImages}</div>
              <div className="text-sm text-gray-400 mt-1">Total Images</div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-2xl font-bold text-green-400">
                {successfulResults}
              </div>
              <div className="text-sm text-gray-400 mt-1">Successful</div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-2xl font-bold text-red-400">
                {failedResults}
              </div>
              <div className="text-sm text-gray-400 mt-1">Failed</div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4 flex flex-col items-center">
              <div className="text-2xl font-bold flex items-center">
                {successRate.toFixed(1)}
                <Percent size={16} className="ml-1" />
              </div>
              <div className="text-sm text-gray-400 mt-1">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Results list */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-medium mb-4">Detailed Results</h2>

          {results && results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? "bg-green-900/20 border-green-700/50"
                      : "bg-red-900/20 border-red-700/50"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3">
                      {result.success ? (
                        <CheckCircle size={20} className="text-green-400" />
                      ) : (
                        <XCircle size={20} className="text-red-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">
                          {result.filename || `Image ${index + 1}`}
                        </h3>

                        {result.success && result.outputImage && (
                          <button
                            onClick={() =>
                              downloadImage(
                                result.image_,
                                `processed_${
                                  result.filename || `image_${index + 1}`
                                }.png`
                              )
                            }
                            className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                          >
                            <Download size={16} className="mr-1" />
                            Download
                          </button>
                        )}
                      </div>

                      {/* Result details */}
                      {result.success ? (
                        <div className="mt-2 text-sm">
                          {result.area && (
                            <div className="text-gray-300">
                              Area:{" "}
                              <span className="text-white font-medium">
                                {result.area.toFixed(4)} acres
                              </span>
                            </div>
                          )}

                          {result.details && (
                            <div className="mt-1 text-gray-400 text-xs">
                              {result.details}
                            </div>
                          )}

                          {/* Preview image if available */}
                          {result.outputImage && (
                            <div className="mt-3 w-full">
                              <img
                                src={`data:image/png;base64,${hexToBase64(
                                  result.outputImage
                                )}`}
                                alt={`Result for ${
                                  result.filename || `image ${index + 1}`
                                }`}
                                className="max-h-48 rounded border border-gray-600"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 text-sm text-red-300">
                          {result.error || "Processing failed"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No results available
            </div>
          )}

          {/* Export all button */}
          {results && results.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => exportAllResultsAsPDF(results)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center transition"
              >
                <Download size={18} className="mr-2" />
                Export All Results as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {showResults ? (
        <ResultsSection
          results={processedResults}
          onBackClick={handleBackToUpload}
        />
      ) : (
        <>
          {/* Header */}
          <header className="py-4 px-6 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 hover:text-blue-400 transition"
              >
                <ArrowLeft size={18} />
                <span>Back to Map</span>
              </Link>
              <span className="mx-2 text-gray-500">|</span>
              <h1 className="text-xl font-semibold">Bulk Upload</h1>
            </div>
            <div className="flex items-center">
              <Link href="/">
                <Image
                  className="w-10 h-10 cursor-pointer"
                  src="/geosense_logo.png"
                  width={40}
                  height={40}
                  alt="geosense"
                />
              </Link>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Batch Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium">Processing Batches</h2>
                <button
                  onClick={createNewBatch}
                  className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition"
                >
                  New Batch
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => switchBatch("default")}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition ${
                    activeBatch === "default"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Default Batch
                </button>

                {Object.keys(batches).map((batchName) => (
                  <div key={batchName} className="relative group">
                    <button
                      onClick={() => switchBatch(batchName)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm transition ${
                        activeBatch === batchName
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {batchName}
                      {batches[batchName].images &&
                        batches[batchName].images.length > 0 && (
                          <span className="ml-2 bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {batches[batchName].images.length}
                          </span>
                        )}
                    </button>

                    {/* Delete batch button (visible on hover) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete batch "${batchName}"?`)) {
                          deleteBatch(batchName);
                        }
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image Upload Section */}
              <div className="flex-1">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <ImageIcon size={20} />
                    Upload Land Images
                  </h2>

                  <div
                    className={`border-2 border-dashed rounded-lg ${
                      images.length
                        ? "border-gray-600 bg-gray-800"
                        : "border-blue-500 bg-gray-800/50 hover:bg-gray-800/80"
                    } p-8 text-center cursor-pointer transition-all mb-4`}
                    onClick={() => imageInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-400">
                      Drag & drop images here or click to browse
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Supports: JPG, PNG, WEBP (Max 10MB each)
                    </p>
                    <div className="flex items-center justify-center mt-3 text-xs text-gray-400">
                      <Clipboard size={14} className="mr-1" />
                      <span>
                        You can also paste images from clipboard (Ctrl+V)
                      </span>
                    </div>
                  </div>

                  {/* Image Preview List */}
                  {images.length > 0 && (
                    <div className="mt-6">
                      <div className="text-sm text-gray-400 mb-2 flex justify-between">
                        <span>
                          {images.length} image{images.length !== 1 ? "s" : ""}{" "}
                          selected
                        </span>
                        <button
                          className="text-red-400 hover:text-red-300 text-xs"
                          onClick={() => {
                            images.forEach((img) =>
                              URL.revokeObjectURL(img.preview)
                            );
                            setImages([]);
                          }}
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
                        {images.map((img, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gray-700/50 rounded-lg p-2 group"
                          >
                            <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden mr-3 flex-shrink-0">
                              <img
                                src={img.preview}
                                alt={img.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {img.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatFileSize(img.size)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="ml-2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-600 opacity-70 group-hover:opacity-100 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* JSON Upload Section */}
              <div className="lg:w-1/3">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <FileJson size={20} />
                    Upload Configuration
                  </h2>

                  <div
                    className={`border-2 border-dashed rounded-lg ${
                      jsonFile
                        ? "border-gray-600 bg-gray-800"
                        : "border-blue-500 bg-gray-800/50 hover:bg-gray-800/80"
                    } p-6 text-center cursor-pointer transition-all`}
                    onClick={() => jsonInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={jsonInputRef}
                      onChange={handleJsonUpload}
                      accept=".json"
                      className="hidden"
                    />
                    {!jsonFile ? (
                      <>
                        <FileJson className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-400">
                          Upload JSON configuration file
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Supports: JSON only
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center bg-gray-700/50 rounded-lg p-2 mt-2">
                        <div className="w-10 h-10 bg-blue-900/30 rounded flex items-center justify-center mr-3 flex-shrink-0">
                          <FileJson className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium truncate">
                            {jsonFile.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(jsonFile.size)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeJsonFile();
                          }}
                          className="ml-2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center text-amber-400 mb-3">
                      <AlertTriangle size={18} className="mr-2" />
                      <h3 className="text-sm font-medium">
                        {jsonFile && jsonFile.content
                          ? "JSON Content Preview"
                          : "Expected JSON Format"}
                      </h3>
                    </div>

                    {jsonFile && jsonFile.content ? (
                      <div className="mb-4">
                        <pre className="bg-gray-900 p-2 rounded text-xs font-mono text-gray-300 overflow-x-auto max-h-40">
                          {JSON.stringify(jsonFile.content, null, 2).substring(
                            0,
                            500
                          )}
                          {JSON.stringify(jsonFile.content, null, 2).length >
                          500
                            ? "..."
                            : ""}
                        </pre>
                        <p className="text-xs text-gray-400 mt-1">
                          {Object.keys(jsonFile.content).length} root keys
                          {jsonFile.content.coordinates
                            ? `, ${jsonFile.content.coordinates.length} coordinates`
                            : ""}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-gray-300 mb-2">
                          The JSON file should contain configuration data in the
                          following format:
                        </p>
                        <pre className="bg-gray-900 p-2 rounded text-xs font-mono text-gray-300 overflow-x-auto">
                          {`{
    "scale": 0.5,
    "coordinates": [
      {"lat": 12.345, "lng": 67.890},
      ...
    ],
    "settings": {
      "resolution": "high",
      "format": "png"
    }
  }`}
                        </pre>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={isUploading || images.length === 0 || !jsonFile}
                    className={`w-full py-3 px-4 flex items-center justify-center rounded-lg font-medium transition-all
                        ${
                          isUploading || images.length === 0 || !jsonFile
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        {uploadSuccess ? "Processed!" : "Processing..."}
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="mr-2" />
                        Process Files
                      </>
                    )}
                  </button>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Processing Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            uploadSuccess ? "bg-green-500" : "bg-blue-500"
                          } transition-all duration-300`}
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      {uploadSuccess && (
                        <div className="flex items-center mt-2 text-green-400 text-sm">
                          <Check size={16} className="mr-1" />
                          All files processed successfully
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
