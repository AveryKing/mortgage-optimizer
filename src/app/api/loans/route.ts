import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// basic rule-based optimization
function optimizeLoan(creditScore: number, income: number, rate: number) {
  if (creditScore >= 750 && income >= 80000) {
    return "Recommend 15-year loan (better savings)";
  }
  if (creditScore < 620) {
    return "High risk - likely 30-year or denial";
  }
  return "Recommend 30-year loan (safer for profile)";
}

// simple compliance check
function runCompliance(creditScore: number, dti: number) {
  if (creditScore < 600) {
    return { status: "Fail", details: "Credit score too low" };
  }
  if (dti > 0.43) {
    return { status: "Warning", details: "Debt-to-income ratio too high" };
  }
  return { status: "Pass", details: "Meets requirements" };
}

export async function POST(request: Request) {
  try {
    const { amount, termYears, creditScore, income } = await request.json();

    // fake mortgage rate.. TODO: wire real API
    const rate = 6.0;

    // calculate DTI
    const monthlyPayment = amount * 0.005;
    const monthlyIncome = income / 12;
    const dti = monthlyPayment / monthlyIncome;

    // save loan
    const loan = await prisma.loan.create({
      data: {
        clientId: "user",
        amount,
        termYears,
        rate,
        creditScore,
        income,
      },
    });

    // compliance check
    const compliance = runCompliance(creditScore, dti);

    await prisma.complianceLog.create({
      data: {
        loanId: loan.id,
        status: compliance.status,
        details: compliance.details,
      },
    });

    // optimization
    const recommendation = optimizeLoan(creditScore, income, rate);

    await prisma.loan.update({
      where: { id: loan.id },
      data: { optimized: true, recommendation },
    });

    const updatedLoan = await prisma.loan.findUnique({
      where: { id: loan.id },
    });

    return NextResponse.json({ loan: updatedLoan, compliance, recommendation });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
