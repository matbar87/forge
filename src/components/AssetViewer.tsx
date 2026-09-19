import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Code,
  Check,
  Copy,
  Sliders,
  Palette,
  Maximize2,
  Image as ImageIcon,
  Sparkles,
  Info,
} from 'lucide-react';
import { BrandAssetWithSvg, COLOR_PRESETS } from '../data/assets';
import { BackgroundStyle } from '../types';
import { downloadSvg, downloadPng } from '../utils/exportUtils';

interface AssetViewerProps {
  asset: BrandAssetWithSvg;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  backgroundStyle: BackgroundStyle;
  setBackgroundStyle: (style: BackgroundStyle) => void;
  onOpenCode: (asset: BrandAssetWithSvg) => void;
}

export const AssetViewer: React.FC<AssetViewerProps> = ({
  asset,
  currentColor,
  setCurrentColor,
  backgroundStyle,
  setBackgroundStyle,
  onOpenCode,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [pngResolution, setPngResolution] = useState<number>(2048);
  const [pngBg, setPngBg] = useState<'transparent' | 'match'>('transparent');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const getCanvasBgHex = () => {
    switch (backgroundStyle) {
      case 'pitch':
        return '#000000';
      case 'dark':
        return '#171717';
      case 'light':
        return '#f5f5f5';
      case 'paper':
        return '#f4efe6';
      case 'ember':
        return '#1c0e07';
      case 'steel':
        return '#0f172a';
      default:
        return undefined;
    }
  };

  const handleExportPng = async () => {
    setIsExporting(true);
    try {
      const bg = pngBg === 'match' ? getCanvasBgHex() : undefined;
      await downloadPng(asset, pngResolution, currentColor, bg);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySvg = () => {
    let tintedSvg = asset.rawSvg;
    if (currentColor && currentColor.toLowerCase() !== asset.originalFill.toLowerCase()) {
      tintedSvg = tintedSvg.replace(/fill:#E3E6DB/gi, `fill:${currentColor}`);
      tintedSvg = tintedSvg.replace(/fill="#E3E6DB"/gi, `fill="${currentColor}"`);
    }
    navigator.clipboard.writeText(tintedSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-neutral-800 bg-neutral-950/70">
        {/* Asset Title & Category */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-neutral-100">{asset.name}</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {asset.category}
              </span>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {asset.filename} • {asset.polishName}
            </span>
          </div>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-900 rounded-lg border border-neutral-800 p-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 25, 25))}
              title="Zoom out"
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-neutral-300 w-12 text-center select-none">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 25, 300))}
              title="Zoom in"
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              title="Reset Zoom"
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors border-l border-neutral-800 ml-1 pl-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onOpenCode(asset)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>Code & Snippets</span>
          </button>
        </div>
      </div>

      {/* Main Stage Grid (Left: Preview Canvas, Right: Customizer & Exporter) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Preview Canvas Area */}
        <div
          className={`lg:col-span-8 relative flex items-center justify-center p-8 transition-colors ${getBgClass()} overflow-hidden min-h-[360px]`}
        >
          {/* Scaled SVG Container */}
          <div
            className="transition-transform duration-200 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <svg
              viewBox={asset.viewBox}
              className="max-w-[85%] max-h-[380px] drop-shadow-md select-none transition-colors duration-200"
              style={{ fill: currentColor }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={asset.pathD} />
            </svg>
          </div>

          {/* Quick Corner Floating Copy Badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={handleCopySvg}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-900 text-neutral-200 text-xs font-mono border border-neutral-700/80 backdrop-blur-md transition-all shadow-md active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied SVG</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Copy SVG</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Configuration & Export Sidebar */}
        <div className="lg:col-span-4 p-5 bg-neutral-950/80 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Color Tint Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  Vector Fill Tint
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border border-neutral-700 bg-transparent"
                  />
                  <code className="text-xs font-mono text-neutral-300">{currentColor}</code>
                </div>
              </div>

              {/* Preset Swatches */}
              <div className="grid grid-cols-4 gap-1.5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => setCurrentColor(preset.hex)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-mono transition-all ${
                      currentColor.toLowerCase() === preset.hex.toLowerCase()
                        ? 'border-amber-500 bg-amber-500/10 text-neutral-100 font-semibold shadow-sm'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/40 shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="truncate">{preset.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Theme Switcher */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Canvas Background
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'dark', label: 'Dark Iron' },
                  { id: 'pitch', label: 'Pitch Black' },
                  { id: 'light', label: 'Clean Light' },
                  { id: 'paper', label: 'Warm Paper' },
                  { id: 'steel', label: 'Steel Navy' },
                  { id: 'ember', label: 'Deep Ember' },
                  { id: 'transparent-dark', label: 'Checker (D)' },
                  { id: 'transparent-light', label: 'Checker (L)' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBackgroundStyle(bg.id as BackgroundStyle)}
                    className={`px-2 py-1.5 rounded-md text-[11px] font-medium border text-center transition-all ${
                      backgroundStyle === bg.id
                        ? 'border-amber-500 bg-amber-500/10 text-neutral-100 shadow-sm'
                        : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vector Specs Breakdown */}
            <div className="bg-neutral-900/60 rounded-xl p-3 border border-neutral-800/80 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2 font-semibold">
                Technical Specifications
              </span>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 font-mono text-[11px]">
                <div>
                  <span className="text-neutral-400 block text-[10px]">ViewBox</span>
                  <span className="text-neutral-200">{asset.viewBox}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Physical Size</span>
                  <span className="text-neutral-200">{asset.widthMm} × {asset.heightMm}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Aspect Ratio</span>
                  <span className="text-neutral-200">{asset.aspectRatio}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">File Size</span>
                  <span className="text-neutral-200">{(asset.fileSizeBytes / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Center */}
          <div className="pt-4 border-t border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-300">Export Asset</span>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <button
                  onClick={() => setPngBg(pngBg === 'transparent' ? 'match' : 'transparent')}
                  className={`px-2 py-0.5 rounded border text-[10px] ${
                    pngBg === 'transparent'
                      ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                      : 'border-neutral-700 text-neutral-400'
                  }`}
                >
                  {pngBg === 'transparent' ? 'Transparent PNG' : 'Filled BG'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '512px', val: 512 },
                { label: '1024px', val: 1024 },
                { label: '2048px (2K)', val: 2048 },
                { label: '4096px (4K)', val: 4096 },
              ].map((res) => (
                <button
                  key={res.val}
                  onClick={() => setPngResolution(res.val)}
                  className={`py-1 rounded text-[10px] font-mono border text-center transition-all ${
                    pngResolution === res.val
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {res.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-download-vector-svg"
                onClick={() => downloadSvg(asset, currentColor)}
                className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold border border-neutral-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download SVG</span>
              </button>

              <button
                id="btn-download-raster-png"
                onClick={handleExportPng}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{isExporting ? 'Rendering...' : 'Export PNG'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
