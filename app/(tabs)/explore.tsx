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

function recipeHref(id: string): Href {
  return `/recipes/${id}` as Href;
}

export default function ExploreScreen() {
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
          setFetchError('Belum ada resep komunitas. Menampilkan contoh resep default.');
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
        setFetchError(`Gagal memuat backend di ${apiBaseUrl}. Menampilkan contoh resep default.`);
      } finally {
        setIsLoading(false);
      }
    }

    void loadRecipes();

    return () => {
      abortController.abort();
    };
  }, [apiBaseUrl]);

  return (
    <SafeAreaView className="flex-1 bg-brew-main">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="border-b border-b-brew-border bg-brew-alt px-5 py-4">
          <Text className="font-interSemi text-[13px] tracking-tight text-brew-text">Brewbuddy</Text>
          <Text className="mt-1 font-interMedium text-[28px] leading-[32px] tracking-[-1px] text-brew-text">
            Jelajahi Resep
          </Text>
          <Text className="mt-2 font-inter text-sm leading-5 text-brew-muted">
            Pilih resep komunitas lalu buka detail lengkap untuk ikuti langkah seduhnya.
          </Text>

          <Text className="mt-4 font-interSemi text-[10px] uppercase tracking-[1px] text-brew-muted">
            {isUsingFallback ? 'Mode Demo (Local)' : 'Data Backend Aktif'}
          </Text>

          {isLoading ? (
            <Text className="mt-2 font-inter text-sm leading-5 text-brew-muted">
              Memuat daftar resep...
            </Text>
          ) : null}

          {fetchError ? (
            <Text className="mt-2 font-inter text-sm leading-5 text-brew-muted">{fetchError}</Text>
          ) : null}
        </View>

        <View>
          {recipes.map((recipe, index) => (
            <Link key={recipe.id} href={recipeHref(recipe.id)} asChild>
              <Pressable
                className="bg-brew-main px-5 py-5"
                style={{ borderBottomColor: '#CDCDCD', borderBottomWidth: 1 }}>
                <View className="flex-row items-start justify-between">
                  <View className="mr-4 flex-1">
                    <Text className="font-interSemi text-[10px] uppercase tracking-[1px] text-brew-muted">
                      Resep {index + 1}
                    </Text>
                    <Text className="mt-2 font-interMedium text-[20px] leading-6 text-brew-text">
                      {recipe.title}
                    </Text>
                    <Text className="mt-1 font-inter text-sm text-brew-muted">{recipe.tab}</Text>
                    <Text className="mt-2 font-inter text-[15px] leading-6 text-brew-text">
                      {recipe.description}
                    </Text>
                  </View>

                  <View className="mt-1 h-6 w-6 items-center justify-center rounded-full bg-brew-text">
                    <MaterialIcons color="#FFFFFF" name="arrow-forward" size={14} />
                  </View>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
