"use server";

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePortfolio(resumeText: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert portfolio generator. Your task is to generate a HTML portfolio for the given resume text.",
        },
        {
          role: "user",
          content:
            "You must use internal CSS. Do not use inline or external CSS.",
        },
        {
          role: "user",
          content: `Create a professional HTML portfolio based on the provided resume text. Follow these guidelines:

1. Structure:
   - Use semantic HTML5 tags (header, nav, main, section, footer, etc.)
   - Include a responsive navigation menu
   - Create sections for: About, Experience, Education, Skills, and Projects

2. Content:
   - Extract and organize information from the resume text
   - Write a brief, engaging summary for the About section
   - List experiences, education, and projects in reverse chronological order
   - Create a skills section with a visually appealing layout (e.g., tags or progress bars)

3. Design:
   - Use a clean, modern design with a professional color scheme
   - Do not use blue color.
   - Ensure the layout is responsive and works well on mobile devices
   - Include appropriate white space for readability
   - Use CSS Flexbox or Grid for layout

4. Interactivity:
   - Add subtle hover effects on interactive elements
   - Include smooth scrolling to sections when navigation links are clicked

5. Additional features:
   - Add a contact form or contact information section
   - Include social media links if available in the resume
   - Optimize for accessibility (proper alt texts, ARIA labels, etc.)

Here's the resume text to base the portfolio on:
${resumeText}

Return the JSON object following this format: {"portfolio": "the portfolio content"}`,
        },
      ],
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    let result;
    try {
      result = JSON.parse(response.choices[0].message.content || "");
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Error parsing Portfolio JSON response", {
        cause: parseError,
      });
    }

    const portfolio = result.portfolio;
    return portfolio;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error generating portfolio: " + error.message);
      throw new Error("Failed to generate portfolio: " + error.message);
    } else {
      console.log("Unknown error generating portfolio");
      throw new Error("Failed to generate portfolio due to an unknown error");
    }
  }
}
