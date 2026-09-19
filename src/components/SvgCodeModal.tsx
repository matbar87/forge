import React, { useState } from 'react';
import { X, Copy, Check, Download, Code, FileText, Sparkles } from 'lucide-react';
import { BrandAssetWithSvg } from '../data/assets';
import { downloadSvg, getReactComponentCode } from '../utils/exportUtils';

interface SvgCodeModalProps {
  asset: BrandAssetWithSvg | null;
  onClose: () => void;
  currentColor: string;
}

export const SvgCodeModal: React.FC<SvgCodeModalProps> = ({
  asset,
  onClose,
  currentColor,
}) => {
  if (!asset) return null;

  const [activeSnippet, setActiveSnippet] = useState<'svg' | 'react' | 'datauri'>('svg');
  const [copied, setCopied] = useState(false);

  // Tinted SVG content
  let tintedSvg = asset.rawSvg;
  if (currentColor && currentColor.toLowerCase() !== asset.originalFill.toLowerCase()) {
    tintedSvg = tintedSvg.replace(/fill:#E3E6DB/gi, `fill:${currentColor}`);
    tintedSvg = tintedSvg.replace(/fill="#E3E6DB"/gi, `fill="${currentColor}"`);
  }

  // React Component name (e.g. ForgeLogo, KuzniaLogo)
  const componentName = asset.name.replace(/[^a-zA-Z0-9]/g, '');

  const getSnippetContent = () => {
    switch (activeSnippet) {
      case 'svg':
        return tintedSvg;
      case 'react':
        return getReactComponentCode(asset, componentName);
      case 'datauri': {
        const encoded = encodeURIComponent(tintedSvg)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22');
        return `data:image/svg+xml;utf8,${encoded}`;
      }
    }
  };

  const codeContent = getSnippetContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="svg-code-modal"
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-800 text-amber-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">{asset.name}</h3>
              <p className="text-xs text-neutral-400 font-mono">{asset.filename}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snippet Format Selector */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-neutral-950/60 border-b border-neutral-800/60">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveSnippet('svg')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeSnippet === 'svg'
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Raw SVG
            </button>
            <button
              onClick={() => setActiveSnippet('react')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeSnippet === 'react'
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              React TSX Component
            </button>
            <button
              onClick={() => setActiveSnippet('datauri')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeSnippet === 'datauri'
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              CSS Data URI
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>

            <button
              onClick={() => downloadSvg(asset, currentColor)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-medium transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 p-6 overflow-auto bg-neutral-950 font-mono text-xs text-neutral-300">
          <pre className="whitespace-pre-wrap break-all leading-relaxed select-all">
            {codeContent}
          </pre>
        </div>

        {/* Footer Meta */}
        <div className="px-6 py-3 bg-neutral-900 border-t border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
          <span>Current Fill: <code className="text-amber-400">{currentColor}</code></span>
          <span>ViewBox: <code className="text-neutral-300">{asset.viewBox}</code></span>
        </div>
      </div>
    </div>
  );
};
