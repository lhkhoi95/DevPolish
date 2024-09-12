"use client";
import { CircleCheck, Upload } from "lucide-react";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { API_ENDPOINTS } from "@/lib/constants";


const fileTypes = ["pdf"];

interface ResumeUploaderProps {
  onResumeTextChange: (text: string | null) => void;
}

export default function ResumeUploader({ onResumeTextChange }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadingError, setUploadingError] = useState<string | null>(null);

  const handleChange = async (file: File) => {
    setFile(null);
    setUploadingError(null);
    onResumeTextChange(null);

    // Check file size
    const maxSizeInBytes = 8 * 1024 * 1024; // 8 MB
    if (file.size > maxSizeInBytes) {
      setUploadingError("File size exceeds 8 MB limit");
      return;
    }

    setFile(file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(API_ENDPOINTS.PDF_READER, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      onResumeTextChange(data.text);
    } catch (error) {
      console.error("Error calling PDF2TEXT API:", error);
      setUploadingError("Error processing PDF");
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <FileUploader
        handleChange={handleChange}
        name="resume"
        types={fileTypes}
        multiple={false}
        onTypeError={(error: string) => {
          setFile(null);
          setUploadingError(error);
        }}
      >
        <div className="w-full p-6 border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors duration-300 cursor-pointer">
          {file ? (
            <>
              <CircleCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 text-center truncate">
                {file.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 text-center">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 text-center">
                Upload your resume
              </h3>
              <p className="text-sm text-gray-500 mt-1 text-center">
                Drag and drop or click to select a PDF file
              </p>
            </>
          )}
        </div>
      </FileUploader>
      {uploadingError && (
        <p className="text-red-500 text-center mt-4">{uploadingError}</p>
      )}
    </div>
  );
}
