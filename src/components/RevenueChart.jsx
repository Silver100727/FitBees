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
import { Card, CardHeader, CardTitle, CardContent, Button, Skeleton } from '@/components/ui';
import { useRevenueData } from '@/hooks/useQueries';
import { cn } from '@/lib/utils';

const filters = ['1W', '1M', '3M', '1Y', 'All'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg px-4 py-3 shadow-lg"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)'
        }}
      >
        <p className="mb-2 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </p>
        <p className="text-sm" style={{ color: 'var(--color-accent)' }}>
          Revenue: ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Orders: {payload[1]?.value || 0}
        </p>
      </div>
    );
  }
  return null;
};

function ChartSkeleton() {
  return (
    <div className="h-[300px] flex flex-col justify-end gap-2 p-4">
      <div className="flex items-end gap-2 h-full">
        {[40, 60, 45, 80, 55, 70, 90, 65, 85, 75, 95, 88].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
          <Skeleton key={m} className="h-3 w-6" />
        ))}
      </div>
    </div>
  );
}

export default function RevenueChart() {
  const [activeFilter, setActiveFilter] = useState('1Y');
  const { data, isLoading, error } = useRevenueData(activeFilter);

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
                className={cn("h-7 px-3 text-xs")}
                style={activeFilter === filter ? {
                  background: 'var(--color-accent-glow)',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--color-accent)'
                } : {}}
              >
                {filter}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ChartSkeleton />
          ) : error ? (
            <div className="h-[300px] flex items-center justify-center" style={{ color: 'var(--color-text-tertiary)' }}>
              Failed to load chart data
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
