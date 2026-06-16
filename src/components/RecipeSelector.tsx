import { useState } from 'react';
import { ChevronDown, FileText, Check, Info } from 'lucide-react';
import type { RecipeModuleId } from '@/types';
import { useRecipeStore } from '@/store/useRecipeStore';
import { useProductionStore } from '@/store/useProductionStore';

interface RecipeSelectorProps {
  moduleId: RecipeModuleId;
  title?: string;
}

const moduleLabels: Record<RecipeModuleId, string> = {
  annealing: '退火炉',
  galvanizing: '锌锅',
  'air-knife': '气刀',
  passivation: '钝化',
};

export function RecipeSelector({ moduleId, title }: RecipeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const recipes = useRecipeStore((state) => state.getRecipesByModule(moduleId));
  const currentRecipe = useRecipeStore((state) => state.getCurrentRecipe(moduleId));
  const applyRecipe = useRecipeStore((state) => state.applyRecipe);
  const updateModuleParameterTarget = useProductionStore((state) => state.updateModuleParameterTarget);
  const updateAnnealingZoneSetPoint = useProductionStore((state) => state.updateAnnealingZoneSetPoint);

  const handleApply = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    applyRecipe(recipeId);

    recipe.parameterTargets.forEach(({ paramId, target }) => {
      updateModuleParameterTarget(moduleId, paramId, target);
    });

    if (moduleId === 'annealing' && recipe.zoneSetPoints) {
      recipe.zoneSetPoints.forEach(({ zoneId, setPoint }) => {
        updateAnnealingZoneSetPoint(zoneId, setPoint);
      });
    }

    setIsOpen(false);
  };

  return (
    <div className="card-industrial p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-industrial-orange" />
          <h3 className="text-sm font-medium text-industrial-text">
            {title || `${moduleLabels[moduleId]}工艺配方`}
          </h3>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-industrial-bgLight border border-industrial-border rounded-sm text-left hover:border-industrial-orange/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-industrial-text truncate">
              {currentRecipe?.name || '请选择配方'}
            </div>
            <div className="text-xs text-industrial-textMuted truncate">
              {currentRecipe?.description || '点击选择工艺配方'}
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-industrial-textMuted ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-industrial-bgCard border border-industrial-border rounded-sm shadow-industrial z-50 max-h-80 overflow-y-auto">
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleApply(recipe.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-industrial-bgLight transition-colors border-b border-industrial-border/50 last:border-b-0 ${
                  currentRecipe?.id === recipe.id ? 'bg-industrial-orange/10' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-industrial-text">{recipe.name}</span>
                    {currentRecipe?.id === recipe.id && (
                      <Check className="w-4 h-4 text-industrial-success" />
                    )}
                  </div>
                  <div className="text-xs text-industrial-textMuted mb-1">{recipe.description}</div>
                  <div className="flex gap-2 flex-wrap">
                    {recipe.steelGrade && (
                      <span className="px-1.5 py-0.5 bg-industrial-steel/20 text-industrial-steelLight text-xs rounded-sm">
                        钢种: {recipe.steelGrade}
                      </span>
                    )}
                    {recipe.coatingClass && (
                      <span className="px-1.5 py-0.5 bg-industrial-orange/20 text-industrial-orange text-xs rounded-sm">
                        锌层: {recipe.coatingClass}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {currentRecipe && (
        <div className="mt-3 pt-3 border-t border-industrial-border">
          <div className="flex items-start gap-2 p-2 bg-industrial-bgLight/50 rounded-sm">
            <Info className="w-4 h-4 text-industrial-steelLight mt-0.5 flex-shrink-0" />
            <div className="text-xs text-industrial-textSecondary">
              <span className="text-industrial-success font-medium">● 已应用</span>
              <span className="mx-2">|</span>
              <span>{currentRecipe.parameterTargets.length} 项参数</span>
              {currentRecipe.zoneSetPoints && (
                <>
                  <span className="mx-2">|</span>
                  <span>{currentRecipe.zoneSetPoints.length} 个温区</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
