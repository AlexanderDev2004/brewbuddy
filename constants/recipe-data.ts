import Constants from 'expo-constants';
import { Platform } from 'react-native';

export type RecipeInfo = {
  id: string;
  tab: string;
  breadcrumb: string;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
  ingredients: { name: string; amount: string }[];
  steps: { title: string; detail: string }[];
};

export type ApiBrewMethod =
  | 'V60'
  | 'JAPANESE_ICED'
  | 'AEROPRESS'
  | 'FRENCH_PRESS'
  | 'ESPRESSO'
  | 'OTHER';

export type ApiRecipe = {
  id: string;
  title: string;
  brewMethod: ApiBrewMethod;
  description: string;
  coffeeGrams: number;
  waterMl: number;
  grindSize: string;
  brewTimeSeconds: number;
  steps: string[];
  authorName: string | null;
};

const API_PORT = 3001;

const METHOD_LABELS: Record<ApiBrewMethod, string> = {
  V60: 'V60 Pour Over',
  JAPANESE_ICED: 'Japanese Iced',
  AEROPRESS: 'AeroPress',
  FRENCH_PRESS: 'French Press',
  ESPRESSO: 'Espresso',
  OTHER: 'Manual Brew',
};

const METHOD_DIFFICULTY: Record<ApiBrewMethod, string> = {
  V60: 'Menengah',
  JAPANESE_ICED: 'Menengah',
  AEROPRESS: 'Mudah',
  FRENCH_PRESS: 'Mudah',
  ESPRESSO: 'Menengah',
  OTHER: 'Pemula',
};

const METHOD_TEMPERATURE: Record<ApiBrewMethod, string> = {
  V60: '92C',
  JAPANESE_ICED: '93C',
  AEROPRESS: '90C',
  FRENCH_PRESS: '93C',
  ESPRESSO: '94C',
  OTHER: '90-93C',
};

