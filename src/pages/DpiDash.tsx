import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// In-file component for the page header.
const PageHeader = ({ title, description }) => (
  <div className="bg-white p-6 shadow-md rounded-lg">
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    <p className="mt-1 text-gray-500">{description}</p>
  </div>
);

// In-file component for the DPI Report Chart.
const DPIReportChart = ({ score }) => {
  const normalizedScore = Number(score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 10) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className={`
            transition-all duration-700
            ${normalizedScore >= 7 ? 'text-green-500' : normalizedScore >= 4 ? 'text-yellow-500' : 'text-red-500'}
          `}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={isNaN(strokeDashoffset) ? circumference : strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <span className="text-3xl font-bold">
          {isNaN(normalizedScore) ? 'N/A' : normalizedScore.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

// Data from financial records and production records would be imported here.
// import { useFinancialRecords } from '@/hooks/useFinancialRecords';
// import { useProductionRecords } from '@/hooks/useProductionRecords';

const DPIReport = () => {
  // Hard-coded data for demonstration.
  // This would be replaced with actual data from hooks like useFinancialRecords and useProductionRecords.
  const financialRecords = [
    { id: '1', transaction_type: 'Income', amount: 5000, transaction_date: '2023-01-01' },
    { id: '2', transaction_type: 'Expense', amount: 2000, transaction_date: '2023-01-05' },
    { id: '3', transaction_type: 'Income', amount: 6000, transaction_date: '2023-01-10' },
    { id: '4', transaction_type: 'Expense', amount: 3000, transaction_date: '2023-01-15' },
  ];

  const productionRecords = [
    { id: '1', amount: 120, production_date: '2023-01-01' },
    { id: '2', amount: 150, production_date: '2023-01-02' },
    { id: '3', amount: 130, production_date: '2023-01-03' },
    { id: '4', amount: 160, production_date: '2023-01-04' },
  ];

  // const { data: financialRecords = [] } = useFinancialRecords();
  // const { data: productionRecords = [] } = useProductionRecords();
  
  const [milkSales, setMilkSales] = useState<number>(10000);
  const [totalCosts, setTotalCosts] = useState<number>(8000);

  // Calculate the score using useMemo to optimize performance
  const scoreMetrics = useMemo(() => {
    if (totalCosts === 0) {
      return { dpi: 0, normalizedScore: 0 };
    }
    const dpi = (milkSales - totalCosts) / totalCosts;
    const normalizedScore = Math.min(10, Math.max(0, 5 * dpi));
    return { dpi, normalizedScore };
  }, [milkSales, totalCosts]);

  const { dpi, normalizedScore } = scoreMetrics;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setter(value);
    }
  };

  const chartData = useMemo(() => {
    // This is where you would process the actual financialRecords and productionRecords
    // For now, we'll use a simple hard-coded example for the histogram.
    return [
      { name: 'Jan', income: 8000, expenses: 4000 },
      { name: 'Feb', income: 10000, expenses: 5000 },
      { name: 'Mar', income: 9500, expenses: 4800 },
      { name: 'Apr', income: 11000, expenses: 5500 },
    ];
  }, [financialRecords, productionRecords]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="DPI Report"
        description="Monitor your financial performance with the Dairy Performance Index (DPI)."
      />

      <div className="p-4 space-y-6 max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              DPI Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1 flex flex-col items-center justify-center">
              <DPIReportChart score={normalizedScore} />
              <p className="mt-4 text-center text-lg text-gray-600">
                Your Normalized Score is <span className="font-bold">{normalizedScore.toFixed(1)}</span>
              </p>
            </div>
            
            <div className="flex-1 w-full h-80 mt-8 md:mt-0">
              <h3 className="text-center font-semibold mb-4">Monthly Income vs. Expenses</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#10B981" />
                  <Bar dataKey="expenses" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Calculate Your Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="milk-sales" className="text-gray-700">
                Milk Sales ($)
              </Label>
              <Input
                id="milk-sales"
                type="number"
                value={milkSales}
                onChange={(e) => handleInputChange(e, setMilkSales)}
              />
            </div>
            <div>
              <Label htmlFor="total-costs" className="text-gray-700">
                Total Costs ($)
              </Label>
              <Input
                id="total-costs"
                type="number"
                value={totalCosts}
                onChange={(e) => handleInputChange(e, setTotalCosts)}
              />
            </div>
            <div className="text-sm text-gray-500 mt-2 space-y-1">
              <p>Formula: $(Milk\ Sales\ -\ Total\ Costs)\ /\ Total\ Costs$</p>
              <p>Normalized Score: $min(10, max(0, 5\ *\ DPI))$</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DPIReport;
