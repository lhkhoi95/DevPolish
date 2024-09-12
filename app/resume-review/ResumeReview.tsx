"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { analyzeResume } from "@/actions/analyze-resume";
import ResumeAnalysis from "./ResumeAnalysis";
import ResumeUploader from "./ResumeUploader";

export default function ResumeReview() {
    const [uploadingError, setUploadingError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [resumeText, setResumeText] = useState<string | null>(null);

    const handleResumeTextChange = (text: string | null) => {
        setResumeText(text);
        setAnalysis(null);
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
            <ResumeUploader onResumeTextChange={handleResumeTextChange} />
            {resumeText && (
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
