"use client";
import { Button } from "@/components/ui/button";
import { CircleCheck, FileText, Upload } from "lucide-react";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { API_ENDPOINTS } from "@/lib/constants";
import { analyzeResume } from "@/actions/analyze-resume";
import ResumeAnalysis from "./ResumeAnalysis";

const fileTypes = ["pdf"];

export default function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadingError, setUploadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [resumeText, setResumeText] = useState(null);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);

  const handleChange = async (file: File) => {
    setFile(file);
    setUploadingError(null);
    setAnalysis(null);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(API_ENDPOINTS.PDF_READER, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setResumeText(data.extracted_text);
  };

  const handleReview = async () => {
    try {
      setIsLoading(true);
      setUploadingError(null);

      // Analyze the extracted text
      const analysisResult = await analyzeResume(resumeText);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error("Error processing PDF:", error);
      setUploadingError("Error processing PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full mx-auto">
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
      </div>
      {file && (

        <Button
          className="w-full mt-4 rounded"
          onClick={handleReview}
          disabled={isLoading}
        >
          <FileText className="w-4 h-4 mr-2" />
          {isLoading ? "Analyzing..." : "Review Resume"}
        </Button>


      )}
      {uploadingError && (
        <p className="text-red-500 text-center mt-4">{uploadingError}</p>
      )}

      {analysis && <ResumeAnalysis analysis={analysis} />}
    </div>
  );
}
