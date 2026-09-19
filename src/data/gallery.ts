export interface GalleryImage {
  id: number;
  url: string;
  titlePl: string;
  titleEn: string;
  categoryPl: string;
  categoryEn: string;
  alt: string;
}

/**
 * 8 high-resolution curated photos representing the retreat vibe.
 * You can easily replace the 'url' with your own 8 photos (or local filenames in /public/).
 */
export const RETREAT_GALLERY: GalleryImage[] = [
  {
    id: 1,
    url: './1.webp',
    titlePl: 'Kadr 01',
    titleEn: 'Photo 01',
    categoryPl: 'Wyjazd',
    categoryEn: 'Retreat',
    alt: 'Kuźnia - kadr 01',
  },
  {
    id: 2,
    url: './2.webp',
    titlePl: 'Kadr 02',
    titleEn: 'Photo 02',
    categoryPl: 'Wyjazd',
    categoryEn: 'Retreat',
    alt: 'Kuźnia - kadr 02',
  },
  {
    id: 3,
    url: './3.webp',
    titlePl: 'Kadr 03',
    titleEn: 'Photo 03',
    categoryPl: 'Wyjazd',
    categoryEn: 'Retreat',
    alt: 'Kuźnia - kadr 03',
  },
  {
    id: 4,
    url: './4.webp',
    titlePl: 'Kadr 04',
    titleEn: 'Photo 04',
    categoryPl: 'Wyjazd',
    categoryEn: 'Retreat',
    alt: 'Kuźnia - kadr 04',
  },
  {
    id: 5,
    url: './5.webp',
    titlePl: 'Kadr 05',
    titleEn: 'Photo 05',
    categoryPl: 'Wyjazd',
    categoryEn: 'Retreat',
    alt: 'Kuźnia - kadr 05',
  },
  {
    id: 6,
    url: './6.webp',
    titlePl: 'Kadr 06',
    titleEn: 'Photo 06',
    categoryPl: 'Wyjazd',
    categoryEn: 'Retreat',
    alt: 'Kuźnia - kadr 06',
  },
];
