export type RecipeStatus =
  | 'awaiting-verdict'
  | 'hit'
  | 'needs-work'
  | 'miss'
  | 'magnificent-disaster';

export interface Ingredient {
  quantity: number | null;
  unit?: string;
  item: string;
  note?: string;
}

export interface RecipeStep {
  text: string;
  timerMinutes?: number;
}

export interface RecipeVerdict {
  status: Exclude<RecipeStatus, 'awaiting-verdict'>;
  rating?: number;
  loggedDate: string;
  familyReaction?: string;
  whatWorked?: string[];
  whatDidnt?: string[];
  nextTime?: string;
}

export interface Recipe {
  slug: string;
  title: string;
  summary: string;
  publishedDate: string;
  cookedDate?: string;
  status: RecipeStatus;
  draft?: boolean;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  tags: string[];
  sourceNote?: string;
  image?: string;
  imageAlt?: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  actualChanges?: string[];
  verdict?: RecipeVerdict;
}
