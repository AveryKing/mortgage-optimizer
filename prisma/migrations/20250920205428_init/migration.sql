-- CreateTable
CREATE TABLE "Loan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "termYears" INTEGER NOT NULL,
    "rate" REAL NOT NULL,
    "creditScore" INTEGER NOT NULL,
    "income" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "optimized" BOOLEAN NOT NULL DEFAULT false,
    "recommendation" TEXT
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kind" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "source" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ComplianceLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "loanId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ComplianceLog_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
