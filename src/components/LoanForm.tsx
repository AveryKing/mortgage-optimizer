"use client";

import { useState } from "react";

export default function LoanForm() {
  const [amount, setAmount] = useState(250000);
  const [termYears, setTermYears] = useState(30);
  const [creditScore, setCreditScore] = useState(700);
  const [income, setIncome] = useState(85000);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, termYears, creditScore, income }),
    });
    const data = await res.json();
    setResult(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Loan Amount: </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Loan Term (Years): </label>
          <input
            type="number"
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Credit Score: </label>
          <input
            type="number"
            value={creditScore}
            onChange={(e) => setCreditScore(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Annual Income: </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {result && (
        <pre style={{ marginTop: "1rem", background: "#eee", padding: "1rem" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
