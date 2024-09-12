import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function JobDescriptionGetter({
  isOpen,
  onClose,
  jobDescription,
  setJobDescription,
  isGenerating,
  setIsGenerating,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  setJobDescription: (jobDescription: string | null) => void;
  jobDescription: string | null;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  onSubmit: () => void;
}) {

  const handleGenerate = () => {
    setJobDescription(jobDescription);
    setIsGenerating(true);
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Cover Letter</DialogTitle>
          <DialogDescription>
            Paste the job description here to generate a tailored cover letter
            for the job.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Paste job description here..."
            value={jobDescription || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
            rows={6}
          />
          <Button
            onClick={handleGenerate}
            disabled={!jobDescription?.trim() || isGenerating}
            className="rounded"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
