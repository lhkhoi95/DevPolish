interface AnalysisData {
  [key: string]: AnalysisSection;
}
interface AnalysisSection {
  score: number;
  feedback: string;
  examples: string[];
}
