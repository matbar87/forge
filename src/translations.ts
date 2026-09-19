export type Language = 'pl' | 'en';

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  type?: 'session' | 'meal' | 'break' | 'activity';
}

export interface DaySchedule {
  date: string;
  dayName: string;
  theme: string;
  items: ScheduleItem[];
}

export const translations = {
  pl: {
    nav: {
      start: 'Start',
      about: 'Męski Wyjazd',
      registration: 'Rejestracja',
      schedule: 'Plan',
      location: 'Miejsce',
      registerBtn: 'Zarejestruj się',
    },
    hero: {
      date: '12 – 14 LISTOPADA 2026',
      tagline: 'Czas, który hartuje charakter. Trzy dni braterstwa, wyzwań i głębokich rozmów.',
      registerCta: 'Zarejestruj się',
      explorePlan: 'Zobacz Plan',
      scrollDown: 'Przewiń w dół',
    },
    about: {
      badge: 'O WYDARZENIU',
      title: 'Męski Wyjazd',
      quote: '„Jak żelazo żelazem się ostrzy, tak człowiek zaostrza oblicze swego przyjaciela.”',
      lead: 'Zatrzymaj się w biegu. Opuść na chwilę codzienny szum i wejdź do przestrzeni, w której buduje się męski charakter.',
      descriptionParagraph1:
        'To nie jest kolejna bierna konferencja w garniturach ani zwykły weekend poza domem. Kuźnia to intensywne, autentyczne spotkanie mężczyzn, którzy chcą wzrastać w odpowiedzialności, odwadze, relacjach i wierze.',
      descriptionParagraph2:
        'Trzy dni w gronie facetów gotowych mówić prawdę, stawiać czoła wyzwaniom i wspierać się nawzajem. Czas na fizyczne zmęczenie, głębokie warsztaty, męskie rozmowy przy ognisku i momenty prawdziwego wyciszenia.',
      stats: [
        { value: '3 DNI', label: 'Formacji i integracji' },
        { value: '100%', label: 'Męskiej autentyczności' },
        { value: 'Limit', label: 'Ograniczona liczba miejsc' },
      ],
      galleryTitle: 'Galeria',
      gallerySubtitle: 'Poczuj klimat wyjazdu — braterstwo, natura, praca nad sobą i wspólny czas.',
      galleryNotice: 'Galeria 8 kadrów — kliknij dowolne zdjęcie, aby powiększyć.',
    },
    registration: {
      badge: 'DOŁĄCZ DO NAS',
      title: 'Rejestracja',
      subtitle: 'Wybierz odpowiednią opcję dla siebie. Liczba miejsc w ośrodku jest ściśle limitowana.',
      individual: {
        title: 'Rejestracja Indywidualna',
        badge: 'POJEDYNCZY UCZESTNIK',
        description: 'Dla każdego mężczyzny, który przyjeżdża sam lub ze znajomym i chce dołączyć do wspólnoty.',
        price: '690 zł',
        priceSub: '/ osoba',
        features: [
          'Pełne wyżywienie przez cały czas trwania wyjazdu (3 posiłki dziennie)',
          '2 noclegi w komfortowych pokojach ośrodka',
          'Udział we wszystkich sesjach plenarnych, warsztatach i panelach',
          'Wieczorne ognisko z pieczeniem kiełbas i integracją',
          'Pakiet powitalny uczestnika Kuźni',
          'Dostęp do strefy regeneracji i sauny',
        ],
        cta: 'Przejdź do formularza',
        note: 'Przekierowanie do zewnętrznego formularza zgłoszeniowego',
      },
      group: {
        title: 'Rejestracja Grupowa',
        badge: 'DLA GRUP OD 5 OSÓB',
        popularBadge: 'REKOMENDOWANA',
        description: 'Dla grup ze wspólnot, męskich kręgów, przyjaciół lub zespołów, którzy chcą przeżyć ten czas razem.',
        price: '590 zł',
        priceSub: '/ osoba w grupie (min. 5 os.)',
        features: [
          'Wszystkie świadczenia z pakietu indywidualnego',
          'Zniżka grupowa — 100 zł oszczędności na każdym uczestniku',
          'Preferencyjne zakwaterowanie całej grupy w sąsiadujących pokojach',
          'Dedykowana przestrzeń i czas na spotkanie we własnym gronie',
          'Indywidualne wsparcie koordynatora grupy przed wyjazdem',
          'Wspólna faktura lub rozliczenie grupowe na życzenie',
        ],
        cta: 'Zgłoś grupę',
        note: 'Przekierowanie do zewnętrznego formularza dla liderów grup',
      },
      faqPrompt: 'Masz pytania dotyczące płatności, faktur lub dojazdu?',
      faqContact: 'Napisz do nas: kontakt@kuznia.pl',
    },
    schedule: {
      badge: 'HARMONOGRAM',
      title: 'Plan Wyjazdu',
      subtitle: 'Trzy intensywne dni zaprojektowane z myślą o równowadze między treścią, działaniem i odpoczynkiem.',
      days: [
        {
          date: '12 Listopada (Piątek)',
          dayName: 'Dzień 1',
          theme: 'Przybycie & Rozpalenie Ognia',
          items: [
            { time: '16:00 – 18:00', title: 'Przyjazd i rejestracja', description: 'Zakwaterowanie w pokojach, odbiór pakietów powitalnych i powitalna kawa.', type: 'break' },
            { time: '18:30 – 19:30', title: 'Kolacja powitalna', description: 'Ciepły posiłek i pierwsze rozmowy przy stołach.', type: 'meal' },
            { time: '19:45 – 21:15', title: 'Sesja Otwierająca: Wejście do Kuźni', description: 'Wprowadzenie w temat wyjazdu, zdefiniowanie celu i męskiego kierunku.', type: 'session' },
            { time: '21:30 – późna noc', title: 'Wielkie Ognisko Braterskie', description: 'Kiełbasy, męskie rozmowy, śpiew i integracja pod gwiazdami.', type: 'activity' },
          ],
        },
        {
          date: '13 Listopada (Sobota)',
          dayName: 'Dzień 2',
          theme: 'Hartowanie Stali — Dzień Wyzwań i Głębi',
          items: [
            { time: '07:30 – 08:15', title: 'Męski Rozruch / Czas w ciszy', description: 'Opcjonalny poranny trening na świeżym powietrzu lub indywidualna medytacja.', type: 'activity' },
            { time: '08:30 – 09:30', title: 'Śniadanie Wojowników', description: 'Pożywne śniadanie dające siłę na cały dzień.', type: 'meal' },
            { time: '10:00 – 11:30', title: 'Sesja II: Prawda o Mężczyźnie', description: 'Wykład i konfrontacja z kluczowymi tematami: odpowiedzialność, relacje, charakter.', type: 'session' },
            { time: '11:45 – 13:00', title: 'Praca w małych grupach', description: 'Szczere rozmowy w stałych grupach zaufania.', type: 'session' },
            { time: '13:30 – 14:30', title: 'Obiad', description: 'Dwudaniowy obiad regeneracyjny.', type: 'meal' },
            { time: '14:30 – 17:30', title: 'Wyprawa terenowa & Wyzwanie zespołowe', description: 'Działania na świeżym powietrzu, praca zespołowa i sprawdzian hartu ducha.', type: 'activity' },
            { time: '18:00 – 19:00', title: 'Kolacja', description: 'Ciepły posiłek.', type: 'meal' },
            { time: '19:30 – 21:30', title: 'Sesja Wieczorna: Przełamanie i Oczyszczenie', description: 'Mocne świadectwa, refleksja i czas braterskiego wsparcia.', type: 'session' },
            { time: '21:45 – do oporu', title: 'Męski wieczór: sauna, rozmowy, relaks', description: 'Czas wolny na odpoczynek, regenerację i pogłębianie relacji.', type: 'break' },
          ],
        },
        {
          date: '14 Listopada (Niedziela)',
          dayName: 'Dzień 3',
          theme: 'Wykucie & Powrót do Świata',
          items: [
            { time: '08:00 – 09:00', title: 'Śniadanie', description: 'Wspólny poranny posiłek.', type: 'meal' },
            { time: '09:30 – 11:00', title: 'Sesja Finałowa: Z Kuźni do Codzienności', description: 'Jak przenieść wykuty ogień do domu, pracy, małżeństwa i ojcostwa.', type: 'session' },
            { time: '11:15 – 12:30', title: 'Podsumowanie & Zakończenie', description: 'Podsumowanie, wymiana kontaktów i uroczyste zakończenie wyjazdu.', type: 'session' },
            { time: '13:00 – 14:00', title: 'Obiad pożegnalny i wyjazd', description: 'Ostatni wspólny posiłek przed powrotem do domu.', type: 'meal' },
          ],
        },
      ],
    },
    location: {
      badge: 'MIEJSCE',
      title: 'Ośrodek i Przestrzeń',
      subtitle: 'Przestrzeń stworzona do wyciszenia, skupienia i męskich zmagań w otoczeniu natury.',
      venueTitle: 'Ośrodek Rekolekcyjno-Szkoleniowy',
      region: 'Ośrodek w Otoczeniu Lasu, Polska',
      description:
        'Ośrodek położony jest z dala od miejskiego zgiełku, w bezpośrednim sąsiedztwie lasu i natury. Zapewnia naszej grupie pełną prywatność i swobodę. Do dyspozycji uczestników oddajemy salę spotkań, zadaszone miejsce na duże ognisko, strefę saun oraz bezpieczny parking.',
      amenities: [
        { label: 'Pokoje z łazienkami', desc: 'Wygodne pokoje 2, 3 i 4-osobowe' },
        { label: 'Domowa kuchnia', desc: 'Świeże, pożywne posiłki przygotowywane na miejscu' },
        { label: 'Strefa Ogniskowa', desc: 'Duża zadaszona chata grillowa na wieczorne spotkania' },
        { label: 'Otoczenie lasu', desc: 'Bezpośrednie sąsiedztwo natury i ścieżek spacerowych' },
        { label: 'Sauna i Regeneracja', desc: 'Możliwość odpoczynku po aktywnym dniu' },
        { label: 'Prywatny parking', desc: 'Duży, bezpłatny parking dla wszystkich aut' },
      ],
      transportInfo: 'Szczegółowy adres z pinezką GPS oraz wskazówki dojazdu zostaną przesłane zarejestrowanym uczestnikom drogą mailową przed wyjazdem.',
      mapsButton: 'Otwórz wskazówki dojazdu',
    },
    footer: {
      rights: 'Wszelkie prawa zastrzeżone.',
      questions: 'Pytania dotyczące wyjazdu?',
      email: 'kontakt@kuznia.pl',
      nav: 'Nawigacja',
      top: 'Do góry',
    },
  },
  en: {
    nav: {
      start: 'Home',
      about: "Men's Camp",
      registration: 'Registration',
      schedule: 'Schedule',
      location: 'Location',
      registerBtn: 'Register Now',
    },
    hero: {
      date: 'NOVEMBER 12 – 14, 2026',
      tagline: 'A time that tempers character. Three days of brotherhood, challenges, and deep conversations.',
      registerCta: 'Register Now',
      explorePlan: 'View Schedule',
      scrollDown: 'Scroll down',
    },
    about: {
      badge: 'ABOUT THE EVENT',
      title: "Men's Camp",
      quote: '"As iron sharpens iron, so one person sharpens another."',
      lead: 'Step away from the daily grind. Leave the noise behind and enter an environment forged to strengthen character.',
      descriptionParagraph1:
        'This is not another passive conference in business suits or a casual weekend away. Forge is an intense, authentic gathering of men who want to grow in responsibility, courage, relationships, and faith.',
      descriptionParagraph2:
        'Three days shoulder-to-shoulder with men ready to speak truth, confront real challenges, and lift one another up. Physical exertion, impactful workshops, deep fireside discussions, and quiet contemplation.',
      stats: [
        { value: '3 DAYS', label: 'Formation & Brotherhood' },
        { value: '100%', label: 'Authentic Men' },
        { value: 'Limited', label: 'Restricted capacity' },
      ],
      galleryTitle: 'Photo Gallery',
      gallerySubtitle: 'Feel the atmosphere — brotherhood, nature, personal growth, and shared moments.',
      galleryNotice: '8 curated photos — click any image to enlarge.',
    },
    registration: {
      badge: 'JOIN US',
      title: 'Registration',
      subtitle: 'Choose your registration type. Venue capacity is strictly limited.',
      individual: {
        title: 'Individual Registration',
        badge: 'SOLO ATTENDEE',
        description: 'For every man arriving solo or with a friend, ready to plug into the brotherhood.',
        price: '690 PLN',
        priceSub: '/ person (~$175 USD)',
        features: [
          'Full board throughout the camp (3 hearty meals daily)',
          '2 nights accommodation in comfortable camp rooms',
          'Full access to all keynote sessions, workshops, and panels',
          'Evening bonfire cookout, camaraderie, and fellowship',
          'Forge attendee welcome kit and journal',
          'Access to relaxation zone and Finnish sauna',
        ],
        cta: 'Go to Registration Form',
        note: 'Redirects to secure external registration form',
      },
      group: {
        title: 'Group Registration',
        badge: 'FOR GROUPS OF 5+ MEN',
        popularBadge: 'RECOMMENDED',
        description: 'For church fellowships, men’s circles, teams, or groups of friends wanting to experience this together.',
        price: '590 PLN',
        priceSub: '/ person in group (min. 5)',
        features: [
          'All benefits included in the individual package',
          'Group discount — 100 PLN savings per attendee',
          'Priority room allocation keeping your group together',
          'Dedicated breakout space and time for your group discussions',
          'Dedicated support from the camp coordinator',
          'Single group invoice and billing available upon request',
        ],
        cta: 'Register Group',
        note: 'Redirects to secure external leader registration form',
      },
      faqPrompt: 'Have questions about payments, group invoicing, or travel?',
      faqContact: 'Reach us at: kontakt@kuznia.pl',
    },
    schedule: {
      badge: 'AGENDA',
      title: 'Camp Schedule',
      subtitle: 'Three focused days designed to balance depth, physical exertion, and fellowship.',
      days: [
        {
          date: 'November 12 (Friday)',
          dayName: 'Day 1',
          theme: 'Arrival & Kindling the Fire',
          items: [
            { time: '16:00 – 18:00', title: 'Arrival & Check-in', description: 'Room check-in, registration kit pickup, and welcome refreshments.', type: 'break' },
            { time: '18:30 – 19:30', title: 'Welcome Dinner', description: 'Hot meal and first conversations across the tables.', type: 'meal' },
            { time: '19:45 – 21:15', title: 'Opening Session: Entering the Forge', description: 'Setting camp purpose, brotherhood expectations, and direction.', type: 'session' },
            { time: '21:30 – Late Night', title: 'The Great Brotherhood Fire', description: 'Cookout, honest stories, acoustic music, and starry night fellowship.', type: 'activity' },
          ],
        },
        {
          date: 'November 13 (Saturday)',
          dayName: 'Day 2',
          theme: 'Tempering Steel — A Day of Challenge and Depth',
          items: [
            { time: '07:30 – 08:15', title: 'Morning Physical Warmup / Solitude', description: 'Optional brisk workout in fresh air or silent personal reflection.', type: 'activity' },
            { time: '08:30 – 09:30', title: "Warrior's Breakfast", description: 'Nutritious breakfast fueling the day ahead.', type: 'meal' },
            { time: '10:00 – 11:30', title: 'Session II: The Truth About a Man', description: 'Keynote on core realities: responsibility, character, family, and grit.', type: 'session' },
            { time: '11:45 – 13:00', title: 'Small Group Breakouts', description: 'Vulnerable and honest dialogue in trusted circles.', type: 'session' },
            { time: '13:30 – 14:30', title: 'Lunch', description: 'Two-course restorative lunch.', type: 'meal' },
            { time: '14:30 – 17:30', title: 'Outdoor Challenge & Team Task', description: 'Outdoor teamwork challenge, coordination, and character test.', type: 'activity' },
            { time: '18:00 – 19:00', title: 'Dinner', description: 'Hot dinner.', type: 'meal' },
            { time: '19:30 – 21:30', title: 'Evening Encounter: Breakthrough & Renewal', description: 'Impactful testimonies, reflection, and brotherly support.', type: 'session' },
            { time: '21:45 – Late', title: 'Open Evening: Sauna, Discussions & Relaxation', description: 'Free time to decompress, sauna, and deepen friendships.', type: 'break' },
          ],
        },
        {
          date: 'November 14 (Sunday)',
          dayName: 'Day 3',
          theme: 'Forged & Commissioned to the World',
          items: [
            { time: '08:00 – 09:00', title: 'Breakfast', description: 'Communal breakfast.', type: 'meal' },
            { time: '09:30 – 11:00', title: 'Final Session: From the Forge to Everyday Life', description: 'Bringing the tempered fire home to marriage, fatherhood, and work.', type: 'session' },
            { time: '11:15 – 12:30', title: 'Debrief & Commissioning Blessing', description: 'Closing reflections, contact exchange, and official conclusion.', type: 'session' },
            { time: '13:00 – 14:00', title: 'Farewell Lunch & Departure', description: 'Final meal together before traveling home.', type: 'meal' },
          ],
        },
      ],
    },
    location: {
      badge: 'VENUE',
      title: 'The Location & Sanctuary',
      subtitle: 'A setting designed for seclusion, clarity, and camaraderie in the heart of nature.',
      venueTitle: 'Forest Camp & Retreat Center',
      region: 'Nature Sanctuary, Poland',
      description:
        'Nestled away from urban bustle and surrounded by dense peaceful forest, the center provides complete privacy for our group. Facilities include a dedicated gathering hall, an enclosed timber fire pit pavilion, relaxation saunas, and generous parking.',
      amenities: [
        { label: 'Ensuite Rooms', desc: 'Comfortable 2, 3, and 4-person rooms' },
        { label: 'Home Cooked Meals', desc: 'Fresh, nutritious meals prepared on site' },
        { label: 'Sheltered Fire Pit', desc: 'Large timber pavilion for late-night bonfires' },
        { label: 'Forest Trails', desc: 'Immediate direct access into peaceful woods' },
        { label: 'Sauna & Recovery', desc: 'Relax and recharge after active outdoor sessions' },
        { label: 'Private Parking', desc: 'Ample on-site secure parking for all cars' },
      ],
      transportInfo: 'Exact venue address with GPS pin and travel recommendations will be delivered to confirmed attendees via email.',
      mapsButton: 'Open Driving Directions',
    },
    footer: {
      rights: 'All rights reserved.',
      questions: 'Questions about the camp?',
      email: 'kontakt@kuznia.pl',
      nav: 'Navigation',
      top: 'Back to Top',
    },
  },
};
