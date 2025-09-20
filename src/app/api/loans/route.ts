import { PrismaClient } from "@prisma/client";

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
