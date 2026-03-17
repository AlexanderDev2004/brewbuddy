import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Visibility = 'public' | 'private';
type RecipeFilter = 'all' | 'public' | 'private' | 'favorite';

type MyRecipe = {
  id: string;
  title: string;
  method: string;
  brewTimeMinutes: number;
  ratio: string;
  temperature: string;
  tools: string[];
  ingredients: string[];
  steps: string[];
  visibility: Visibility;
  isFavorite: boolean;
  ratingAverage: number;
  ratingCount: number;
};

type RecipeForm = {
  title: string;
  method: string;
  brewTimeMinutes: string;
  ratio: string;
  temperature: string;
  tools: string;
  ingredients: string;
  steps: string;
  visibility: Visibility;
  isFavorite: boolean;
};

const FILTER_OPTIONS: { key: RecipeFilter; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'public', label: 'Public' },
  { key: 'private', label: 'Private' },
  { key: 'favorite', label: 'Favorit' },
];

const INITIAL_FORM: RecipeForm = {
  title: '',
  method: 'V60',
  brewTimeMinutes: '3',
  ratio: '1:15',
  temperature: '92C',
  tools: 'V60 dripper, kettle, timbangan',
  ingredients: '15g kopi\n225ml air panas',
  steps: 'Bilas filter\nBlooming 30-45 detik\nTuang bertahap sampai selesai',
  visibility: 'private',
  isFavorite: false,
};

const INITIAL_RECIPES: MyRecipe[] = [
  {
    id: 'my-1',
    title: 'V60 Harian Ringan',
    method: 'V60 Pour Over',
    brewTimeMinutes: 3,
    ratio: '1:15',
    temperature: '92C',
    tools: ['V60 dripper', 'Kettle', 'Timbangan'],
    ingredients: ['15g kopi medium fine', '225ml air panas'],
    steps: ['Bilas filter', 'Blooming 40 detik', 'Tuang 3 tahap hingga selesai'],
    visibility: 'public',
    isFavorite: true,
    ratingAverage: 4.9,
    ratingCount: 800,
  },
  {
    id: 'my-2',
    title: 'Japanese Iced Eksperimen',
    method: 'Japanese Iced',
    brewTimeMinutes: 3,
    ratio: '1:15',
    temperature: '93C',
    tools: ['Dripper', 'Server', 'Es batu'],
    ingredients: ['20g kopi', '180ml air panas', '120g es'],
    steps: ['Siapkan es di server', 'Blooming 30 detik', 'Tuang sampai 180ml'],
    visibility: 'private',
    isFavorite: false,
    ratingAverage: 4.7,
    ratingCount: 126,
  },
];

