import LoanForm from "@/components/LoanForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Mortgage Optimizer Demo
        </h1>
        <LoanForm />
      </div>
    </main>
  );
}
