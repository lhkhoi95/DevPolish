import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ResumeAnalysisChart from "./ResumeAnalysisChart";



interface ResumeAnalysisProps {
  analysis: AnalysisData;
}

export default function ResumeAnalysis({ analysis }: ResumeAnalysisProps) {
  return (
    <Card className="w-full my-8">
      <CardContent>
        <ResumeAnalysisChart analysis={analysis} />
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(analysis).map(
            ([section, { score, feedback, examples }], index) => (
              <AccordionItem key={section} value={`item-${index}`}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full">
                    <span>{section}</span>
                    <span className="text-sm">Score: {score}/10</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm mt-1 leading-relaxed">{feedback}</p>
                  {examples && examples.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold">
                        Examples for Improvement:
                      </h4>
                      <ul className="list-disc list-inside text-sm">
                        {examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
