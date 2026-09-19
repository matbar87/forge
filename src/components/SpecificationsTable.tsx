import React from 'react';
import { BRAND_ASSETS, BrandAssetWithSvg } from '../data/assets';
import { Download, Code, FileText, CheckCircle2 } from 'lucide-react';
import { downloadSvg, downloadPng } from '../utils/exportUtils';

interface SpecificationsTableProps {
  onSelect: (asset: BrandAssetWithSvg) => void;
  onOpenCode: (asset: BrandAssetWithSvg) => void;
}

export const SpecificationsTable: React.FC<SpecificationsTableProps> = ({
  onSelect,
  onOpenCode,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          Technical Asset Inventory & Specifications
        </h2>
        <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
          Complete metadata and vector properties extracted from the original CorelDRAW X6 SVG source files.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-950/80 text-neutral-400 font-mono text-[11px] uppercase border-b border-neutral-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Asset</th>
              <th className="py-3.5 px-4 font-semibold">Filename</th>
              <th className="py-3.5 px-4 font-semibold">ViewBox</th>
              <th className="py-3.5 px-4 font-semibold">Dimensions (mm)</th>
              <th className="py-3.5 px-4 font-semibold">Aspect Ratio</th>
              <th className="py-3.5 px-4 font-semibold">File Size</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 font-mono text-neutral-300">
            {BRAND_ASSETS.map((asset) => (
              <tr key={asset.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => onSelect(asset)}
                      className="w-10 h-10 rounded-lg bg-neutral-950 border border-neutral-800 p-1.5 flex items-center justify-center shrink-0 cursor-pointer hover:border-amber-500/60 transition-colors"
                    >
                      <svg viewBox={asset.viewBox} className="max-w-full max-h-full fill-[#E3E6DB]">
                        <path d={asset.pathD} />
                      </svg>
                    </div>
                    <div>
                      <span className="font-sans font-semibold text-neutral-100 block text-xs">
                        {asset.name}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-sans">
                        {asset.polishName}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-neutral-400">{asset.filename}</td>
                <td className="py-4 px-4 text-amber-400/90">{asset.viewBox}</td>
                <td className="py-4 px-4 text-neutral-300">
                  {asset.widthMm} × {asset.heightMm}
                </td>
                <td className="py-4 px-4 text-neutral-400">{asset.aspectRatio}</td>
                <td className="py-4 px-4 text-neutral-300">
                  {(asset.fileSizeBytes / 1024).toFixed(2)} KB
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => downloadSvg(asset)}
                      title="Download SVG"
                      className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <button
                      onClick={() => onOpenCode(asset)}
                      title="View SVG Code"
                      className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vector Geometry & Origin Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Single Composite Path</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            All 5 graphics are crafted as continuous, closed geometric paths with nonzero winding rule for infinite resolution and zero rendering artifacts.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Industrial Distressed Finish</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            The letterforms and sygnet edges feature authentic micro-distressed erosion detailing reminiscent of forged cast iron and hot-rolled steel.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Bilingual Brand Identity</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            Full support for both English (Forge) and Polish (Kuźnia) diacritic typography alongside the universal sygnet mark.
          </p>
        </div>
      </div>
    </div>
  );
};
