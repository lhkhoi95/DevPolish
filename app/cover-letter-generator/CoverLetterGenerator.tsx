"use client";
import ResumeUploader from "../resume-review/ResumeUploader";
import { useState } from "react";
import JobDescriptionGetter from "./JobDescriptionGetter";
import { Button } from "@/components/ui/button";
import { generateCoverLetter } from "@/actions/cover-letter-generator";
import DisplayCoverLetter from "./DisplayCoverLetter";

export default function CoverLetterGenerator() {
    const [resumeText, setResumeText] = useState<string | null>(null);
    const [jobDescription, setJobDescription] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getCoverLetter = async () => {
        setIsGenerating(true);
        setCoverLetter(null);
        if (resumeText && jobDescription) {
            const coverLetterText = await generateCoverLetter(resumeText, jobDescription);

            if (coverLetterText) {
                setCoverLetter(coverLetterText);
            }
        } else {
            setError('Resume text or job description is missing');
        }
        setIsGenerating(false);
        setIsOpen(false);
    }


    return <>
        <ResumeUploader onResumeTextChange={setResumeText} />
        <JobDescriptionGetter
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            setJobDescription={setJobDescription}
            jobDescription={jobDescription}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            onSubmit={getCoverLetter}
        />
        {resumeText && <Button className="mt-4 w-full rounded" onClick={() => setIsOpen(true)}>Generate Cover Letter</Button>}
        {coverLetter && <DisplayCoverLetter coverLetterText={coverLetter} />}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
    </>
}