"use client";
import { useState } from "react";
import LoanDashboard from "./LoanDashboard";

export default function LoanForm() {
  const [amount, setAmount] = useState<number>(250000);
  const [termYears, setTermYears] = useState<number>(30);
  const [creditScore, setCreditScore] = useState<number>(700);
  const [income, setIncome] = useState<number>(85000);
  const [loanData, setLoanData] = useState<any>(null);
  const [scenario, setScenario] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, termYears, creditScore, income }),
    });

    const data = await res.json();
    setLoanData(data);

    // Collapse form once results are ready
    setCollapsed(true);
  };

  // Quick scenarios
  const scenarios = {
    strong: { amount: 300000, termYears: 15, creditScore: 780, income: 120000 },
    risk: { amount: 250000, termYears: 30, creditScore: 600, income: 45000 },
    average: { amount: 200000, termYears: 30, creditScore: 680, income: 70000 },
  };

  const applyScenario = async (key: keyof typeof scenarios) => {
    const s = scenarios[key];
    setAmount(s.amount);
    setTermYears(s.termYears);
    setCreditScore(s.creditScore);
    setIncome(s.income);
    setScenario(key);

    // Auto-submit scenario
    const res = await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    const data = await res.json();
    setLoanData(data);
    setCollapsed(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Page Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Mortgage Optimization Platform
          </h1>
          <p className="text-gray-600 mt-2">
            Compare loan options, check compliance, and see your savings in real
            time.
          </p>
        </header>

        {/* Loan Form (only render when NOT collapsed) */}
        {!collapsed && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-700"
          >
            <h2 className="text-lg font-semibold mb-4">Enter Loan Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loan Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Term (Years)
                </label>
                <select
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Credit Score
                </label>
                <input
                  type="number"
                  value={creditScore}
                  onChange={(e) => setCreditScore(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Annual Income
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons row */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Optimize Loan
              </button>

              {/* Scenario toggle */}
              <div className="flex rounded-md border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => applyScenario("strong")}
                  className={`px-4 py-2 text-sm font-medium ${
                    scenario === "strong"
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-700 hover:bg-green-50"
                  }`}
                >
                  Strong
                </button>
                <button
                  type="button"
                  onClick={() => applyScenario("risk")}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${
                    scenario === "risk"
                      ? "bg-yellow-500 text-black"
                      : "bg-white text-yellow-700 hover:bg-yellow-50"
                  }`}
                >
                  At-Risk
                </button>
                <button
                  type="button"
                  onClick={() => applyScenario("average")}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${
                    scenario === "average"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  Average
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Loan Dashboard */}
        {collapsed && loanData && loanData.loan && (
          <div className="transition-all duration-700 opacity-100 translate-y-0">
            {/* Reopen Form Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setCollapsed(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md shadow hover:bg-gray-200 transition"
              >
                Edit Loan Details
              </button>
            </div>

            <LoanDashboard
              amount={loanData.loan.amount}
              rate={loanData.loan.rate}
              income={loanData.loan.income}
              compliance={loanData.compliance}
            />
          </div>
        )}
      </div>
    </div>
  );
}
