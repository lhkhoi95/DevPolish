"use client"
import { useState } from "react";
import ResumeUploader from "../../components/ResumeUploader";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness } from "lucide-react";
import { generatePortfolio } from "@/actions/portfolio-generator";
import DisplayPortfolio from "./DisplayPortfolio";

export default function PortfolioGenerator() {
    const [resumeText, setResumeText] = useState<string | null>(null);
    const [portfolioHTML, setPortfolioHTML] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    const handleGeneratePortfolio = async () => {
        setError(null);
        setPortfolioHTML(null);
        setIsLoading(true);
        try {
            if (resumeText === null) {
                setError("Resume text is null");
                return;
            }
            const generatedHTML = await generatePortfolio(resumeText);
            setPortfolioHTML(generatedHTML);
            console.log("Portfolio HTML:", generatedHTML);
        } catch (error) {
            console.error("Error generating portfolio:", error);
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <>
            <ResumeUploader onResumeTextChange={setResumeText} />
            {resumeText && <Button
                className="w-full mt-4 rounded"
                onClick={handleGeneratePortfolio}
                disabled={isLoading}
            >
                <BriefcaseBusiness className="w-4 h-4 mr-2" />
                {isLoading ? "Generating..." : "Generate Portfolio"}
            </Button>}
            {portfolioHTML && <DisplayPortfolio portfolioHTML={portfolioHTML} />}
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </>
    );
}