"use client";
import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import { CircleCheck, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { API_ENDPOINTS } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";

const fileTypes = ["pdf"];

interface ResumeUploaderProps {
  onResumeTextChange: (text: string | null) => void;
}

export default function ResumeUploader({ onResumeTextChange }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadingError, setUploadingError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      const timer = setTimeout(() => setProgress(prev => Math.min(prev + 10, 100)), 200);
      return () => clearTimeout(timer);
    }

    if (progress === 100) {
      onResumeTextChange(resumeText);
    }
  }, [progress, resumeText, onResumeTextChange]);

  const handleChange = async (file: File) => {
    setFile(null);
    setUploadingError(null);
    onResumeTextChange(null);
    setProgress(0);

    // Check file size
    const maxSizeInBytes = 8 * 1024 * 1024; // 8 MB
    if (file.size > maxSizeInBytes) {
      setUploadingError("File size exceeds 8 MB limit");
      return;
    }

    setFile(file);
    setProgress(10); // Start progress

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

      setProgress(50); // Update progress

      const data = await res.json();
      setResumeText(data.text);

      // Store the extracted text to database
      if (user?.username) {
        const response = await fetch(API_ENDPOINTS.ADD_OR_UPDATE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            githubUsername: user.username,
            resumeText: data.text,
          }),
        });

        await response.json();
      }

      setProgress(100); // Complete progress

    } catch (error) {
      console.error("Error calling PDF2TEXT API:", error);
      setUploadingError("Error processing PDF");
      setProgress(0); // Reset progress on error
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
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
      {progress > 0 && progress < 100 && (
        <div className="w-full">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 mt-1 text-center">{progress}% uploaded</p>
        </div>
      )}
      {uploadingError && (
        <p className="text-red-500 text-center mt-4">{uploadingError}</p>
      )}
    </div>
  );
}