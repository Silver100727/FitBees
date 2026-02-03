import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const data = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 198 },
  { name: 'Mar', revenue: 5000, orders: 320 },
  { name: 'Apr', revenue: 4500, orders: 278 },
  { name: 'May', revenue: 6000, orders: 389 },
  { name: 'Jun', revenue: 5500, orders: 349 },
  { name: 'Jul', revenue: 7000, orders: 420 },
  { name: 'Aug', revenue: 6500, orders: 398 },
  { name: 'Sep', revenue: 8000, orders: 489 },
  { name: 'Oct', revenue: 7500, orders: 456 },
  { name: 'Nov', revenue: 9000, orders: 534 },
  { name: 'Dec', revenue: 8500, orders: 510 },
];

const filters = ['1W', '1M', '3M', '1Y', 'All'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-elevated px-4 py-3 shadow-lg">
        <p className="mb-2 font-semibold text-text-primary">
          {label}
        </p>
        <p className="text-sm text-accent">
          Revenue: ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-sm text-text-tertiary">
          Orders: {payload[1]?.value || 0}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const [activeFilter, setActiveFilter] = useState('1Y');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Card className="hover:translate-y-0 hover:shadow-none">
        <CardHeader className="flex-row items-center justify-between pb-4">
          <CardTitle>Revenue Overview</CardTitle>
          <div className="flex gap-1">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "h-7 px-3 text-xs",
                  activeFilter === filter && "bg-accent-glow text-accent border border-accent"
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6e6e73', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6e6e73', fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d4af37"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="transparent"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
