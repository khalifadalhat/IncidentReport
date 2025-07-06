import React from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: "up" | "down";
  trendValue: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div
        className={`px-5 py-3 ${trend === "up" ? "bg-green-50" : "bg-red-50"}`}
      >
        <div className="text-sm">
          <div
            className={`flex items-center ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <FiArrowUp className="mr-1" />
            ) : (
              <FiArrowDown className="mr-1" />
            )}
            <span>{trendValue} from last week</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
