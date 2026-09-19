import React, { useState } from 'react';
import { Download, Code, Eye, FileCode, Check, Copy, Image as ImageIcon } from 'lucide-react';
import { BrandAssetWithSvg } from '../data/assets';
import { BackgroundStyle } from '../types';
import { downloadSvg, downloadPng } from '../utils/exportUtils';

interface AssetCardProps {
  asset: BrandAssetWithSvg;
  onSelect: (asset: BrandAssetWithSvg) => void;
  onOpenCode: (asset: BrandAssetWithSvg) => void;
  currentColor: string;
  backgroundStyle: BackgroundStyle;
  isSelected: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onSelect,
  onOpenCode,
  currentColor,
  backgroundStyle,
  isSelected,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const getBgClass = () => {
    switch (backgroundStyle) {
      case 'dark':
        return 'bg-neutral-900';
      case 'pitch':
        return 'bg-black';
      case 'light':
        return 'bg-neutral-100';
      case 'paper':
        return 'bg-[#f4efe6]';
      case 'ember':
        return 'bg-[#1c0e07]';
      case 'steel':
        return 'bg-[#0f172a]';
      case 'transparent-dark':
        return 'bg-transparency-grid';
      case 'transparent-light':
        return 'bg-transparency-grid-light';
      default:
        return 'bg-neutral-900';
    }
  };

  const handleCopySvg = (e: React.MouseEvent) => {
    e.stopPropagation();
    let tintedSvg = asset.rawSvg;
    if (currentColor && currentColor.toLowerCase() !== asset.originalFill.toLowerCase()) {
      tintedSvg = tintedSvg.replace(/fill:#E3E6DB/gi, `fill:${currentColor}`);
      tintedSvg = tintedSvg.replace(/fill="#E3E6DB"/gi, `fill="${currentColor}"`);
    }
    navigator.clipboard.writeText(tintedSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadPngQuick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExporting(true);
    try {
      await downloadPng(asset, 2048, currentColor, 'transparent');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      id={`asset-card-${asset.id}`}
      onClick={() => onSelect(asset)}
      className={`group relative flex flex-col rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-500/20 bg-neutral-900/90 shadow-xl'
          : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900'
      }`}
    >
      {/* Visual Canvas Box */}
      <div
        className={`relative w-full h-56 flex items-center justify-center p-8 transition-colors ${getBgClass()} border-b border-neutral-800/80 overflow-hidden`}
      >
        <svg
          viewBox={asset.viewBox}
          className="max-h-full max-w-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          style={{ fill: currentColor }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={asset.pathD} />
        </svg>

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            title="Inspect in workbench"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(asset);
            }}
            className="p-1.5 rounded-md bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs shadow-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            title="Copy SVG code"
            onClick={handleCopySvg}
            className="p-1.5 rounded-md bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs shadow-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-neutral-300 border border-neutral-700/50">
            {asset.category}
          </span>
          {asset.language === 'pl' && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/50">
              PL
            </span>
          )}
          {asset.language === 'en' && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50">
              EN
            </span>
          )}
        </div>
      </div>

      {/* Info & Metadata */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-neutral-100 text-sm group-hover:text-amber-400 transition-colors">
              {asset.name}
            </h4>
            <span className="text-[11px] font-mono text-neutral-400 shrink-0">
              {(asset.fileSizeBytes / 1024).toFixed(1)} KB
            </span>
          </div>
          <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
            {asset.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400 bg-neutral-950/60 p-2 rounded-lg border border-neutral-800/60 mb-3">
            <div>
              <span className="text-neutral-400 block text-[10px]">VIEWBOX</span>
              <span className="text-neutral-200 truncate block">{asset.viewBox}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">DIMENSIONS</span>
              <span className="text-neutral-200 truncate block">{asset.widthMm} × {asset.heightMm}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-800/60">
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadSvg(asset, currentColor);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>SVG</span>
          </button>

          <button
            onClick={handleDownloadPngQuick}
            disabled={isExporting}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>{isExporting ? 'PNG...' : 'PNG (2K)'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCode(asset);
            }}
            title="Inspect SVG & React code"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
