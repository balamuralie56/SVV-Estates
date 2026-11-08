'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from './ClientProvider';
import { translations } from '@/lib/i18n';
import { Landmark, Calendar, Percent } from 'lucide-react';

interface EmiCalculatorProps {
  initialPrice?: number;
}

export default function EmiCalculator({ initialPrice = 3000000 }: EmiCalculatorProps) {
  const { language } = useApp();
  const t = translations[language];

  const [price, setPrice] = useState(initialPrice);
  const [downPayment, setDownPayment] = useState(initialPrice * 0.2); // Default 20% down payment
  const [interestRate, setInterestRate] = useState(8.5); // Default 8.5% p.a.
  const [tenure, setTenure] = useState(15); // Default 15 years
  const effectiveDownPayment = downPayment >= price ? price * 0.2 : downPayment;
  const loanAmount = Math.max(price - effectiveDownPayment, 0);
  const emi = useMemo(() => {
    if (loanAmount <= 0) return 0;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const emiValue = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Number.isNaN(emiValue) ? 0 : Math.round(emiValue);
  }, [interestRate, loanAmount, tenure]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value).replace('INR', '₹');
  };

  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 md:p-8 shadow-md border border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Landmark className="h-5 w-5 text-gold-light dark:text-gold-dark" />
          {t.emiTitle}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t.emiSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders Console */}
        <div className="space-y-6">
          {/* Price Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.propertyPrice}
              </label>
              <span className="text-base font-semibold text-gold-light dark:text-gold-dark">
                {formatCurrency(price)}
              </span>
            </div>
            <input
              type="range"
              min="1000000"
              max="20000000"
              step="100000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold-light dark:accent-gold-dark"
            />
          </div>

          {/* Down Payment Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.downPayment}
              </label>
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(effectiveDownPayment)} ({Math.round((effectiveDownPayment / price) * 100)}%)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={price * 0.9}
              step="50000"
              value={effectiveDownPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold-light dark:accent-gold-dark"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Interest Rate */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Percent className="h-4 w-4 text-gray-400" />
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t.interestRate}
                </label>
              </div>
              <input
                type="number"
                min="5"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-800 text-sm font-semibold focus:outline-none focus:border-gold-light"
              />
            </div>

            {/* Tenure */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t.tenureYears}
                </label>
              </div>
              <select
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-800 text-sm font-semibold focus:outline-none focus:border-gold-light"
              >
                <option value={5}>5 Years</option>
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex flex-col justify-between bg-gray-50 dark:bg-[#282828] rounded-xl p-6 border border-gray-100 dark:border-gray-800/80">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
              {t.monthlyEmi}
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-gold-light dark:text-gold-dark mt-1">
              {formatCurrency(emi)}
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">
                / {t.perMonth}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Principal Loan Amount</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Interest Payable</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(totalInterest > 0 ? totalInterest : 0)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 font-semibold">
              <span className="text-gray-800 dark:text-gray-200">Total Payment (Principal + Interest)</span>
              <span className="text-gold-light dark:text-gold-dark">{formatCurrency(totalPayment > 0 ? totalPayment : 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
