import React from "react";

interface StatusCardProps {
  title: string;
  status: string;
  description: string;
  isActive?: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  status,
  description,
  isActive = false,
}) => {
  return (
    <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${isActive ? "bg-orange-500" : "bg-green-500"} rounded-md p-3`}>
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isActive ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              )}
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{status}</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">{description}</div>
      </div>
    </div>
  );
};

export const ProjectStatusOverview: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Project Status</h2>
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            title="Week 1"
            status="Completed"
            description="Linux, Git & Docker Basics"
          />
          <StatusCard
            title="Week 2"
            status="Completed"
            description="CI/CD Pipeline Setup"
          />
          <StatusCard
            title="Week 3"
            status="Completed"
            description="Cloud Services & IaC"
          />
          <StatusCard
            title="Week 4"
            status="In Progress"
            description="Final Project Integration"
            isActive={true}
          />
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  percentage: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, percentage }) => {
  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
      <div className="mt-1 h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-orange-500 rounded"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export const ContainerMetrics: React.FC = () => {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Container Metrics:</h4>
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="CPU Usage" value="12.4%" percentage={12.4} />
          <MetricCard title="Memory Usage" value="234MB / 1GB" percentage={23.4} />
          <MetricCard title="Network I/O" value="2.4MB/s" percentage={24} />
        </div>
      </div>
    </div>
  );
};
