
import React, { useState, useMemo } from 'react';
import { Country } from '../types';

interface LearnModeProps {
  countries: Country[];
  onFlagTap: (url: string) => void;
}

const LearnMode: React.FC<LearnModeProps> = ({ countries, onFlagTap }) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return countries;
    const lower = search.toLowerCase();
    return countries.filter(c => 
      c.name.common.toLowerCase().includes(lower) || 
      c.capital?.[0]?.toLowerCase().includes(lower) ||
      c.region.toLowerCase().includes(lower)
    );
  }, [countries, search]);

  return (
    <div className="p-4 h-full flex flex-col space-y-4">
      <div className="sticky top-0 z-10 bg-white pb-2">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search countries, capitals..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((country) => (
            <div 
              key={country.cca3}
              className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/10 transition-all flex gap-4 items-center"
            >
              <div 
                className="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer shadow-sm border border-slate-50"
                onClick={() => onFlagTap(country.flags.svg)}
              >
                <img 
                  src={country.flags.svg} 
                  alt={country.name.common} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{country.name.common}</h3>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <i className="fa-solid fa-city text-[10px] text-slate-400"></i>
                    {country.capital?.[0] || "No Capital"}
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <i className="fa-solid fa-coins text-[10px] text-slate-400"></i>
                    {/* Fixed: cast Object.values to any[] to avoid 'unknown' type access error */}
                    {(Object.values(country.currencies || {}) as any[])[0]?.name || "N/A"}
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <i className="fa-solid fa-location-dot text-[10px] text-slate-400"></i>
                    {country.region}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-earth-africa text-slate-300 text-2xl"></i>
            </div>
            <p className="text-slate-500 font-medium">No countries found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnMode;
