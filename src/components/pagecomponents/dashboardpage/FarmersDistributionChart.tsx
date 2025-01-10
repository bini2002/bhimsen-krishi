// src/components/pagecomponents/dashboardpage/FarmersDistributionChart.tsx
import useFetchData from "@/hook/useFetchData";
import { Spin } from "antd/lib";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const FarmersDistributionChart: React.FC = () => {
  const { fetchedData, loading } = useFetchData("/farmers-distribution-map");

  // Prepare the chart data only if the data is available
  const farmersData =
    fetchedData?.data.map((item: { ward: number; total: string }) => ({
      ward: `वडा ${item.ward}`,
      noOfFarmers: parseInt(item.total, 10), // Ensure total is treated as a number
    })) || [];

  const data = {
    labels: farmersData.map((item: any) => item.ward),
    datasets: [
      {
        data: farmersData.map((item: any) => item.noOfFarmers),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  if (loading) return <Spin />;

  return (
    <div className="p-4 bg-white border rounded">
      <h1 className="lg:text-lg mb-4 font-medium">किसान वितरण नक्सा</h1>
      <div style={{ width: "99%" }}>
        <Pie data={data} options={options} className="lg:max-h-96" />
      </div>
    </div>
  );
};

export default FarmersDistributionChart;
