import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ResultsChartProps {
  homeWins: number;
  draws: number;
  awayWins: number;
}

// Convert to forwardRef to enable chart export
// Add memoization to improve performance
export const ResultsChart = React.memo(React.forwardRef<any, ResultsChartProps>(({ homeWins, draws, awayWins }, ref) => {
  // Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => [
    { name: 'Hazai győzelem', value: homeWins, color: '#10b981' },
    { name: 'Döntetlen', value: draws, color: '#f59e0b' },
    { name: 'Vendég győzelem', value: awayWins, color: '#0ea5e9' },
  ], [homeWins, draws, awayWins]);

  const total = homeWins + draws + awayWins;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0c0f16] p-2 rounded-md border border-white/10 shadow-lg">
          <p className="text-xs font-medium text-white">{`${payload[0].name}: ${payload[0].value} (${((payload[0].value / total) * 100).toFixed(1)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%" ref={ref}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          formatter={(value, entry, index) => (
            <span className="text-xs text-zinc-300">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}));

ResultsChart.displayName = 'ResultsChart';