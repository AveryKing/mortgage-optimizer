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
  const [formVisible, setFormVisible] = useState<boolean>(true);
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);

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
    setFormVisible(false);
    setTimeout(() => setCollapsed(true), 300);
  };

  // Quick scenarios
  const scenarios = {
    strong: { amount: 300000, termYears: 15, creditScore: 780, income: 120000 },
    risk: { amount: 400000, termYears: 30, creditScore: 600, income: 60000 },
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
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="mx-auto px-2">
        {/* Page Header */}
        <header className="text-center mb-6">
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
            className={`bg-white rounded-xl shadow-md p-3 mb-8 transition-all duration-700 max-w-4xl mx-auto ${
              formVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
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
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Optimize Loan
              </button>

              {/* Scenario toggle */}
              <div className="flex flex-col md:flex-row md:inline-flex rounded-md border border-gray-300 overflow-hidden">
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
                  className={`px-4 py-2 text-sm font-medium border-l-0 md:border-l border-t md:border-t-0 border-gray-300 ${
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
                  className={`px-4 py-2 text-sm font-medium border-l-0 md:border-l border-t md:border-t-0 border-gray-300 ${
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
            {/* Current Loan Details Summary */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Current Loan Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Loan Amount:</span>
                  <p className="font-medium">
                    ${loanData.loan.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Interest Rate:</span>
                  <p className="font-medium">{loanData.loan.rate}%</p>
                </div>
                <div>
                  <span className="text-gray-600">Term:</span>
                  <p className="font-medium">{loanData.loan.termYears} years</p>
                </div>
                <div>
                  <span className="text-gray-600">Annual Income:</span>
                  <p className="font-medium">
                    ${loanData.loan.income.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Export and Edit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Export
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => {
                        // Export CSV
                        const csvData = [
                          ["Loan Details", ""],
                          [
                            "Loan Amount",
                            `$${loanData.loan.amount.toLocaleString()}`,
                          ],
                          ["Interest Rate", `${loanData.loan.rate}%`],
                          ["Term", `${loanData.loan.termYears} years`],
                          [
                            "Annual Income",
                            `$${loanData.loan.income.toLocaleString()}`,
                          ],
                          ["", ""],
                          ["Compliance", loanData.compliance.status],
                          ["Compliance Details", loanData.compliance.details],
                        ];

                        const csvContent = csvData
                          .map((row) => row.join(","))
                          .join("\n");
                        const blob = new Blob([csvContent], {
                          type: "text/csv",
                        });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "loan-analysis.csv";
                        a.click();
                        window.URL.revokeObjectURL(url);
                        setShowExportDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="text-green-600">📊</span>
                      Export CSV
                    </button>
                    <button
                      onClick={() => {
                        // Export PDF
                        const buttonContainer = document.querySelector(
                          ".flex.flex-col.sm\\:flex-row.justify-end.gap-2.mb-4"
                        ) as HTMLElement;
                        if (buttonContainer)
                          buttonContainer.style.display = "none";

                        setTimeout(() => {
                          window.print();
                          setTimeout(() => {
                            if (buttonContainer)
                              buttonContainer.style.display = "flex";
                          }, 100);
                        }, 100);
                        setShowExportDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="text-red-600">📄</span>
                      Export PDF
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setCollapsed(false);
                  setScenario(null);
                  setFormVisible(false);
                  setTimeout(() => setFormVisible(true), 50);
                  setShowExportDropdown(false); // Close dropdown if open
                }}
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
