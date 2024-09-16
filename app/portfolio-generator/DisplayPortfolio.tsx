import { Button } from "@/components/ui/button";
import { Download, Edit, Eye } from "lucide-react";
import { useState } from "react";

export default function DisplayPortfolio({ portfolioHTML }: { portfolioHTML: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [html, setHtml] = useState(portfolioHTML);

    const handleDownload = () => {
        if (!portfolioHTML) return;

        const blob = new Blob([portfolioHTML], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "portfolio.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleHTMLChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setHtml(e.target.value);
    };


    return (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-2xl font-bold">
                    Generated Portfolio {isEditing ? "Editor" : "Preview"}
                </h2>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="secondary"
                        className="rounded"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? (
                            <>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </>
                        ) : (
                            <>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit HTML
                            </>
                        )}
                    </Button>
                    <Button onClick={handleDownload} className="rounded">
                        <Download className="w-4 h-4 mr-2" />
                        Download HTML
                    </Button>
                </div>
            </div>
            <div className="border rounded-lg p-4 bg-white">
                {isEditing ? (
                    <textarea
                        value={html}
                        onChange={handleHTMLChange}
                        className="w-full h-[600px] font-mono text-sm"
                    />
                ) : (
                    <iframe
                        srcDoc={html}
                        title="Generated Portfolio"
                        className="w-full h-[600px] border-none"
                        sandbox="allow-scripts"
                    />
                )}
            </div>
        </div>
    )

}