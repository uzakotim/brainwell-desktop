import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

export function RegionBarChart({ data }: { data: any[] }) {
  return (
    <ChartContainer
        className="w-full h-full min-h-0"
        config={{
            value: { label: "Score", color: "hsl(var(--chart-1))" }
        }}
        >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="label"
            tickMargin={10}
          />

          <YAxis
            allowDecimals={false}
            domain={[0, 10]}
            tickCount={6}
          />

          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar
            dataKey="value"
            barSize={48}
            radius={6}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.value >= 7
                    ? "#ef4444"
                    : entry.value >= 4
                    ? "#facc15"
                    : "#22c55e"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}