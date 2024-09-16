import { NextRequest, NextResponse } from "next/server";

interface ContributionDay {
  date: string;
  count: number;
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://github.com/users/${username}/contributions`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch contributions");
    }

    const htmlContent = await response.text();

    // Parse the HTML content to extract contribution data
    const contributionData = parseContributionData(htmlContent);

    return NextResponse.json(contributionData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub contributions" },
      { status: 500 }
    );
  }
}

function parseContributionData(html: string): ContributionDay[][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const squares = doc.querySelectorAll("td.ContributionCalendar-day");

  const contributionData: ContributionDay[] = [];

  squares.forEach((square) => {
    const date = square.getAttribute("data-date");
    const count = parseInt(square.getAttribute("data-count") || "0", 10);

    if (date) {
      contributionData.push({ date, count });
    }
  });

  // Group contributions into weeks
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < contributionData.length; i += 7) {
    weeks.push(contributionData.slice(i, i + 7));
  }

  return weeks;
}
