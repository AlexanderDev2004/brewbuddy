import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  FALLBACK_RECIPES,
  fetchRecipeById,
  getApiBaseUrl,
  isAbortError,
  mapRecipeToUI,
  type RecipeInfo,
} from '@/constants/recipe-data';

function normalizeId(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export default function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const recipeId = normalizeId(params.id);
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [recipe, setRecipe] = useState<RecipeInfo>(FALLBACK_RECIPES[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadRecipe() {
      if (!recipeId) {
        setRecipe(FALLBACK_RECIPES[0]);
        setFetchError('ID resep tidak valid. Menampilkan resep default.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setFetchError(null);

      try {
        const apiRecipe = await fetchRecipeById(apiBaseUrl, recipeId, abortController.signal);
        setRecipe(mapRecipeToUI(apiRecipe));
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        const localRecipe = FALLBACK_RECIPES.find((item) => item.id === recipeId) ?? FALLBACK_RECIPES[0];
        setRecipe(localRecipe);
        setFetchError(`Gagal memuat detail dari backend di ${apiBaseUrl}. Menampilkan resep default.`);
      } finally {
        setIsLoading(false);
      }
    }

    void loadRecipe();

    return () => {
      abortController.abort();
    };
  }, [apiBaseUrl, recipeId]);

  return (
    <SafeAreaView className="flex-1 bg-brew-main">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="border-b border-b-brew-border bg-brew-alt px-5 py-4">
          <View className="flex-row items-center justify-between">
            <Pressable
              accessibilityLabel="Kembali"
              className="flex-row items-center"
              onPress={() => router.back()}>
              <MaterialIcons color="#141414" name="arrow-back" size={18} />
              <Text className="ml-2 font-interMedium text-sm text-brew-text">Kembali</Text>
            </Pressable>
            <Text className="font-interSemi text-[13px] tracking-tight text-brew-text">Brewbuddy</Text>
          </View>

          <Text className="mt-5 font-interSemi text-[10px] uppercase tracking-[1px] text-brew-muted">
            Detail Resep
          </Text>
          <Text className="mt-2 font-interMedium text-[30px] leading-[34px] tracking-[-1px] text-brew-text">
            {recipe.title}
          </Text>
          <Text className="mt-3 font-inter text-[15px] leading-6 text-brew-text">{recipe.description}</Text>

          {isLoading ? (
            <Text className="mt-3 font-inter text-sm leading-5 text-brew-muted">
              Memuat detail resep...
            </Text>
          ) : null}

          {fetchError ? (
            <Text className="mt-2 font-inter text-sm leading-5 text-brew-muted">{fetchError}</Text>
          ) : null}
        </View>

        <View className="flex-row flex-wrap border-b border-b-brew-border">
          {recipe.stats.map((stat, index) => (
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

          {recipe.ingredients.map((ingredient, index) => (
            <View
              key={ingredient.name}
              className="flex-row items-center justify-between px-5 py-4"
              style={{
                borderBottomColor: '#CDCDCD',
                borderBottomWidth: index === recipe.ingredients.length - 1 ? 0 : 1,
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

          {recipe.steps.map((step, index) => (
            <View
              key={`${step.title}-${index}`}
              className="flex-row px-5 py-6"
              style={{
                borderBottomColor: '#CDCDCD',
                borderBottomWidth: index === recipe.steps.length - 1 ? 0 : 1,
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
      </ScrollView>
    </SafeAreaView>
  );
}
