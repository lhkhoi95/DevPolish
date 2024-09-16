interface AnalysisData {
  [key: string]: AnalysisSection;
}
interface AnalysisSection {
  score: number;
  feedback: string;
  examples: string[];
}

interface UserData {
  _id?: ObjectId;
  githubUsername: string;
  name: string;
  resumeText?: string;
}
