"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const ResumeAnalysisChart = ({ analysis }: { analysis: Record<string, { score: number }> }) => {
  const chartData = Object.entries(analysis).map(([key, value]) => ({
    subject: key,
    score: value.score,
  }));

  const chartConfig = {
    score: {
      label: "Resume Score",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  return (
    <Card className="border-none">
      <CardHeader className="items-center">
        <CardTitle>Resume Analysis</CardTitle>
        <CardDescription>
          Showing scores for different aspects of your resume
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="subject" />
            <PolarGrid />
            <Radar
              dataKey="score"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Overall score: {(Object.values(analysis).reduce((sum, { score }) => sum + score, 0) / Object.keys(analysis).length).toFixed(2)}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default ResumeAnalysisChart;