export const FALLBACK_RECIPES: RecipeInfo[] = [
  {
    id: 'v60-default',
    tab: 'V60 Pour Over',
    breadcrumb: 'Resep Pemula',
    title: 'V60 Pour\nOver',
    description:
      'Teknik seduh manual yang menghasilkan kopi bersih, menonjolkan keasaman dan aroma floral dari biji kopi.',
    stats: [
      { label: 'Waktu', value: '3 Menit' },
      { label: 'Tingkat', value: 'Menengah' },
      { label: 'Rasio', value: '1:15' },
      { label: 'Suhu Air', value: '92C' },
    ],
    ingredients: [
      { name: 'Biji Kopi (Medium Fine)', amount: '15g' },
      { name: 'Air Panas', amount: '225ml' },
      { name: 'Kertas Filter V60', amount: '1 pcs' },
    ],
    steps: [
      {
        title: 'Bilas Filter',
        detail:
          'Letakkan filter di dripper V60. Tuang sedikit air panas untuk membasahi filter dan memanaskan alat.',
      },
      {
        title: 'Blooming',
        detail: 'Tuang 30ml air panas, lalu diamkan 45 detik agar gas CO2 keluar.',
      },
      {
        title: 'Tuangan Bertahap',
        detail: 'Tuang air perlahan sampai total 225ml, lalu tunggu sampai tetesan selesai.',
      },
    ],
  },
  {
    id: 'french-press-default',
    tab: 'French Press',
    breadcrumb: 'Resep Pemula',
    title: 'French\nPress',
    description:
      'Metode immersion yang simpel untuk menghasilkan body tebal dan rasa manis, cocok untuk pemula.',
    stats: [
      { label: 'Waktu', value: '4 Menit' },
      { label: 'Tingkat', value: 'Mudah' },
      { label: 'Rasio', value: '1:14' },
      { label: 'Suhu Air', value: '93C' },
    ],
    ingredients: [
      { name: 'Biji Kopi (Coarse)', amount: '18g' },
      { name: 'Air Panas', amount: '250ml' },
      { name: 'French Press', amount: '1 unit' },
    ],
    steps: [
      {
        title: 'Panaskan Alat',
        detail: 'Bilas French Press dengan air panas agar suhu seduh lebih stabil.',
      },
      {
        title: 'Tuang Air',
        detail: 'Masukkan kopi, tuang seluruh air panas, lalu aduk ringan 2-3 kali.',
      },
      {
        title: 'Press dan Sajikan',
        detail: 'Di menit ke-4 tekan plunger perlahan sampai dasar lalu segera tuang.',
      },
    ],
  },
  {
    id: 'aeropress-default',
    tab: 'AeroPress',
    breadcrumb: 'Resep Cepat',
    title: 'Aero\nPress',
    description:
      'Metode cepat dengan tekanan ringan. Hasil rasa seimbang dan mudah diulang untuk daily brew.',
    stats: [
      { label: 'Waktu', value: '2 Menit' },
      { label: 'Tingkat', value: 'Mudah' },
      { label: 'Rasio', value: '1:13' },
      { label: 'Suhu Air', value: '90C' },
    ],
    ingredients: [
      { name: 'Biji Kopi (Medium)', amount: '16g' },
      { name: 'Air Panas', amount: '210ml' },
      { name: 'Filter AeroPress', amount: '1 pcs' },
    ],
    steps: [
      {
        title: 'Siapkan AeroPress',
        detail: 'Bilas filter, pasang cap, lalu tempatkan AeroPress di atas server.',
      },
      {
        title: 'Tuang dan Aduk',
        detail: 'Tuang air panas, aduk 10 detik, lalu pasang plunger untuk membuat seal.',
      },
      {
        title: 'Press',
        detail: 'Setelah 1:30, tekan perlahan selama 30 detik sampai selesai.',
      },
    ],
  },
  {
    id: 'japanese-iced-default',
    tab: 'Japanese Iced',
    breadcrumb: 'Resep Segar',
    title: 'Japanese\nIced Coffee',
    description:
      'Pour over langsung ke es untuk rasa yang clean, bright, dan tetap manis tanpa watery.',
    stats: [
      { label: 'Waktu', value: '3 Menit' },
      { label: 'Tingkat', value: 'Menengah' },
      { label: 'Rasio', value: '1:15' },
      { label: 'Suhu Air', value: '93C' },
    ],
    ingredients: [
      { name: 'Biji Kopi (Medium Fine)', amount: '20g' },
      { name: 'Air Panas', amount: '180ml' },
      { name: 'Es Batu', amount: '120g' },
    ],
    steps: [
      {
        title: 'Siapkan Server Es',
        detail: 'Masukkan es ke server agar kopi panas langsung terkunci aromanya.',
      },
      {
        title: 'Blooming',
        detail: 'Tuang 40ml air panas dan tunggu 30 detik untuk membuka gas kopi.',
      },
      {
        title: 'Tuangan Akhir',
        detail: 'Lanjutkan tuang hingga total air 180ml lalu swirl sebelum disajikan.',
      },
    ],
  },
];

export const LEARN_MORE = ['Panduan Memilih Biji Kopi', 'Peralatan Wajib Pemula'];

function getHostFromExperienceUrl(experienceUrl: string | null | undefined): string | null {
  if (!experienceUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(experienceUrl);
    return parsedUrl.hostname || null;
  } catch {
    const hostPort = experienceUrl.replace(/^[a-z]+:\/\//i, '').split('/')[0] ?? '';
    const host = hostPort.split(':')[0];
    return host || null;
  }
}

export function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.platform?.hostUri;
  const hostFromHostUri = hostUri?.split(':')[0];
  const hostFromExperienceUrl = getHostFromExperienceUrl(Constants.experienceUrl);
  const host = hostFromHostUri ?? hostFromExperienceUrl;

  if (host) {
    return `http://${host}:${API_PORT}/api`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}/api`;
  }

  return `http://localhost:${API_PORT}/api`;
}

