import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  FALLBACK_RECIPES,
  fetchRecipes,
  getApiBaseUrl,
  isAbortError,
  mapRecipeToUI,
  type RecipeInfo,
} from '@/constants/recipe-data';

type MethodCard = {
  method: string;
  featured: RecipeInfo;
  recipes: RecipeInfo[];
};

function recipeHref(id: string): Href {
  return `/recipes/${id}` as Href;
}

function getStatValue(recipe: RecipeInfo, label: string, fallback: string): string {
  return recipe.stats.find((stat) => stat.label === label)?.value ?? fallback;
}

export default function HomeScreen() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [recipes, setRecipes] = useState<RecipeInfo[]>(FALLBACK_RECIPES);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadRecipes() {
      setIsLoading(true);
      setFetchError(null);

      try {
        const apiRecipes = await fetchRecipes(apiBaseUrl, abortController.signal);
        const mappedRecipes = apiRecipes.map(mapRecipeToUI);

        if (mappedRecipes.length === 0) {
          setIsUsingFallback(true);
          setRecipes(FALLBACK_RECIPES);
          setFetchError('Belum ada resep komunitas. Menampilkan metode default.');
          return;
        }

        setIsUsingFallback(false);
        setRecipes(mappedRecipes);
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        setIsUsingFallback(true);
        setRecipes(FALLBACK_RECIPES);
        setFetchError(`Gagal memuat backend di ${apiBaseUrl}. Menampilkan metode default.`);
      } finally {
        setIsLoading(false);
      }
    }

    void loadRecipes();

    return () => {
      abortController.abort();
    };
  }, [apiBaseUrl]);

  const methodCards = useMemo(() => {
    const grouped = new Map<string, MethodCard>();

    for (const recipe of recipes) {
      const existing = grouped.get(recipe.tab);

      if (existing) {
        existing.recipes.push(recipe);
        continue;
      }

      grouped.set(recipe.tab, {
        method: recipe.tab,
        featured: recipe,
        recipes: [recipe],
      });
    }

    return [...grouped.values()].sort((left, right) => {
      if (right.recipes.length !== left.recipes.length) {
        return right.recipes.length - left.recipes.length;
      }

      return left.method.localeCompare(right.method);
    });
  }, [recipes]);

  return (
    <SafeAreaView className="flex-1 bg-brew-main">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="border-b border-b-brew-border bg-brew-alt px-5 py-4">
          <Text className="font-interSemi text-[13px] tracking-tight text-brew-text">Brewbuddy</Text>
          <Text className="mt-1 font-interMedium text-[30px] leading-[34px] tracking-[-1px] text-brew-text">
            Metode Coffee Populer
          </Text>
          <Text className="mt-3 font-inter text-[15px] leading-6 text-brew-text">
            Pilih metode seduh favoritmu, lalu buka halaman resep untuk ikuti langkah yang detail.
          </Text>

          <Text className="mt-4 font-interSemi text-[10px] uppercase tracking-[1px] text-brew-muted">
            {isUsingFallback ? 'Mode Demo (Local)' : 'Data Backend Aktif'}
          </Text>

          {isLoading ? (
            <Text className="mt-2 font-inter text-sm leading-5 text-brew-muted">
              Memuat metode populer...
            </Text>
          ) : null}

          {fetchError ? (
            <Text className="mt-2 font-inter text-sm leading-5 text-brew-muted">{fetchError}</Text>
          ) : null}
        </View>

        <View className="flex-row flex-wrap px-5 pb-2 pt-5">
          {methodCards.map((card, index) => (
            <Link key={card.method} href={recipeHref(card.featured.id)} asChild>
              <Pressable
                className="mb-4 rounded-2xl border border-brew-border bg-brew-alt p-4"
                style={{
                  width: '48%',
                  marginRight: index % 2 === 0 ? '4%' : '0%',
                }}>
                <Text className="font-interSemi text-[10px] uppercase tracking-[1px] text-brew-muted">
                  Populer #{index + 1}
                </Text>
                <Text className="mt-2 font-interMedium text-[20px] leading-6 text-brew-text">
                  {card.method}
                </Text>
                <Text className="mt-1 font-inter text-xs text-brew-muted">
                  {card.recipes.length} resep tersedia
                </Text>

                <View className="mt-4 border-t border-t-brew-border pt-3">
                  <Text className="font-inter text-xs text-brew-muted">
                    Rasio {getStatValue(card.featured, 'Rasio', '1:15')}
                  </Text>
                  <Text className="mt-1 font-inter text-xs text-brew-muted">
                    Waktu {getStatValue(card.featured, 'Waktu', '3 Menit')}
                  </Text>
                </View>

                <View className="mt-4 flex-row items-center justify-between">
                  <Text className="font-interMedium text-[13px] text-brew-text">Buka Resep</Text>
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-brew-text">
                    <MaterialIcons color="#FFFFFF" name="arrow-forward" size={14} />
                  </View>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>

        <View className="px-5">
          <Link href="/explore" asChild>
            <Pressable className="flex-row items-center justify-between rounded-xl border border-brew-border bg-brew-main px-4 py-4">
              <Text className="font-interMedium text-[15px] text-brew-text">Lihat semua resep komunitas</Text>
              <View className="h-6 w-6 items-center justify-center rounded-full bg-brew-text">
                <MaterialIcons color="#FFFFFF" name="arrow-forward" size={14} />
              </View>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