function parseCommaList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parseLineList(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function formatRating(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

export default function MyResepScreen() {
  const [recipes, setRecipes] = useState<MyRecipe[]>(INITIAL_RECIPES);
  const [filter, setFilter] = useState<RecipeFilter>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<RecipeForm>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    switch (filter) {
      case 'public':
        return recipes.filter((recipe) => recipe.visibility === 'public');
      case 'private':
        return recipes.filter((recipe) => recipe.visibility === 'private');
      case 'favorite':
        return recipes.filter((recipe) => recipe.isFavorite);
      default:
        return recipes;
    }
  }, [filter, recipes]);

  function toggleFavorite(recipeId: string) {
    setRecipes((currentRecipes) =>
      currentRecipes.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
  }

  function toggleVisibility(recipeId: string) {
    setRecipes((currentRecipes) =>
      currentRecipes.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, visibility: recipe.visibility === 'public' ? 'private' : 'public' }
          : recipe
      )
    );
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setFormError(null);
  }

  function createRecipe() {
    if (!form.title.trim()) {
      setFormError('Judul resep wajib diisi.');
      return;
    }

    if (!form.method.trim()) {
      setFormError('Metode seduh wajib diisi.');
      return;
    }

    const steps = parseLineList(form.steps);

    if (steps.length === 0) {
      setFormError('Isi minimal 1 langkah cara membuat kopi.');
      return;
    }

    const tools = parseCommaList(form.tools);
    const ingredients = parseLineList(form.ingredients);
    const newIndex = recipes.length + 1;
    const brewTimeMinutes = Number.parseInt(form.brewTimeMinutes, 10);

    const newRecipe: MyRecipe = {
      id: `my-${Date.now()}`,
      title: form.title.trim(),
      method: form.method.trim(),
      brewTimeMinutes: Number.isNaN(brewTimeMinutes) ? 3 : Math.max(1, brewTimeMinutes),
      ratio: form.ratio.trim() || '1:15',
      temperature: form.temperature.trim() || '92C',
      tools: tools.length > 0 ? tools : ['Dripper', 'Kettle'],
      ingredients: ingredients.length > 0 ? ingredients : ['15g kopi', '225ml air panas'],
      steps,
      visibility: form.visibility,
      isFavorite: form.isFavorite,
      ratingAverage: Number((4 + ((newIndex % 10) / 10)).toFixed(1)),
      ratingCount: 40 + newIndex * 35,
    };

    setRecipes((currentRecipes) => [newRecipe, ...currentRecipes]);
    setFilter('all');
    setIsFormOpen(false);
    resetForm();
  }

  return (
    <SafeAreaView className="flex-1 bg-brew-main">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="border-b border-b-brew-border bg-brew-alt px-5 py-4">
          <Text className="font-interSemi text-[13px] tracking-tight text-brew-text">Brewbuddy</Text>
          <Text className="mt-1 font-interMedium text-[30px] leading-[34px] tracking-[-1px] text-brew-text">
            My Resep
          </Text>
          <Text className="mt-3 font-inter text-[15px] leading-6 text-brew-text">
            Buat resepmu sendiri untuk trial. Set ke public agar orang lain bisa mengikuti, atau
            private untuk resep pribadi.
          </Text>
          <Text className="mt-3 font-inter text-xs leading-5 text-brew-muted">
            Mode saat ini: dummy lokal (belum sinkron ke backend/database).
          </Text>
        </View>

        <View className="px-5 pt-5">
          <Pressable
            className="flex-row items-center justify-center rounded-xl bg-brew-accent px-4 py-3"
            onPress={() => {
              setIsFormOpen((open) => !open);
              setFormError(null);
            }}>
            <MaterialIcons color="#FFFFFF" name={isFormOpen ? 'close' : 'add'} size={18} />
            <Text className="ml-2 font-interSemi text-sm text-white">
              {isFormOpen ? 'Tutup Form' : 'Buat Resep Baru'}
            </Text>
          </Pressable>
        </View>

        {isFormOpen ? (
          <View className="mx-5 mt-4 rounded-2xl border border-brew-border bg-brew-alt p-4">
            <Text className="font-interSemi text-[12px] uppercase tracking-[1px] text-brew-muted">
              Form Resep (Dummy)
            </Text>

            <Text className="mt-4 font-interMedium text-sm text-brew-text">Judul Resep</Text>
            <TextInput
              className="mt-2 rounded-xl border border-brew-border bg-brew-main px-3 py-3 font-inter text-[15px] text-brew-text"
              onChangeText={(value) => setForm((current) => ({ ...current, title: value }))}
              placeholder="Contoh: V60 Fruity Weekend"
              placeholderTextColor="#7A7A7A"
              value={form.title}
            />

            <Text className="mt-4 font-interMedium text-sm text-brew-text">Metode Seduh</Text>
            <TextInput
              className="mt-2 rounded-xl border border-brew-border bg-brew-main px-3 py-3 font-inter text-[15px] text-brew-text"
              onChangeText={(value) => setForm((current) => ({ ...current, method: value }))}
              placeholder="V60 / French Press / AeroPress"
              placeholderTextColor="#7A7A7A"
              value={form.method}
            />

            <View className="mt-4 flex-row justify-between">
              <View className="w-[32%]">
                <Text className="font-interMedium text-sm text-brew-text">Waktu</Text>
                <TextInput
                  className="mt-2 rounded-xl border border-brew-border bg-brew-main px-3 py-3 font-inter text-[15px] text-brew-text"
                  keyboardType="number-pad"
                  onChangeText={(value) =>
                    setForm((current) => ({ ...current, brewTimeMinutes: value }))
                  }
                  placeholder="3"
                  placeholderTextColor="#7A7A7A"
                  value={form.brewTimeMinutes}
                />
              </View>

              <View className="w-[32%]">
                <Text className="font-interMedium text-sm text-brew-text">Rasio</Text>
                <TextInput
                  className="mt-2 rounded-xl border border-brew-border bg-brew-main px-3 py-3 font-inter text-[15px] text-brew-text"
                  onChangeText={(value) => setForm((current) => ({ ...current, ratio: value }))}
                  placeholder="1:15"
                  placeholderTextColor="#7A7A7A"
                  value={form.ratio}
                />
              </View>

              <View className="w-[32%]">
                <Text className="font-interMedium text-sm text-brew-text">Suhu</Text>
                <TextInput
                  className="mt-2 rounded-xl border border-brew-border bg-brew-main px-3 py-3 font-inter text-[15px] text-brew-text"
                  onChangeText={(value) => setForm((current) => ({ ...current, temperature: value }))}
                  placeholder="92C"
                  placeholderTextColor="#7A7A7A"
                  value={form.temperature}
                />
              </View>
            </View>

            <Text className="mt-4 font-interMedium text-sm text-brew-text">Alat (pisahkan koma)</Text>
            <TextInput
              className="mt-2 rounded-xl border border-brew-border bg-brew-main px-3 py-3 font-inter text-[15px] text-brew-text"
              onChangeText={(value) => setForm((current) => ({ ...current, tools: value }))}
              placeholder="V60 dripper, kettle, timbangan"
              placeholderTextColor="#7A7A7A"
              value={form.tools}
            />

            <Text className="mt-4 font-interMedium text-sm text-brew-text">
              Bahan (tiap baris 1 item)
            </Text>
            <TextInput
              className="mt-2 rounded-xl border border-brew-border bg-brew-main px-3 py-3 font-inter text-[15px] text-brew-text"
              multiline
              numberOfLines={3}
              onChangeText={(value) => setForm((current) => ({ ...current, ingredients: value }))}
              placeholder="15g kopi\n225ml air panas"
              placeholderTextColor="#7A7A7A"
              style={{ textAlignVertical: 'top' }}
              value={form.ingredients}
            />

            <Text className="mt-4 font-interMedium text-sm text-brew-text">
              Cara Membuat (tiap baris 1 langkah)
            </Text>
            <TextInput
              className="mt-2 rounded-xl border border-brew-border bg-brew-main px-3 py-3 font-inter text-[15px] text-brew-text"
              multiline
              numberOfLines={4}
              onChangeText={(value) => setForm((current) => ({ ...current, steps: value }))}
              placeholder="Bilas filter\nBlooming 40 detik\nTuang bertahap sampai selesai"
              placeholderTextColor="#7A7A7A"
              style={{ textAlignVertical: 'top' }}
              value={form.steps}
            />

            <Text className="mt-4 font-interMedium text-sm text-brew-text">Visibility</Text>
            <View className="mt-2 flex-row">
              <Pressable
                className={
                  form.visibility === 'public'
                    ? 'mr-2 rounded-full border border-brew-accent bg-brew-accent px-4 py-2'
                    : 'mr-2 rounded-full border border-brew-border bg-brew-main px-4 py-2'
                }
                onPress={() => setForm((current) => ({ ...current, visibility: 'public' }))}>
                <Text
                  className={
                    form.visibility === 'public'
                      ? 'font-interMedium text-xs text-white'
                      : 'font-interMedium text-xs text-brew-text'
                  }>
                  Public
                </Text>
              </Pressable>

              <Pressable
                className={
                  form.visibility === 'private'
                    ? 'rounded-full border border-brew-accent bg-brew-accent px-4 py-2'
                    : 'rounded-full border border-brew-border bg-brew-main px-4 py-2'
                }
                onPress={() => setForm((current) => ({ ...current, visibility: 'private' }))}>
                <Text
                  className={
                    form.visibility === 'private'
                      ? 'font-interMedium text-xs text-white'
                      : 'font-interMedium text-xs text-brew-text'
                  }>
                  Private
                </Text>
              </Pressable>
            </View>

            <Pressable
              className="mt-4 flex-row items-center"
              onPress={() =>
                setForm((current) => ({
                  ...current,
                  isFavorite: !current.isFavorite,
                }))
              }>
              <MaterialIcons
                color={form.isFavorite ? '#FD4040' : '#7A7A7A'}
                name={form.isFavorite ? 'favorite' : 'favorite-border'}
                size={20}
              />
              <Text className="ml-2 font-inter text-sm text-brew-text">Tandai sebagai favorit</Text>
            </Pressable>

            {formError ? (
              <Text className="mt-3 font-inter text-sm text-brew-accent">{formError}</Text>
            ) : null}

            <Pressable
              className="mt-4 flex-row items-center justify-center rounded-xl bg-brew-text px-4 py-3"
              onPress={createRecipe}>
              <MaterialIcons color="#FFFFFF" name="check" size={18} />
              <Text className="ml-2 font-interSemi text-sm text-white">Simpan Resep Dummy</Text>
            </Pressable>
          </View>
        ) : null}

        <View className="px-5 pt-5">
          <Text className="font-interSemi text-[12px] uppercase tracking-[1px] text-brew-muted">
            Koleksi Resep Saya
          </Text>

          <View className="mt-3 flex-row flex-wrap">
            {FILTER_OPTIONS.map((option) => {
              const isActive = filter === option.key;

              return (
                <Pressable
                  key={option.key}
                  className={
                    isActive
                      ? 'mb-2 mr-2 rounded-full border border-brew-accent bg-brew-accent px-4 py-2'
                      : 'mb-2 mr-2 rounded-full border border-brew-border bg-brew-main px-4 py-2'
                  }
                  onPress={() => setFilter(option.key)}>
                  <Text
                    className={
                      isActive
                        ? 'font-interMedium text-xs text-white'
                        : 'font-interMedium text-xs text-brew-text'
                    }>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="px-5 pt-1">
          {filteredRecipes.length === 0 ? (
            <View className="rounded-2xl border border-brew-border bg-brew-alt p-4">
              <Text className="font-inter text-sm leading-6 text-brew-muted">
                Belum ada resep untuk filter ini.
              </Text>
            </View>
          ) : (
            filteredRecipes.map((recipe) => (
              <View key={recipe.id} className="mb-3 rounded-2xl border border-brew-border bg-brew-alt p-4">
                <View className="flex-row items-start justify-between">
                  <View className="mr-3 flex-1">
                    <Text className="font-interMedium text-[20px] leading-6 text-brew-text">
                      {recipe.title}
                    </Text>
                    <Text className="mt-1 font-inter text-sm text-brew-muted">
                      {recipe.method} • {recipe.brewTimeMinutes} menit
                    </Text>
                  </View>

                  <Pressable
                    accessibilityLabel="Toggle favorite"
                    className="rounded-full border border-brew-border bg-brew-main p-2"
                    onPress={() => toggleFavorite(recipe.id)}>
                    <MaterialIcons
                      color={recipe.isFavorite ? '#FD4040' : '#7A7A7A'}
                      name={recipe.isFavorite ? 'favorite' : 'favorite-border'}
                      size={18}
                    />
                  </Pressable>
                </View>

                <View className="mt-3 flex-row items-center justify-between">
                  <View
                    className={
                      recipe.visibility === 'public'
                        ? 'rounded-full border border-brew-accent bg-brew-accent px-3 py-1'
                        : 'rounded-full border border-brew-border bg-brew-main px-3 py-1'
                    }>
                    <Text
                      className={
                        recipe.visibility === 'public'
                          ? 'font-interSemi text-[10px] uppercase tracking-[1px] text-white'
                          : 'font-interSemi text-[10px] uppercase tracking-[1px] text-brew-text'
                      }>
                      {recipe.visibility}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <MaterialIcons color="#FD4040" name="star" size={16} />
                    <Text className="ml-1 font-interSemi text-sm text-brew-text">
                      {formatRating(recipe.ratingAverage)} ({recipe.ratingCount})
                    </Text>
                  </View>
                </View>

                <Text className="mt-3 font-inter text-sm text-brew-text">
                  Rasio {recipe.ratio} • Suhu {recipe.temperature}
                </Text>
                <Text className="mt-1 font-inter text-sm text-brew-text" numberOfLines={2}>
                  Alat: {recipe.tools.join(', ')}
                </Text>
                <Text className="mt-1 font-inter text-sm text-brew-text" numberOfLines={2}>
                  Bahan: {recipe.ingredients.join(', ')}
                </Text>
                <Text className="mt-1 font-inter text-sm text-brew-text" numberOfLines={2}>
                  Cara ({recipe.steps.length} langkah): {recipe.steps[0]}
                </Text>

                <Pressable
                  className="mt-4 flex-row items-center justify-center rounded-xl border border-brew-border bg-brew-main px-3 py-2"
                  onPress={() => toggleVisibility(recipe.id)}>
                  <MaterialIcons
                    color="#141414"
                    name={recipe.visibility === 'public' ? 'lock' : 'public'}
                    size={16}
                  />
                  <Text className="ml-2 font-interMedium text-xs text-brew-text">
                    {recipe.visibility === 'public' ? 'Jadikan Private' : 'Ubah ke Public'}
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
