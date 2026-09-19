import React from 'react';
import { Download, ExternalLink, Shield, Layers, Flame } from 'lucide-react';
import { BRAND_ASSETS } from '../data/assets';
import { downloadSvg } from '../utils/exportUtils';

interface NavbarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeTab: 'showcase' | 'mockups' | 'specs';
  setActiveTab: (tab: 'showcase' | 'mockups' | 'specs') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeFilter,
  setActiveFilter,
  activeTab,
  setActiveTab,
}) => {
  const handleDownloadAll = () => {
    BRAND_ASSETS.forEach((asset, index) => {
      setTimeout(() => {
        downloadSvg(asset);
      }, index * 200);
    });
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Repo Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700/60 flex items-center justify-center p-1.5 shadow-inner">
              <svg viewBox="0 0 775 731" className="w-full h-full text-amber-500 fill-current">
                <path d={BRAND_ASSETS[4].pathD} />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-sm sm:text-base text-neutral-100 uppercase">
                  Forge & Kuźnia
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
                  Vector Suite
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5 truncate">
                matbar87/forge
              </span>
            </div>
          </div>

          {/* Navigation Views */}
          <div className="hidden md:flex items-center bg-neutral-900/90 rounded-lg p-1 border border-neutral-800">
            <button
              id="nav-tab-showcase"
              onClick={() => setActiveTab('showcase')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'showcase'
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Asset Inspector
            </button>
            <button
              id="nav-tab-mockups"
              onClick={() => setActiveTab('mockups')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'mockups'
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Live Mockups
            </button>
            <button
              id="nav-tab-specs"
              onClick={() => setActiveTab('specs')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'specs'
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Specifications
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-download-all-svgs"
              onClick={handleDownloadAll}
              title="Download all 5 original vector assets"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Export All (5 SVGs)</span>
              <span className="sm:hidden">Export All</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-neutral-800/60 text-xs">
          <button
            onClick={() => setActiveTab('showcase')}
            className={`py-1 px-2 rounded font-medium ${
              activeTab === 'showcase' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveTab('mockups')}
            className={`py-1 px-2 rounded font-medium ${
              activeTab === 'mockups' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            Mockups
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-1 px-2 rounded font-medium ${
              activeTab === 'specs' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            Specifications
          </button>
        </div>
      </div>
    </header>
  );
};
