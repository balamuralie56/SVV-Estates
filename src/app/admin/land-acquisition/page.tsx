'use client';

import React, { useState } from 'react';
import { db, LandAcquisition } from '@/lib/supabase';
import { TrendingUp, Plus, Info, X } from 'lucide-react';

export default function LandAcquisitionsManager() {
  const [lands, setLands] = useState<LandAcquisition[]>(() => db.getLandAcquisitions());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedLand, setSelectedLand] = useState<LandAcquisition | null>(null);

  // Add Land Form State
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [locationName, setLocationName] = useState('');
  const [surveyNumbers, setSurveyNumbers] = useState('');
  const [areaAcres, setAreaAcres] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [notes, setNotes] = useState('');

  function loadLands() {
    setLands(db.getLandAcquisitions());
  }

  const handleLandClick = (land: LandAcquisition) => {
    setSelectedLand(land);
  };

  const handleUpdateStatus = (status: LandAcquisition['status'], agreedPrice?: number) => {
    if (!selectedLand) return;
    const updated = db.updateLandStatus(selectedLand.id, status, agreedPrice);
    setLands(updated);
    const nextLand = updated.find(l => l.id === selectedLand.id);
    if (nextLand) setSelectedLand(nextLand);
  };

  const handleAddLandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !locationName || !areaAcres || !askingPrice) return;

    db.createLandAcquisition({
      seller_name: sellerName,
      seller_phone: sellerPhone || undefined,
      location_name: locationName,
      survey_numbers: surveyNumbers,
      total_area_acres: Number(areaAcres),
      asking_price: Number(askingPrice),
      advance_paid: 0,
      notes: notes || undefined
    });

    setSellerName('');
    setSellerPhone('');
    setLocationName('');
    setSurveyNumbers('');
    setAreaAcres('');
    setAskingPrice('');
    setNotes('');
    setIsAddOpen(false);
    loadLands();
  };

  const getStatusBadge = (status: LandAcquisition['status']) => {
    switch (status) {
      case 'under_verification':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'legal_clear':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400';
      case 'legal_rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'acquired':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'layout_approved':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'dropped':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Land Acquisition deals</h1>
          <p className="text-xs text-gray-400 font-medium">Track development prospects, verify survey certificates, and negotiate land purchases.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-gold-light hover:bg-gold-hover text-gray-900 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Land Deal</span>
        </button>
      </div>

      {/* Main split dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Land Deals List */}
        <div className="lg:col-span-8 bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/80 transition-colors">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-1.5">
            <TrendingUp className="w-4.5 h-4.5 text-gold-light" />
            <span>Active Prospects</span>
          </h3>

          <div className="space-y-4">
            {lands.map((land) => (
              <div
                key={land.id}
                onClick={() => handleLandClick(land)}
                className={`p-4 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-850/10 hover:shadow-sm cursor-pointer transition-all flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${
                  selectedLand?.id === land.id ? 'ring-2 ring-gold-light' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{land.location_name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${getStatusBadge(land.status)}`}>
                      {land.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-semibold space-y-1">
                    <div>Survey: {land.survey_numbers}</div>
                    <div className="text-gold-light uppercase">{land.total_area_acres} Acres | Seller: {land.seller_name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-400">Asking Budget</div>
                  <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">
                    ₹{(land.asking_price / 10000000).toFixed(2)} Cr
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Land Deal details Console */}
        <div className="lg:col-span-4">
          {selectedLand ? (
            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/80 transition-colors shadow-md space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="h-5 w-5 text-gold-light" />
                  <span>Land Deal Info</span>
                </h3>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Acquisition parameters</span>
              </div>

              <div className="text-xs space-y-3.5 border-y py-4 border-gray-100 dark:border-gray-800">
                <div className="flex justify-between"><span className="text-gray-400">Seller Name</span><span className="font-bold">{selectedLand.seller_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Seller Phone</span><span className="font-bold">{selectedLand.seller_phone || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Survey Coordinates</span><span className="font-bold">{selectedLand.survey_numbers}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Acreage</span><span className="font-bold text-gold-light">{selectedLand.total_area_acres} Acres</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Asking Budget</span><span className="font-bold">₹{selectedLand.asking_price.toLocaleString('en-IN')}</span></div>
                {selectedLand.agreed_price && (
                  <div className="flex justify-between"><span className="text-gray-400 font-semibold">Agreed Deal Price</span><span className="font-bold text-emerald-500">₹{selectedLand.agreed_price.toLocaleString('en-IN')}</span></div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Verification Status</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${getStatusBadge(selectedLand.status)}`}>
                    {selectedLand.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {selectedLand.notes && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-gray-400 block">Deal Comments</label>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-850 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                    {selectedLand.notes}
                  </p>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="text-[9px] font-bold uppercase text-gray-400 block mb-2">Modify Deal Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus('legal_clear')}
                    disabled={selectedLand.status === 'legal_clear'}
                    className="py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-400 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Mark Legal Clear
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('legal_rejected')}
                    disabled={selectedLand.status === 'legal_rejected'}
                    className="py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-400 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Mark Legal Reject
                  </button>
                  <button
                    onClick={() => {
                      const agreed = prompt('Enter Agreed Purchase Price (INR):', selectedLand.asking_price.toString());
                      if (agreed) handleUpdateStatus('acquired', Number(agreed));
                    }}
                    disabled={selectedLand.status === 'acquired'}
                    className="py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-400 text-white rounded-lg text-xs font-bold transition-all sm:col-span-2"
                  >
                    Confirm Deal Acquired
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('dropped')}
                    disabled={selectedLand.status === 'dropped'}
                    className="py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-400 text-white rounded-lg text-xs font-bold transition-all sm:col-span-2"
                  >
                    Drop Deal Prospect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-card-dark rounded-2xl p-8 border border-gray-200/50 dark:border-gray-800/80 text-center text-gray-400 text-xs italic transition-colors">
              Click a deal layout on the left to verify documents and modify parameters.
            </div>
          )}
        </div>

      </div>

      {/* Add New Deal Modal Overlay */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-850 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Track New Land Prospect</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleAddLandSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Seller Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Muthusamy Gounder"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Seller Phone</label>
                <input
                  type="tel"
                  placeholder="9994115154"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Vandalur Outer, Chennai"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Total Area (Acres) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 12.5"
                  value={areaAcres}
                  onChange={(e) => setAreaAcres(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Asking Budget (INR) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 45000000"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Survey Numbers *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S.No. 42/1, 42/2A"
                  value={surveyNumbers}
                  onChange={(e) => setSurveyNumbers(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block">Comments & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Enter legal findings or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none"
                ></textarea>
              </div>
              <div className="sm:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-gold-light hover:bg-gold-hover text-gray-900 font-bold rounded-lg text-xs tracking-wider uppercase shadow"
                >
                  Save Deal Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
