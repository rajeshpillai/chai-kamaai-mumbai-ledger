
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, color }: StatsCardProps) => {
  const isPositive = trend.startsWith('+');
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm font-medium mt-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend} from last month
          </p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
