import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RecipeInfo = {
  id: string;
  tab: string;
  breadcrumb: string;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
  ingredients: { name: string; amount: string }[];
  steps: { title: string; detail: string }[];
};

type ApiBrewMethod =
  | 'V60'
  | 'JAPANESE_ICED'
  | 'AEROPRESS'
  | 'FRENCH_PRESS'
  | 'ESPRESSO'
  | 'OTHER';

type ApiRecipe = {
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

const FALLBACK_RECIPES: RecipeInfo[] = [
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
];

const LEARN_MORE = ['Panduan Memilih Biji Kopi', 'Peralatan Wajib Pemula'];

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

function getApiBaseUrl() {
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

function isAbortError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('name' in error)) {
    return false;
  }

  return (error as { name?: string }).name === 'AbortError';
}

function isApiRecipe(value: unknown): value is ApiRecipe {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<ApiRecipe>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.brewMethod === 'string' &&
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

function mapRecipeToUI(recipe: ApiRecipe): RecipeInfo {
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

export default function HomeScreen() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [recipes, setRecipes] = useState<RecipeInfo[]>(FALLBACK_RECIPES);
  const [selectedRecipeId, setSelectedRecipeId] = useState(FALLBACK_RECIPES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadRecipes() {
      setIsLoading(true);
      setFetchError(null);

      try {
        const response = await fetch(`${apiBaseUrl}/recipes`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Backend responded with status ${response.status}`);
        }

        const payload: unknown = await response.json();

        if (!Array.isArray(payload)) {
          throw new Error('Recipe payload is not an array.');
        }

        const mappedRecipes = payload.filter(isApiRecipe).map(mapRecipeToUI);

        if (mappedRecipes.length === 0) {
          setIsUsingFallback(true);
          setRecipes(FALLBACK_RECIPES);
          setFetchError('Belum ada resep komunitas. Menampilkan contoh resep default.');
          return;
        }

        setIsUsingFallback(false);
        setRecipes(mappedRecipes);
        setSelectedRecipeId((currentId) => {
          const selectedExists = mappedRecipes.some((recipe) => recipe.id === currentId);
          return selectedExists ? currentId : mappedRecipes[0].id;
        });
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        setIsUsingFallback(true);
        setRecipes(FALLBACK_RECIPES);
        setFetchError(
          `Gagal memuat backend di ${apiBaseUrl}. Menampilkan contoh resep default.`
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadRecipes();

    return () => {
      abortController.abort();
    };
  }, [apiBaseUrl]);

  const selectedRecipe = useMemo(
    () => recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recipes[0] ?? FALLBACK_RECIPES[0],
    [recipes, selectedRecipeId]
  );

  return (
    <SafeAreaView className="flex-1 bg-brew-main">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 28 }}
        stickyHeaderIndices={[0]}>
        <View className="border-b border-b-brew-border bg-brew-main">
          <View className="flex-row items-center justify-between border-b border-b-brew-border bg-brew-alt px-5 py-4">
            <Text className="font-interSemi text-[13px] tracking-tight text-brew-text">BrewKit</Text>
            <Pressable
              accessibilityLabel="Open menu"
              className="h-6 w-6 items-center justify-center rounded-full bg-brew-text"
              onPress={() => null}>
              <MaterialIcons color="#FFFFFF" name="close" size={14} />
            </Pressable>
          </View>

          <ScrollView
            className="bg-brew-alt"
            contentContainerStyle={{ flexDirection: 'row' }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {recipes.map((recipe) => {
              const isActive = recipe.id === selectedRecipe.id;

              return (
                <Pressable
                  key={recipe.id}
                  className={
                    isActive
                      ? 'border-r border-r-brew-border bg-brew-accent px-5 py-4'
                      : 'border-r border-r-brew-border bg-brew-alt px-5 py-4'
                  }
                  onPress={() => setSelectedRecipeId(recipe.id)}>
                  <Text
                    className={
                      isActive
                        ? 'font-interMedium text-xs text-white'
                        : 'font-interMedium text-xs text-brew-text'
                    }>
                    {recipe.tab}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View className="border-b border-b-brew-border px-5 pb-8 pt-10">
          <Text className="font-interSemi text-[10px] uppercase tracking-[1.2px] text-brew-muted">
            {selectedRecipe.breadcrumb}
          </Text>
          <Text className="mt-6 font-interMedium text-[44px] leading-[46px] tracking-[-1.7px] text-brew-text">
            {selectedRecipe.title}
          </Text>
          <Text className="mt-6 max-w-[92%] font-inter text-base leading-6 text-brew-text">
            {selectedRecipe.description}
          </Text>

          <Text className="mt-5 font-interSemi text-[10px] uppercase tracking-[1px] text-brew-muted">
            {isUsingFallback ? 'Mode Demo (Local)' : 'Data Backend Aktif'}
          </Text>

          {isLoading ? (
            <Text className="mt-2 font-inter text-sm leading-5 text-brew-muted">
              Memuat resep komunitas...
            </Text>
          ) : null}

          {fetchError ? (
            <Text className="mt-2 font-inter text-sm leading-5 text-brew-muted">{fetchError}</Text>
          ) : null}
        </View>

        <View className="flex-row flex-wrap border-b border-b-brew-border">
          {selectedRecipe.stats.map((stat, index) => (
            <View
              key={stat.label}
              className="w-1/2 px-5 py-5"
              style={{
                borderColor: '#CDCDCD',
                borderBottomWidth: index < 2 ? 1 : 0,
                borderRightWidth: index % 2 === 0 ? 1 : 0,
              }}>
              <Text className="font-interSemi text-[10px] uppercase tracking-[1px] text-brew-muted">
                {stat.label}
              </Text>
              <Text className="mt-1 font-interMedium text-lg text-brew-text">{stat.value}</Text>
            </View>
          ))}
        </View>

        <View className="border-b border-b-brew-border">
          <View className="border-b border-b-brew-border bg-brew-alt px-5 py-5">
            <Text className="font-interSemi text-[13px] uppercase tracking-[0.4px] text-brew-text">
              Persiapan
            </Text>
          </View>

          {selectedRecipe.ingredients.map((ingredient, index) => (
            <View
              key={ingredient.name}
              className="flex-row items-center justify-between px-5 py-4"
              style={{
                borderBottomColor: '#CDCDCD',
                borderBottomWidth: index === selectedRecipe.ingredients.length - 1 ? 0 : 1,
              }}>
              <Text className="font-interMedium text-[15px] text-brew-text">{ingredient.name}</Text>
              <Text className="font-inter text-sm text-brew-muted">{ingredient.amount}</Text>
            </View>
          ))}
        </View>

        <View className="border-b border-b-brew-border">
          <View className="border-b border-b-brew-border bg-brew-alt px-5 py-5">
            <Text className="font-interSemi text-[13px] uppercase tracking-[0.4px] text-brew-text">
              Langkah Seduh
            </Text>
          </View>

          {selectedRecipe.steps.map((step, index) => (
            <View
              key={`${step.title}-${index}`}
              className="flex-row px-5 py-6"
              style={{
                borderBottomColor: '#CDCDCD',
                borderBottomWidth: index === selectedRecipe.steps.length - 1 ? 0 : 1,
              }}>
              <View className="w-10">
                <View className="h-6 w-6 items-center justify-center rounded-full bg-brew-text">
                  <Text className="font-interSemi text-[11px] text-white">{index + 1}</Text>
                </View>
              </View>
              <View className="flex-1">
                <Text className="font-interMedium text-[18px] tracking-[-0.2px] text-brew-text">
                  {step.title}
                </Text>
                <Text className="mt-2 font-inter text-[15px] leading-6 text-brew-text">
                  {step.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View>
          <View className="border-b border-b-brew-border bg-brew-alt px-5 py-5">
            <Text className="font-interSemi text-[13px] uppercase tracking-[0.4px] text-brew-text">
              Pelajari Lebih Lanjut
            </Text>
          </View>

          {LEARN_MORE.map((item, index) => (
            <Pressable
              key={item}
              className="flex-row items-center justify-between bg-brew-main px-5 py-5"
              style={{
                borderBottomColor: '#CDCDCD',
                borderBottomWidth: index === LEARN_MORE.length - 1 ? 0 : 1,
              }}>
              <Text className="font-interMedium text-[17px] text-brew-text">{item}</Text>
              <View className="h-6 w-6 items-center justify-center rounded-full bg-brew-text">
                <MaterialIcons color="#FFFFFF" name="arrow-forward" size={14} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
