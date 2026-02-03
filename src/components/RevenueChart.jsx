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
      <div style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <p style={{
          color: 'var(--color-text-primary)',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          {label}
        </p>
        <p style={{ color: 'var(--color-accent)', fontSize: '0.875rem' }}>
          Revenue: ${payload[0].value.toLocaleString()}
        </p>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
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
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="chart-header">
        <h3 className="chart-title">Revenue Overview</h3>
        <div className="chart-actions">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`chart-filter ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-container">
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
    </motion.div>
  );
}
