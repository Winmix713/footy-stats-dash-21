import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BTTSChartProps {
  bttsCount: number;
  nonBttsCount: number;
}

// Convert to forwardRef to enable chart export
export const BTTSChart = React.forwardRef<any, BTTSChartProps>(({ bttsCount, nonBttsCount }, ref) => {
  const data = [
    { name: 'Igen', value: bttsCount, color: '#8b5cf6' },
    { name: 'Nem', value: nonBttsCount, color: '#6b7280' },
  ];

  const total = bttsCount + nonBttsCount;
  
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
});

BTTSChart.displayName = 'BTTSChart';