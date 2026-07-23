"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ChartDatum {
  category: string;
  items: number;
}

/**
 * Recharts is the one exception to "no UI library" — it renders SVG
 * charts, not styled UI components, so it doesn't conflict with the
 * Tailwind-only constraint. Colors are passed as literal hex (Recharts
 * doesn't read Tailwind's config) matching the accent-600 green.
 */
export function CategoryDistributionChart({ data }: { data: ChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 12, fill: "#71717a" }}
          axisLine={{ stroke: "#e4e4e7" }}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "#71717a" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#f4f4f5" }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e4e4e7",
            fontSize: 13,
            boxShadow: "0 4px 16px -2px rgb(0 0 0 / 0.08)",
          }}
        />
        <Bar dataKey="items" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
