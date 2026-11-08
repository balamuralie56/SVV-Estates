'use client';

import React, { useState } from 'react';
import { db, Property } from '@/lib/supabase';
import { useApp } from './ClientProvider';
import { translations } from '@/lib/i18n';
import { Map, Info, Compass, Maximize2, CheckCircle2 } from 'lucide-react';

interface InteractivePlotGridProps {
  properties: Property[];
  onSelectPlot?: (property: Property) => void;
}

export default function InteractivePlotGrid({ properties, onSelectPlot }: InteractivePlotGridProps) {
  const { language } = useApp();
  const t = translations[language];

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Group properties by row or sorting order
  const sortedProperties = [...properties].sort((a, b) => {
    // Parse plot number to sort numerically if possible
    const numA = parseInt(a.property_number.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.property_number.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10';
      case 'booked':
        return 'bg-amber-500 text-white cursor-not-allowed shadow-amber-500/10';
      case 'sold':
        return 'bg-red-500 text-white cursor-not-allowed shadow-red-500/10';
      case 'blocked':
        return 'bg-blue-500 text-white cursor-not-allowed shadow-blue-500/10';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const handlePlotClick = (prop: Property) => {
    if (prop.status !== 'available') return;
    setSelectedPropertyId(prop.id);
    if (onSelectPlot) {
      onSelectPlot(prop);
    }
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  return (
    <div className="space-y-6">
      {/* Legend & Summary */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-[#1E1E1E] rounded-xl p-4 border border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
        <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 block"></span>
            <span className="text-gray-600 dark:text-gray-300">{t.available}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-500 block"></span>
            <span className="text-gray-600 dark:text-gray-300">{t.booked}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-red-500 block"></span>
            <span className="text-gray-600 dark:text-gray-300">{t.sold}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-blue-500 block"></span>
            <span className="text-gray-600 dark:text-gray-300">{t.blocked}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Total Plots: {properties.length}
        </div>
      </div>

      {/* Interactive Grid Map */}
      <div className="bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 overflow-x-auto shadow-inner transition-colors duration-300">
        <div className="min-w-[640px] space-y-4">
          <div className="text-center font-bold text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 flex items-center justify-center gap-2">
            <Map className="h-4 w-4" />
            <span>Community Plotting Layout Map</span>
          </div>
          
          <div className="grid grid-cols-6 gap-3.5">
            {sortedProperties.map((prop) => {
              const isSelected = selectedPropertyId === prop.id;
              return (
                <button
                  key={prop.id}
                  onClick={() => handlePlotClick(prop)}
                  disabled={prop.status !== 'available'}
                  className={`relative aspect-square md:aspect-video rounded-xl flex flex-col items-center justify-center p-2 font-bold text-sm transition-all duration-300 shadow-sm ${getStatusColor(prop.status)} ${
                    isSelected ? 'ring-4 ring-offset-2 ring-gold-light dark:ring-gold-dark scale-98 hover:scale-98 z-10' : 'hover:scale-102 active:scale-98'
                  }`}
                >
                  <span className="text-sm md:text-base">{prop.property_number.replace(/\D/g, '')}</span>
                  <span className="text-[9px] font-normal opacity-90 hidden md:block">{prop.area_sqft} sqft</span>
                  
                  {/* Visual markers */}
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gold-light dark:bg-gold-dark text-charcoal rounded-full p-0.5 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-white text-gold-light" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-4"></div>
          {/* Layout Internal Pathway Road representation */}
          <div className="bg-gray-300 dark:bg-gray-800 rounded-lg py-3 text-center text-[10px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase border-y border-dashed border-gray-400/50 dark:border-gray-700/50">
            ✦ Main Tar Road Layout Pathway - 30 Feet Road ✦
          </div>
        </div>
      </div>

      {/* Selected Plot Panel */}
      {selectedProperty && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-5 border border-gray-200/50 dark:border-gray-800/50 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 animate-fadeIn">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                {selectedProperty.property_number.replace(/\D/g, '')}
              </span>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedProperty.property_number} Details
              </h4>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <Maximize2 className="h-4 w-4 text-gray-400" />
                {selectedProperty.area_sqft} {t.sqft}
              </span>
              <span className="flex items-center gap-1">
                <Compass className="h-4 w-4 text-gray-400" />
                {selectedProperty.facing} Facing
              </span>
              <span className="flex items-center gap-1">
                <Info className="h-4 w-4 text-gray-400" />
                Price: Rs. {selectedProperty.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`https://wa.me/919994115154?text=Hi%20SVV%20Estates,%20I%20am%20interested%20in%20${selectedProperty.property_number}%20at%20${db.getProjectById(selectedProperty.project_id)?.name_en || 'your layout'}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.inquirePlot}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
