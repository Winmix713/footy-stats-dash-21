
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Target, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: number;
  progress?: number;
  type?: 'default' | 'goals' | 'wins' | 'performance';
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  change, 
  progress, 
  type = 'default',
  className 
}: StatsCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'goals':
        return <Target className="w-5 h-5 text-goal" />;
      case 'wins':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'performance':
        return <Activity className="w-5 h-5 text-primary" />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getIcon()}
          {title}
        </CardTitle>
        {change !== undefined && (
          <Badge variant={change > 0 ? 'default' : change < 0 ? 'destructive' : 'secondary'} className="gap-1">
            {getTrendIcon()}
            {Math.abs(change)}%
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
        )}
        {progress !== undefined && (
          <Progress value={progress} className="h-2" />
        )}
      </CardContent>
    </Card>
  );
};
