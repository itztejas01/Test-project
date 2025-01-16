"use client";
import { Button, ChartContainer } from "@/components";
import React from "react";
import { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#2FBBB3"];
const chartOptionData: { value: string; label: string }[] = [
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
  { value: "area", label: "Area" },
  { value: "pie", label: "Pie" },
];
const animatedComponents = makeAnimated();
const Multichart = () => {
  const [chartData, setChartData] = useState([
    { name: "Jan", value1: 400, value2: 240, value3: 120, value4: 76498 },
    { name: "Feb", value1: 300, value2: 139, value3: 221, value4: 46165 },
    { name: "Mar", value1: 500, value2: 980, value3: 229, value4: 72602 },
    { name: "Apr", value1: 200, value2: 390, value3: 100, value4: 31087 },
  ]);

  const [selectedCharts, setSelectedCharts] = useState<string[]>([
    "bar",
    "line",
    "area",
    "pie",
  ]); // Default selected charts

  // Render specific charts based on selection
  const renderChart = (type: string) => {
    switch (type) {
      case "bar":
        return (
          <BarChart width={400} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value1" fill="#8884d8" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart width={400} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value2" stroke="#82ca9d" />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Tooltip />
            <Pie
              data={chartData}
              dataKey="value3"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#ffc658"
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        );

      case "area":
        return (
          <AreaChart width={400} height={300} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="value4"
              fill="#8884d8"
              stroke="#8884d8"
            />
          </AreaChart>
        );
      default:
        return (
          <AreaChart width={400} height={300} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="value4"
              fill="#8884d8"
              stroke="#8884d8"
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Chart Selection Dropdown */}
      <Select
        options={chartOptionData}
        value={
          selectedCharts.length > 0
            ? chartOptionData.filter((item) =>
                selectedCharts.includes(item.value)
              )
            : null
        }
        onChange={(newValue) => {
          setSelectedCharts(newValue?.map((item) => item.value) || []);
        }}
        isMulti={true}
        components={animatedComponents}
      />

      {/* Button to Update Data */}
      <Button
        onClick={() =>
          setChartData([
            {
              name: "May",
              value1: Math.random() * 500,
              value2: Math.random() * 300,
              value3: Math.random() * 200,
              value4: Math.random() * 100,
            },
            {
              name: "Jun",
              value1: Math.random() * 500,
              value2: Math.random() * 300,
              value3: Math.random() * 200,
              value4: Math.random() * 100,
            },
            {
              name: "Jul",
              value1: Math.random() * 500,
              value2: Math.random() * 300,
              value3: Math.random() * 200,
              value4: Math.random() * 100,
            },
            {
              name: "Aug",
              value1: Math.random() * 500,
              value2: Math.random() * 300,
              value3: Math.random() * 200,
              value4: Math.random() * 100,
            },
          ])
        }
      >
        Update Data
      </Button>

      {/* Render Multiple Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedCharts.map((chartType, index) => (
          <div key={index} className="border p-4 shadow rounded">
            <ChartContainer config={{}} className="min-h-[200px] w-full">
              {renderChart(chartType)}
            </ChartContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Multichart };