export function isAbortError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('name' in error)) {
    return false;
  }

  return (error as { name?: string }).name === 'AbortError';
}

function isApiBrewMethod(value: unknown): value is ApiBrewMethod {
  return (
    value === 'V60' ||
    value === 'JAPANESE_ICED' ||
    value === 'AEROPRESS' ||
    value === 'FRENCH_PRESS' ||
    value === 'ESPRESSO' ||
    value === 'OTHER'
  );
}

export function isApiRecipe(value: unknown): value is ApiRecipe {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<ApiRecipe>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    isApiBrewMethod(candidate.brewMethod) &&
    typeof candidate.description === 'string' &&
    typeof candidate.coffeeGrams === 'number' &&
    typeof candidate.waterMl === 'number' &&
    typeof candidate.grindSize === 'string' &&
    typeof candidate.brewTimeSeconds === 'number' &&
    Array.isArray(candidate.steps)
  );
}

function formatBrewTime(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} Menit`;
}

function formatRatio(coffeeGrams: number, waterMl: number): string {
  if (coffeeGrams <= 0) {
    return '1:15';
  }

  return `1:${Math.max(1, Math.round(waterMl / coffeeGrams))}`;
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function parseStepText(stepText: string, index: number): { title: string; detail: string } {
  const trimmedText = stepText.trim();
  const separatorIndex = trimmedText.indexOf(':');

  if (separatorIndex > 0 && separatorIndex <= 30) {
    const title = trimmedText.slice(0, separatorIndex).trim();
    const detail = trimmedText.slice(separatorIndex + 1).trim();

    if (title.length > 0 && detail.length > 0) {
      return { title, detail };
    }
  }

  return {
    title: `Langkah ${index + 1}`,
    detail: trimmedText,
  };
}

export function mapRecipeToUI(recipe: ApiRecipe): RecipeInfo {
  const methodLabel = METHOD_LABELS[recipe.brewMethod] ?? toTitleCase(recipe.brewMethod);
  const difficulty = METHOD_DIFFICULTY[recipe.brewMethod] ?? 'Pemula';
  const temperature = METHOD_TEMPERATURE[recipe.brewMethod] ?? '90-93C';

  return {
    id: recipe.id,
    tab: methodLabel,
    breadcrumb: 'Resep Komunitas',
    title: recipe.title,
    description: recipe.description,
    stats: [
      { label: 'Waktu', value: formatBrewTime(recipe.brewTimeSeconds) },
      { label: 'Tingkat', value: difficulty },
      { label: 'Rasio', value: formatRatio(recipe.coffeeGrams, recipe.waterMl) },
      { label: 'Suhu Air', value: temperature },
    ],
    ingredients: [
      { name: `Biji Kopi (${recipe.grindSize})`, amount: `${recipe.coffeeGrams}g` },
      { name: 'Air Panas', amount: `${recipe.waterMl}ml` },
      { name: 'Metode Seduh', amount: methodLabel },
    ],
    steps: recipe.steps.map((stepText, index) => parseStepText(stepText, index)),
  };
}

export async function fetchRecipes(apiBaseUrl: string, signal: AbortSignal): Promise<ApiRecipe[]> {
  const response = await fetch(`${apiBaseUrl}/recipes`, { signal });

  if (!response.ok) {
    throw new Error(`Backend responded with status ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload)) {
    throw new Error('Recipe payload is not an array.');
  }

  return payload.filter(isApiRecipe);
}

export async function fetchRecipeById(
  apiBaseUrl: string,
  id: string,
  signal: AbortSignal
): Promise<ApiRecipe> {
  const response = await fetch(`${apiBaseUrl}/recipes/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Backend responded with status ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!isApiRecipe(payload)) {
    throw new Error('Recipe payload is invalid.');
  }

  return payload;
}
