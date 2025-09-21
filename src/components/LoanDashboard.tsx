"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type LoanDashboardProps = {
  amount: number;
  rate: number;
  income: number;
  compliance: { status: string; details: string };
};

function calcMonthlyPayment(amount: number, rate: number, years: number) {
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}

export default function LoanDashboard({
  amount,
  rate,
  income,
  compliance,
}: LoanDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [savingsTooltip, setSavingsTooltip] = useState(false);
  const [costTooltip, setCostTooltip] = useState(false);
  const [dtiTooltip, setDtiTooltip] = useState(false);
  useEffect(() => setMounted(true), []);

  // Calculate payments
  const monthly15 = calcMonthlyPayment(amount, rate, 15);
  const monthly30 = calcMonthlyPayment(amount, rate, 30);

  // Line chart: cost over time
  const years = Array.from({ length: 30 }, (_, i) => i + 1);
  const data15 = years.map((y) => Math.min(y, 15) * 12 * monthly15);
  const data30 = years.map((y) => y * 12 * monthly30);

  const lineData = {
    labels: years.map((y) => `${y} yr`),
    datasets: [
      {
        label: "15-Year Loan",
        data: data15,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "30-Year Loan",
        data: data30,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Savings difference
  const totalCost15 = 15 * 12 * monthly15;
  const totalCost30 = 30 * 12 * monthly30;
  const savings = totalCost30 - totalCost15;

  const barData = {
    labels: ["Total Loan Cost"],
    datasets: [
      {
        label: "15-Year Loan",
        data: [totalCost15],
        backgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "30-Year Loan",
        data: [totalCost30],
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  // DTI calculation
  const monthlyPayment = monthly30; // worst-case monthly
  const monthlyIncome = income / 12;
  const dti = monthlyPayment / monthlyIncome;

  const dtiData = {
    labels: ["Debt-to-Income Ratio"],
    datasets: [
      {
        label: "Your DTI",
        data: [dti],
        backgroundColor: dti > 0.43 ? "rgb(255, 205, 86)" : "rgb(75, 192, 192)",
      },
      {
        label: "Safe Threshold (43%)",
        data: [0.43],
        backgroundColor: "rgba(0,0,0,0.1)",
      },
    ],
  };

  return (
    <div className="mt-4 space-y-8">
      {/* Compliance card */}
      <div
        className={`flex items-center p-4 rounded-lg shadow-md ${
          compliance.status === "Pass"
            ? "bg-green-50 text-green-700"
            : compliance.status === "Warning"
            ? "bg-yellow-50 text-yellow-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {compliance.status === "Pass" ? (
          <CheckCircleIcon className="h-6 w-6 mr-2" />
        ) : (
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
        )}
        <div>
          <p className="font-semibold">{compliance.status}</p>
          <p className="text-sm">{compliance.details}</p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings card */}
        <div
          className={`bg-white p-2 rounded-xl shadow-md transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold">Savings Difference</h3>
            <div className="relative ml-2">
              <InformationCircleIcon
                className="h-5 w-5 text-gray-400 cursor-help"
                onMouseEnter={() => setSavingsTooltip(true)}
                onMouseLeave={() => setSavingsTooltip(false)}
              />
              {savingsTooltip && (
                <div className="absolute z-20 bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  Savings = difference in total payments between 15 and 30 years
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
          </div>
          <Bar
            key={`savings-${amount}-${rate}-${income}`}
            data={barData}
            options={{
              animation: { duration: 1200 },
            }}
          />
          <p className="mt-2 text-sm text-gray-600">
            Choosing a 15-year loan saves{" "}
            <span
              className="font-semibold text-green-600 animate-[pulse-scale_1.5s_infinite]"
              style={{
                display: "inline-block",
                animationTimingFunction: "ease-in-out",
              }}
            >
              ${savings.toLocaleString()}
            </span>{" "}
            compared to a 30-year loan.
          </p>
        </div>

        {/* Loan cost over time */}
        <div
          className={`bg-white p-2 rounded-xl shadow-md transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold">Loan Cost Over Time</h3>
            <div className="relative ml-2">
              <InformationCircleIcon
                className="h-5 w-5 text-gray-400 cursor-help"
                onMouseEnter={() => setCostTooltip(true)}
                onMouseLeave={() => setCostTooltip(false)}
              />
              {costTooltip && (
                <div className="absolute z-20 bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  Shows how total payments add up over years
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
          </div>
          <Line
            key={`line-${amount}-${rate}-${income}`}
            data={lineData}
            options={{ animation: { duration: 1200 } }}
          />
        </div>

        {/* DTI ratio bar */}
        <div
          className={`bg-white p-2 rounded-xl shadow-md transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold">
              Debt-to-Income Ratio (DTI)
            </h3>
            <div className="relative ml-2">
              <InformationCircleIcon
                className="h-5 w-5 text-gray-400 cursor-help"
                onMouseEnter={() => setDtiTooltip(true)}
                onMouseLeave={() => setDtiTooltip(false)}
              />
              {dtiTooltip && (
                <div className="absolute z-20 bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  DTI = monthly debt ÷ monthly income. Safe if below 43%.
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
          </div>
          <Bar
            key={`dti-${amount}-${rate}-${income}`}
            data={dtiData}
            options={{
              animation: { duration: 1200 },
              indexAxis: "y" as const,
              scales: {
                x: {
                  min: 0,
                  max: 1,
                  ticks: { callback: (val) => `${Number(val) * 100}%` },
                },
              },
            }}
          />
          <p className="mt-2 text-sm text-gray-600">
            Your DTI is{" "}
            <span
              className={`font-semibold ${
                dti > 0.43 ? "text-yellow-600" : "text-green-600"
              }`}
            >
              {(dti * 100).toFixed(1)}%
            </span>{" "}
            (safe threshold is 43%).
          </p>
        </div>
      </div>

      {/* Custom animation keyframes */}
      <style jsx global>{`
        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.9);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
