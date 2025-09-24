# Chart Components

## ResultsChart

A pie chart component that visualizes the distribution of match results (home wins, draws, away wins).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `homeWins` | `number` | (required) | Number of home team wins |
| `draws` | `number` | (required) | Number of draws |
| `awayWins` | `number` | (required) | Number of away team wins |
| `colors` | `{ home?: string; draw?: string; away?: string }` | `{ home: '#10b981', draw: '#f59e0b', away: '#0ea5e9' }` | Custom colors for chart segments |
| `animationDuration` | `number` | `1000` | Duration of the animation in milliseconds |
| `labels` | `{ home?: string; draw?: string; away?: string }` | `{ home: 'Hazai győzelem', draw: 'Döntetlen', away: 'Vendég győzelem' }` | Custom labels for chart segments |
| `emptyMessage` | `ReactNode` | `"Nincs elegendő adat"` | Custom message to display when no data is available |

### Usage

```tsx
import { ResultsChart } from './components/charts/results-chart';

// Basic usage
<ResultsChart 
  homeWins={25} 
  draws={10} 
  awayWins={15} 
/>

// With customization
<ResultsChart 
  homeWins={25} 
  draws={10} 
  awayWins={15} 
  colors={{ 
    home: "#4f46e5", 
    draw: "#94a3b8", 
    away: "#ef4444" 
  }}
  labels={{
    home: "Home Wins",
    draw: "Draws",
    away: "Away Wins"
  }}
  animationDuration={800}
  emptyMessage="No match data available"
/>

// With ref for exporting
const chartRef = useRef(null);
<ResultsChart 
  ref={chartRef}
  homeWins={25} 
  draws={10} 
  awayWins={15} 
/>
```

### Notes

- All input values should be non-negative numbers (negative values will be converted to 0)
- The component handles edge cases like zero values gracefully
- The chart is wrapped in `React.memo` for performance optimization
- The component is fully typed with TypeScript for better developer experience
- Custom colors can be provided for each segment individually