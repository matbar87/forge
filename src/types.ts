export interface BrandAsset {
  id: string;
  name: string;
  polishName: string;
  filename: string;
  category: 'logo' | 'logotype' | 'mark';
  description: string;
  viewBox: string;
  widthMm: string;
  heightMm: string;
  fileSizeBytes: number;
  originalFill: string;
  hasSygnet: boolean;
  language: 'en' | 'pl' | 'mark';
  aspectRatio: string;
  rawSvg: string;
}

export type BackgroundStyle = 'dark' | 'pitch' | 'light' | 'paper' | 'ember' | 'steel' | 'transparent-dark' | 'transparent-light';

export interface ColorPreset {
  name: string;
  hex: string;
  textClass: string;
}
