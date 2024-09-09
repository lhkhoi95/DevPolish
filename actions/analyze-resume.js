"use server";

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeResume(extractedText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume analyzer. Your task is to analyze the given resume text and provide scores, feedback, and real examples for improvement for each section in JSON format.",
        },
        {
          role: "user",
          content: `Analyze the following resume text and provide scores (out of 10), brief feedback, and real examples for improvement for each of these sections: Contact Information, Professional Summary, Work Experience, Education, Skills, and Overall Impression. If a section is missing, mention that in the feedback. Return the analysis in the following JSON format:

{
  "Contact Information": {
    "score": integer,
    "feedback": string,
    "examples": [string]
  },
  "Professional Summary": {
    "score": integer,
    "feedback": string,
    "examples": [string]
  },
  "Work Experience": {
    "score": integer,
    "feedback": string,
    "examples": [string]
  },
  "Education": {
    "score": integer,
    "feedback": string,
    "examples": [string]
  },
  "Skills": {
    "score": integer,
    "feedback": string,
    "examples": [string]
  },
  "Overall Impression": {
    "score": integer,
    "feedback": string,
    "examples": [string]
  }
}

Here's the resume text to analyze:

${extractedText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    let analysis;
    try {
      analysis = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Failed to parse the analysis result");
    }

    const sections = [
      "Contact Information",
      "Professional Summary",
      "Work Experience",
      "Education",
      "Skills",
      "Overall Impression",
    ];

    sections.forEach((section) => {
      if (!analysis[section]) {
        analysis[section] = {
          score: 0,
          feedback: "Section not found or could not be analyzed.",
          examples: ["Add this section to your resume."],
        };
      }
    });

    return analysis;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume: " + error.message);
  }
}
