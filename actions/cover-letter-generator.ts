"use server";

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const today = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert cover letter generator. Your task is to generate one page cover letter for the given job description and resume text. If the job description does not have enough information, use the resume text to generate the cover letter.",
        },
        {
          role: "user",
          content:
            "Do not make up any information. All information should be from the resume and job description.",
        },
        {
          role: "user",
          content: `The cover letter should have 3 paragraphs: Introduction, Experience, and Closing. For the Introduction, highlight the user GPA if it is above 3.5.`,
        },
        {
          role: "user",
          content: `Generate a cover letter for the following job description and resume text. Start with:
          
          user's name \n
          email \n
          phone number \n
          ${today}\n
                   
          company name \n
          company address \n

          Return the cover letter in the following JSON format: 
          { 
            "coverLetter": "Here is the cover letter"
          }
            
          Here's the job description:

          ${jobDescription}

          Here's the resume text to analyze:

          ${resumeText}`,
        },
      ],
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    let analysis;
    try {
      analysis = JSON.parse(response.choices[0].message.content || "");
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Error parsing Cover Letter JSON response", {
        cause: parseError,
      });
    }

    const coverLetter = analysis.coverLetter;
    return coverLetter;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error generating cover letter: " + error.message);
      throw new Error("Failed to generate cover letter: " + error.message);
    } else {
      console.log("Unknown error generating cover letter");
      throw new Error(
        "Failed to generate cover letter due to an unknown error"
      );
    }
  }
}
