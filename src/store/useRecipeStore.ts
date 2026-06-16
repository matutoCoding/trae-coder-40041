import { create } from 'zustand';
import type { Recipe, RecipeModuleId } from '@/types';
import { recipes } from '@/data/recipes';

interface RecipeState {
  recipes: Recipe[];
  currentRecipes: Record<RecipeModuleId, string | null>;
  loadCurrentFromStorage: () => void;
  saveCurrentToStorage: () => void;
  applyRecipe: (recipeId: string, batchId?: string) => void;
  getCurrentRecipe: (moduleId: RecipeModuleId) => Recipe | undefined;
  getRecipesByModule: (moduleId: RecipeModuleId) => Recipe[];
}

const STORAGE_KEY = 'galvanizing_recipes';

const safeParseJSON = <T>(str: string | null, fallback: T): T => {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
};

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes,
  currentRecipes: {
    annealing: 'annealing_dx51d',
    galvanizing: 'galvanizing_z100',
    'air-knife': 'airknife_z100',
    passivation: 'passivation_standard',
  },

  loadCurrentFromStorage: () => {
    const stored = safeParseJSON(
      localStorage.getItem(STORAGE_KEY),
      null as null | Record<RecipeModuleId, string | null>
    );
    if (stored) {
      set((state) => ({
        currentRecipes: { ...state.currentRecipes, ...stored },
      }));
    }
  },

  saveCurrentToStorage: () => {
    const { currentRecipes } = get();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentRecipes));
    } catch {
      // ignore storage errors
    }
  },

  applyRecipe: (recipeId) => {
    const recipe = get().recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    set((state) => ({
      currentRecipes: {
        ...state.currentRecipes,
        [recipe.moduleId]: recipeId,
      },
    }));
    get().saveCurrentToStorage();
  },

  getCurrentRecipe: (moduleId) => {
    const state = get();
    const recipeId = state.currentRecipes[moduleId];
    if (!recipeId) return undefined;
    return state.recipes.find((r) => r.id === recipeId);
  },

  getRecipesByModule: (moduleId) => {
    return get().recipes.filter((r) => r.moduleId === moduleId);
  },
}));
