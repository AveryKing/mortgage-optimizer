import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, termYears, creditScore, income } = await request.json();

    // fake mortgage rate.. TODO: wire real API
    const rate = 6.0;

    // calculate DTI
    const monthlyPayment = amount * 0.005;
    const monthlyIncome = income / 12;
    const dti = monthlyPayment / monthlyIncome;

    // save loan linked to logged-in user
    const loan = await prisma.loan.create({
      data: {
        amount,
        termYears,
        rate,
        creditScore,
        income,
        clientId: session.user.id.toString(),
        user: {
          connect: { id: session.user.id },
        },
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

    const updatedLoan = await prisma.loan.update({
      where: { id: loan.id },
      data: { optimized: true, recommendation },
    });

    return NextResponse.json({ loan: updatedLoan, compliance, recommendation });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
