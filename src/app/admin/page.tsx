'use client';

import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/supabase';
import {
  Users,
  Compass,
  DollarSign,
  Award,
} from 'lucide-react';

export default function AdminDashboard() {
  const leads = db.getLeads();
  const properties = db.getProperties();
  const bookings = db.getBookings();
  const siteVisits = db.getSiteVisits();
  const agents = db.getAgents();

  // Metrics Calculations
  const newLeadsCount = leads.filter(l => l.lead_stage === 'new').length;
  const completedVisits = siteVisits.filter(v => v.status === 'completed').length;
  const pendingVisits = siteVisits.filter(v => v.status === 'scheduled').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.agreed_price), 0);
  const totalAdvance = bookings.reduce((sum, b) => sum + Number(b.advance_amount_paid), 0);

  // Group leads by source
  const sourceGroups = leads.reduce((acc, l) => {
    acc[l.lead_source] = (acc[l.lead_source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sources = Object.entries(sourceGroups).map(([name, count]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    count,
    percent: Math.round((count / leads.length) * 100)
  })).sort((a,b) => b.count - a.count);

  const formatCurrencyCr = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Title & Add New Lead CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Real-time analytics for SVV Estates developments and sales operations.
          </p>
        </div>
        <Link
          href="/admin/leads?action=new"
          className="px-4 py-2.5 bg-gold-light hover:bg-gold-hover text-gray-900 rounded-lg text-xs font-bold shadow-sm transition-all"
        >
          ✦ Add New Lead
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Inquiries', val: leads.length, change: `+${newLeadsCount} new today`, icon: Users, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Site Visits', val: `${completedVisits}/${siteVisits.length}`, change: `${pendingVisits} scheduled`, icon: Compass, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Properties Booked', val: bookings.length, change: `${properties.filter(p => p.status === 'available').length} units available`, icon: Award, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Total Est. Revenue', val: formatCurrencyCr(totalRevenue), change: `${formatCurrencyCr(totalAdvance)} advance paid`, icon: DollarSign, color: 'text-gold-light bg-gold-light/10' }
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-card-dark rounded-xl p-5 border border-gray-200/50 dark:border-gray-800/80 shadow-sm flex items-center justify-between transition-colors"
          >
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                {card.label}
              </span>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.val}
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">
                {card.change}
              </span>
            </div>
            <div className={`p-3 rounded-lg shrink-0 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Charts & Source Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Sales Velocity Visual Graph */}
        <div className="lg:col-span-8 bg-white dark:bg-card-dark border border-gray-200/50 dark:border-gray-800/80 rounded-2xl p-6 transition-colors">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">
            Weekly Sales Volume & Inquiries
          </h3>
          
          {/* Custom SVG Line Chart */}
          <div className="w-full h-64 relative bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border border-gray-150/40 dark:border-gray-850 p-4">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="480" y2="20" stroke="#888" strokeWidth="0.2" strokeDasharray="3" />
              <line x1="50" y1="80" x2="480" y2="80" stroke="#888" strokeWidth="0.2" strokeDasharray="3" />
              <line x1="50" y1="140" x2="480" y2="140" stroke="#888" strokeWidth="0.2" strokeDasharray="3" />
              <line x1="50" y1="170" x2="480" y2="170" stroke="#888" strokeWidth="0.5" />

              {/* Data Line: Inquiries */}
              <polyline
                fill="none"
                stroke="#D2B283"
                strokeWidth="2.5"
                points="50,150 120,120 190,80 260,110 330,40 400,60 480,30"
              />
              {/* Data Line: Bookings */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                points="50,170 120,165 190,150 260,160 330,130 400,140 480,110"
              />

              {/* Data points */}
              <circle cx="330" cy="40" r="4" fill="#D2B283" />
              <circle cx="480" cy="30" r="4" fill="#D2B283" />
              <circle cx="480" cy="110" r="4" fill="#10B981" />

              {/* X Axis Labels */}
              <text x="50" y="190" fontSize="8" fill="#aaa" textAnchor="middle">Mon</text>
              <text x="120" y="190" fontSize="8" fill="#aaa" textAnchor="middle">Tue</text>
              <text x="190" y="190" fontSize="8" fill="#aaa" textAnchor="middle">Wed</text>
              <text x="260" y="190" fontSize="8" fill="#aaa" textAnchor="middle">Thu</text>
              <text x="330" y="190" fontSize="8" fill="#aaa" textAnchor="middle">Fri</text>
              <text x="400" y="190" fontSize="8" fill="#aaa" textAnchor="middle">Sat</text>
              <text x="480" y="190" fontSize="8" fill="#aaa" textAnchor="middle">Sun</text>
            </svg>
            <div className="absolute top-4 right-4 flex items-center gap-4 text-[10px] font-bold uppercase text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gold-light block rounded-sm"></span>Inquiries</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 block rounded-sm"></span>Bookings</span>
            </div>
          </div>
        </div>

        {/* Right Side: Marketing Lead Sources */}
        <div className="lg:col-span-4 bg-white dark:bg-card-dark border border-gray-200/50 dark:border-gray-800/80 rounded-2xl p-6 transition-colors space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
            Inquiries by Source
          </h3>
          <div className="space-y-4 pt-2">
            {sources.map((src, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <span>{src.name}</span>
                  <span>{src.count} ({src.percent}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-150 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-light dark:bg-gold-dark rounded-full"
                    style={{ width: `${src.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Executive Leaderboard & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Sales Leaderboard */}
        <div className="lg:col-span-4 bg-white dark:bg-card-dark border border-gray-200/50 dark:border-gray-800/80 rounded-2xl p-6 transition-colors space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1">
              <Award className="h-4 w-4 text-gold-light" />
              <span>Sales Performance</span>
            </h3>
            <div className="space-y-4">
              {agents.filter(a => a.role === 'sales_executive').map((agent, idx) => {
                const agentBookings = bookings.filter(b => b.agent_id === agent.id).length;
                return (
                  <div key={agent.id} className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-gray-400">#{idx + 1}</span>
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{agent.name}</div>
                        <div className="text-[10px] text-gray-450">{agent.phone}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-500">{agentBookings} Sales</div>
                      <div className="text-[10px] text-gray-400">Active Pipeline</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Bookings Table */}
        <div className="lg:col-span-8 bg-white dark:bg-card-dark border border-gray-200/50 dark:border-gray-800/80 rounded-2xl p-6 transition-colors">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
            Recent Booking Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5">Lead Name</th>
                  <th className="py-2.5">Property</th>
                  <th className="py-2.5">Agreed Price</th>
                  <th className="py-2.5">Advance</th>
                  <th className="py-2.5">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-850 font-medium">
                {bookings.map((booking) => {
                  const lead = leads.find(l => l.id === booking.lead_id);
                  const prop = properties.find(p => p.id === booking.property_id);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/20 text-gray-700 dark:text-gray-300">
                      <td className="py-3 font-bold">{lead ? `${lead.first_name} ${lead.last_name || ''}` : 'Unknown'}</td>
                      <td className="py-3">{prop?.property_number || 'Unit'}</td>
                      <td className="py-3">{booking.agreed_price.toLocaleString('en-IN')}</td>
                      <td className="py-3">{booking.advance_amount_paid.toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          booking.payment_status === 'fully_paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {booking.payment_status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
