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
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    titlePl: 'Poranek w Naturze i Wyciszenie',
    titleEn: 'Dawn in Nature & Quiet Reflection',
    categoryPl: 'Natura',
    categoryEn: 'Nature',
    alt: 'Forest landscape at sunrise',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    titlePl: 'Wieczorne Ognisko pod Gwiazdami',
    titleEn: 'Evening Campfire Under the Stars',
    categoryPl: 'Braterstwo',
    categoryEn: 'Brotherhood',
    alt: 'Campfire under a starry sky',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80',
    titlePl: 'Wyprawa Terenowa i Wyzwanie',
    titleEn: 'Outdoor Expedition & Challenge',
    categoryPl: 'Wyprawa',
    categoryEn: 'Expedition',
    alt: 'Men hiking outdoors in wilderness',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1504221507732-5246c045949b?auto=format&fit=crop&w=1200&q=80',
    titlePl: 'Ogień i Kowadło',
    titleEn: 'Fire and the Anvil',
    categoryPl: 'Symbolika',
    categoryEn: 'Symbolism',
    alt: 'Blacksmith sparks and glowing iron',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
    titlePl: 'Braterskie Rozmowy',
    titleEn: 'Brotherhood Dialogue',
    categoryPl: 'Spotkanie',
    categoryEn: 'Gathering',
    alt: 'Men talking outdoors around shelter',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    titlePl: 'Ośrodek w Otoczeniu Lasu',
    titleEn: 'Sanctuary in the Forest',
    categoryPl: 'Ośrodek',
    categoryEn: 'Sanctuary',
    alt: 'Cabin lodge nestled in pine forest',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80',
    titlePl: 'Wspólny Czas i Odpoczynek',
    titleEn: 'Rest & Camaraderie',
    categoryPl: 'Relaks',
    categoryEn: 'Rest',
    alt: 'Camp gear and warm kettle over embers',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    titlePl: 'Męska Społeczność i Przełom',
    titleEn: 'Brotherhood & Breakthrough',
    categoryPl: 'Wspólnota',
    categoryEn: 'Brotherhood',
    alt: 'Pine trees and wilderness trail',
  },
];
