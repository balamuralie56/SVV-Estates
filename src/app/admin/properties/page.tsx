'use client';

import React, { useState } from 'react';
import { db, Project, Property } from '@/lib/supabase';
import { useApp } from '@/components/ClientProvider';
import { Building2, Layers } from 'lucide-react';

export default function PropertiesManager() {
  const { language } = useApp();
  const [projects] = useState<Project[]>(() => db.getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState('proj-1');
  const [properties, setProperties] = useState<Property[]>(() => db.getPropertiesByProject('proj-1'));
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  function loadProperties() {
    setProperties(db.getPropertiesByProject(selectedProjectId));
  }

  const handlePropertyClick = (prop: Property) => {
    setSelectedProperty(prop);
  };

  const handleUpdateStatus = (status: Property['status']) => {
    if (!selectedProperty) return;
    const updated = db.updatePropertyStatus(selectedProperty.id, status);
    loadProperties();
    // Refresh selected property details
    const nextProp = updated.find(p => p.id === selectedProperty.id);
    if (nextProp) setSelectedProperty(nextProp);
  };

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'booked':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'sold':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'blocked':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Property Layout Inventory</h1>
        <p className="text-xs text-gray-400 font-medium">Manage and check real-time availability status for plots, villas, and farm lands.</p>
      </div>

      {/* Select Project Tab Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-800">
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => {
              setSelectedProjectId(proj.id);
              setProperties(db.getPropertiesByProject(proj.id));
              setSelectedProperty(null);
            }}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedProjectId === proj.id
                ? 'bg-charcoal text-white dark:bg-gold-dark dark:text-charcoal'
                : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850'
            }`}
          >
            {language === 'en' ? proj.name_en : proj.name_ta}
          </button>
        ))}
      </div>

      {/* Main split dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Property/Plot Grid List */}
        <div className="lg:col-span-8 bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/80 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Layers className="w-4.5 h-4.5 text-gold-light" />
              <span>Plot Map Matrix</span>
            </h3>
            <div className="flex gap-4 text-[10px] font-semibold text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500"></span>Available</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500"></span>Booked</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500"></span>Sold</span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {properties.map((prop) => (
              <button
                key={prop.id}
                onClick={() => handlePropertyClick(prop)}
                className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center transition-all ${
                  selectedProperty?.id === prop.id
                    ? 'ring-2 ring-gold-light dark:ring-gold-dark border-transparent scale-98 shadow-md'
                    : 'hover:scale-102 active:scale-98'
                } ${
                  prop.status === 'available'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : prop.status === 'booked'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    : prop.status === 'sold'
                    ? 'bg-red-500/10 text-red-600 border-red-500/20'
                    : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                }`}
              >
                <span>{prop.property_number.replace(/\D/g, '')}</span>
                <span className="text-[9px] font-medium opacity-80 mt-1">{prop.area_sqft} sqft</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Property Specifications Console */}
        <div className="lg:col-span-4 space-y-6">
          {selectedProperty ? (
            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/80 transition-colors shadow-md space-y-6">
              
              {/* Header Title */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gold-light" />
                  <span>{selectedProperty.property_number} Details</span>
                </h3>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Inventory Console</span>
              </div>

              {/* Specifications parameters */}
              <div className="text-xs space-y-3.5 border-y py-4 border-gray-100 dark:border-gray-800">
                <div className="flex justify-between"><span className="text-gray-400">Total Area</span><span className="font-bold">{selectedProperty.area_sqft} Sq.Ft</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Facing</span><span className="font-bold">{selectedProperty.facing}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Standard Price</span><span className="font-bold">₹{selectedProperty.price.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${getStatusBadge(selectedProperty.status)}`}>
                    {selectedProperty.status}
                  </span>
                </div>
              </div>

              {/* Amenities tags */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Provided Amenities</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProperty.amenities.map((am, i) => (
                    <span key={i} className="text-[9px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Update Control Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 block mb-2">Change Inventory Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus('available')}
                    disabled={selectedProperty.status === 'available'}
                    className="py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-400 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Set Available
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('blocked')}
                    disabled={selectedProperty.status === 'blocked'}
                    className="py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-400 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Set Blocked
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('booked')}
                    disabled={selectedProperty.status === 'booked'}
                    className="py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-400 text-white rounded-lg text-xs font-bold transition-all sm:col-span-2"
                  >
                    Set Booked
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('sold')}
                    disabled={selectedProperty.status === 'sold'}
                    className="py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-400 text-white rounded-lg text-xs font-bold transition-all sm:col-span-2"
                  >
                    Set Sold (Registration Done)
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-card-dark rounded-2xl p-8 border border-gray-200/50 dark:border-gray-800/80 text-center text-gray-400 text-xs italic transition-colors">
              Click a plot number on the left to edit availability and specs.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
