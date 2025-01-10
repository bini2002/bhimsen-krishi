import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Spin } from "antd/lib";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Utility function to convert numbers to Nepali numerals
const convertToNepaliNumbers = (num: number): string => {
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return num
    .toString()
    .split("")
    .map((digit) => nepaliDigits[parseInt(digit)])
    .join("");
};

const MajorCropsProductionChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firstYear, setFirstYear] = useState<number>(2023);
  const [secondYear, setSecondYear] = useState<number>(2024);

  const fetchData = async (firstDate: number, secondDate: number) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin-marketplace/main-crop-production-comparison-chart`,
        {
          firstDate: firstDate,
          secondDate: secondDate,
        }
      );

      const fetchedData = response.data;

      if (fetchedData && fetchedData.data) {
        const labels = fetchedData.data.map((crop: any) => crop.name);
        const yearOneData = fetchedData.data.map(
          (crop: any) => crop.yearOneProduction
        );
        const yearTwoData = fetchedData.data.map(
          (crop: any) => crop.yearTwoProduction
        );

        const data = {
          labels: labels,
          datasets: [
            {
              label: `औसत उपज ${convertToNepaliNumbers(
                firstDate
              )}-${convertToNepaliNumbers(firstDate + 1)}`,
              data: yearOneData,
              backgroundColor: "#23a462",
              borderColor: "#23a462",
              borderWidth: 1,
              barThickness: 20,
            },
            {
              label: `औसत उपज ${convertToNepaliNumbers(
                secondDate
              )}-${convertToNepaliNumbers(secondDate + 1)}`,
              data: yearTwoData,
              backgroundColor: "#6d4c41",
              borderColor: "#6d4c41",
              borderWidth: 1,
              barThickness: 20,
            },
          ],
        };
        setChartData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(firstYear, secondYear);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchData(firstYear, secondYear);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${convertToNepaliNumbers(
              context.raw
            )} टन/हेक्टर`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "बालीहरू",
        },
        barPercentage: 0.8,
      },
      y: {
        title: {
          display: true,
          text: "औसत उपज (टन/हेक्टर)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded p-4 border">
      <div className="flex md:flex-row flex-col justify-between">
        <h2 className="text-lg font-medium mb-4">प्रमुख बाली उत्पादन तुलना</h2>

        {/* Year Selection Form */}
        <form onSubmit={handleFormSubmit} className="mb-4">
          <div className="flex space-x-4">
            <div className="flex md:flex-row flex-col items-center space-x-2">
              <label className="block font-medium mb-1 text-nowrap">
                पहिलो वर्ष
              </label>
              <input
                type="number"
                value={firstYear}
                onChange={(e) => setFirstYear(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full"
                min="2000"
                max={new Date().getFullYear()}
                required
              />
            </div>
            <div className="flex md:flex-row flex-col items-center space-x-2">
              <label className="block font-medium mb-1 text-nowrap">
                दोस्रो वर्ष
              </label>
              <input
                type="number"
                value={secondYear}
                onChange={(e) => setSecondYear(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full"
                min="2000"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              तुलना गर्नुहोस्
            </button>
          </div>
        </form>
      </div>

      {/* Chart */}
      <div style={{ width: "99%" }}>
        {loading ? (
          <p>
            <Spin />
          </p>
        ) : chartData ? (
          <Bar data={chartData} options={options} className="h-auto lg:h-96" />
        ) : (
          <p>कुनै डाटा उपलब्ध छैन</p>
        )}
      </div>
    </div>
  );
};

export default MajorCropsProductionChart;
