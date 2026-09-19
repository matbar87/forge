import { BrandAssetWithSvg } from '../data/assets';

/**
 * Downloads a string as a file in the browser
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the asset as an SVG file, optionally tinted with a custom color
 */
export function downloadSvg(asset: BrandAssetWithSvg, customColor?: string) {
  let svgContent = asset.rawSvg;
  if (customColor && customColor.toLowerCase() !== asset.originalFill.toLowerCase()) {
    // Replace fill in style block or attributes
    svgContent = svgContent.replace(/fill:#E3E6DB/gi, `fill:${customColor}`);
    svgContent = svgContent.replace(/fill="#E3E6DB"/gi, `fill="${customColor}"`);
  }
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const filename = customColor ? `${asset.id}-${customColor.replace('#', '')}.svg` : asset.filename;
  downloadBlob(blob, filename);
}

/**
 * Renders the SVG onto an offscreen canvas and downloads as high-resolution PNG
 */
export async function downloadPng(
  asset: BrandAssetWithSvg,
  resolution: number = 2048,
  customColor?: string,
  backgroundColor?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    let svgContent = asset.rawSvg;
    if (customColor) {
      svgContent = svgContent.replace(/fill:#E3E6DB/gi, `fill:${customColor}`);
      svgContent = svgContent.replace(/fill="#E3E6DB"/gi, `fill="${customColor}"`);
    }

    // Parse viewBox to calculate proper aspect ratio
    const [, , vbWidth, vbHeight] = asset.viewBox.split(' ').map(Number);
    const aspect = vbWidth / vbHeight;

    let targetWidth = resolution;
    let targetHeight = Math.round(resolution / aspect);
    if (aspect < 1) {
      targetHeight = resolution;
      targetWidth = Math.round(resolution * aspect);
    }

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        if (backgroundColor && backgroundColor !== 'transparent') {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (blob) {
            downloadBlob(blob, `${asset.id}-${targetWidth}x${targetHeight}.png`);
            resolve();
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Generates ready-to-use React JSX component string
 */
export function getReactComponentCode(asset: BrandAssetWithSvg, componentName: string = 'ForgeLogo'): string {
  return `import React from 'react';

export interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  size = '1em',
  color = 'currentColor',
  className = '',
  style,
  ...props
}) => (
  <svg
    viewBox="${asset.viewBox}"
    width={size}
    height={size}
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path fillRule="nonzero" d="${asset.pathD}" />
  </svg>
);

export default ${componentName};
`;
}
