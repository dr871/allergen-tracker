import { today } from '../utils/date.js';

export const ALLERGENS = [
  { id: "peanut", label: "Peanut", emoji: "\u{1F95C}", defaultDays: 4,
    examples: "peanut butter, satay, peanut oil",
    clinicalNote: "ASCIA recommends peanut twice weekly \u2014 keeping this at 4 days or less is ideal.",
    info: { about: "Peanuts are one of the most common childhood allergens. The landmark LEAP trial showed early and regular introduction reduces peanut allergy risk by up to 80%. ASCIA recommends introducing peanut before 12 months and continuing at least twice weekly.", hiddenIn: ["Peanut butter & peanut oil", "Satay sauces & Asian dishes", "Some chocolates & confectionery", "Muesli bars & trail mix", "Some baked goods & cookies", "Certain salad dressings"], easyFoods: ["Smooth peanut butter on toast", "Peanut butter stirred into porridge or yoghurt", "Thin spread on a rice cake"] } },
  { id: "treenuts", label: "Tree Nuts", emoji: "\u{1F330}", defaultDays: 7,
    examples: "cashew, almond, walnut, pistachio, hazelnut",
    clinicalNote: "Each tree nut is botanically distinct \u2014 try to vary the type you offer.",
    info: { about: "Tree nuts include cashew, walnut, almond, pistachio, hazelnut, pecan, macadamia, and more. Each is a distinct allergen protein so variety matters. Introduce one type at a time when first introducing.", hiddenIn: ["Nut butters (almond, cashew, hazelnut)", "Muesli, granola & trail mix", "Pesto (often contains pine nuts)", "Some chocolates (Nutella contains hazelnut)", "Baklava & Middle Eastern sweets", "Many 'natural flavour' products"], easyFoods: ["Almond butter or cashew butter on toast", "Finely ground nuts stirred into porridge", "Hazelnut spread thinly on bread", "Everything nut butter covers multiple at once"] } },
  { id: "milk", label: "Milk", emoji: "\u{1F95B}", defaultDays: 7,
    examples: "cheese, yoghurt, butter, cream, custard",
    clinicalNote: "Cow's milk allergy differs from lactose intolerance \u2014 regular exposure helps maintain tolerance.",
    info: { about: "Cow's milk allergy is one of the most common in infants and is distinct from lactose intolerance. Most children outgrow it by school age. Regular exposure after initial introduction helps maintain tolerance.", hiddenIn: ["All dairy (cheese, yoghurt, cream, butter)", "Ghee", "Most baked goods & cakes", "Chocolate & confectionery", "Some processed meats", "Some margarines & spreads"], easyFoods: ["Plain full-fat yoghurt", "Ricotta or mild cheese on toast", "Milk stirred into porridge or mashed food", "Small cubes of mild cheddar"] } },
  { id: "egg", label: "Egg", emoji: "\u{1F95A}", defaultDays: 4,
    examples: "scrambled egg, omelette, baked goods, pasta",
    clinicalNote: "ASCIA recommends egg twice weekly \u2014 keeping this at 4 days or less is ideal.",
    info: { about: "Egg is one of the most common allergens in young children. Both white and yolk can cause reactions, though the white is more allergenic. ASCIA recommends introducing egg before 8 months in at-risk infants. Many children outgrow egg allergy by age 5.", hiddenIn: ["Cakes, biscuits & most baked goods", "Fresh pasta & some dried pasta", "Mayonnaise & aioli", "Crumbed or battered foods", "Some vaccines (discuss with GP)", "Marshmallows & meringues"], easyFoods: ["Scrambled egg", "Hard-boiled egg cut into pieces", "Thin omelette strips", "Egg stirred into vegetable pur\u00E9e"] } },
  { id: "wheat", label: "Wheat", emoji: "\u{1F33E}", defaultDays: 7,
    examples: "bread, pasta, weetbix, crackers, couscous",
    clinicalNote: "Wheat allergy is distinct from coeliac disease \u2014 most children outgrow it.",
    info: { about: "Wheat allergy involves an immune reaction to wheat proteins and is different from coeliac disease (an autoimmune response to gluten). Most children outgrow wheat allergy. Introduce alongside other solid foods.", hiddenIn: ["Bread, toast & rolls", "Pasta, noodles & couscous", "Most breakfast cereals", "Crackers, biscuits & cakes", "Soy sauce (most brands contain wheat)", "Some condiments"], easyFoods: ["Weetbix with milk", "Toast with a soft topping", "Plain pasta with butter", "A wheat-based cracker"] } },
  { id: "soy", label: "Soy", emoji: "\u{1FAD8}", defaultDays: 10,
    examples: "tofu, edamame, soy milk, miso, tempeh",
    clinicalNote: "Soy is a legume \u2014 most infants outgrow soy allergy. Cross-reactivity with peanut is uncommon.",
    info: { about: "Soy allergy is common in infants but most children outgrow it. Soy is a legume like peanut, but cross-reactivity between them is actually uncommon. Introduce as part of normal dietary variety.", hiddenIn: ["Tofu & edamame", "Soy milk & soy-based formula", "Miso paste & miso soup", "Soy sauce & tamari", "Many processed foods & meat alternatives", "Some breads & baked goods"], easyFoods: ["Soft tofu cubes in soup or mashed", "Edamame (shelled, soft-cooked)", "A small amount of miso stirred into food", "Soy milk in porridge or a smoothie"] } },
  { id: "sesame", label: "Sesame", emoji: "\u{1F33F}", defaultDays: 10,
    examples: "tahini, hummus, sesame oil, sesame seeds, bagels",
    clinicalNote: "Sesame allergy is less commonly outgrown than other allergens \u2014 regular maintenance matters.",
    info: { about: "Sesame is a top-9 allergen in Australia. It's highly concentrated in certain foods. Unlike many childhood allergens, sesame allergy is less commonly outgrown, making regular maintenance particularly important.", hiddenIn: ["Tahini & hummus", "Sesame oil (common in Asian cooking)", "Bagels, burger buns & artisan breads", "Dukkah & za'atar spice blends", "Many Middle Eastern dishes", "Some crackers & muesli bars"], easyFoods: ["Hummus as a dip or spread", "Tahini stirred into yoghurt or porridge", "A small amount of sesame oil in stir-fry", "Bread with sesame seeds on top"] } },
  { id: "fish", label: "Fish", emoji: "\u{1F41F}", defaultDays: 14,
    examples: "salmon, tuna, cod, tinned fish, sardines",
    clinicalNote: "Fish allergy often persists into adulthood \u2014 variety across fish species is important.",
    info: { about: "Fish allergy tends to persist into adulthood more than many childhood allergens. Different fish species contain different proteins, so introducing several types (e.g. white fish, oily fish, tinned fish) is recommended.", hiddenIn: ["Fish sauce (common in Asian cooking)", "Worcestershire sauce", "Caesar salad dressing (anchovies)", "Omega-3 capsule supplements", "Imitation crab / surimi", "Some stocks & broths"], easyFoods: ["Flaked tinned salmon or tuna mixed into food", "Poached white fish blended into mash", "Small piece of pan-cooked salmon", "Sardines on toast (mashed, no bones)"] } },
  { id: "shellfish", label: "Shellfish", emoji: "\u{1F990}", defaultDays: 14,
    examples: "prawn, crab, lobster, oyster, mussel, squid",
    clinicalNote: "Crustaceans and molluscs are distinct protein families \u2014 try to introduce both types.",
    info: { about: "Shellfish allergy covers crustaceans (prawn, crab, lobster) and molluscs (oyster, mussel, clam, squid) \u2014 these are distinct protein families and both should ideally be introduced. Shellfish allergy commonly persists for life.", hiddenIn: ["Prawn crackers & prawn toast", "Oyster sauce & some fish sauces", "Paella, risotto & seafood pasta", "Some sushi & Japanese dishes", "Seafood soups & bouillabaisse", "Glucosamine supplements (derived from shellfish)"], easyFoods: ["Finely chopped cooked prawn in rice or pasta", "Crab meat flaked into a sauce", "A small amount of oyster sauce in stir-fry", "Mussel in a soup or pasta"] } },
];

export const SEVERITY = [
  { id: "none", label: "No reaction", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { id: "mild", label: "Mild", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  { id: "moderate", label: "Moderate", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  { id: "severe", label: "Severe", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
];

export const STORAGE_KEY = "baby-allergen-tracker-v5";

export const SC = {
  never:   { label: "Never logged", color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe", dot: "#7c3aed" },
  good:    { label: "Good",         color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", dot: "#16a34a" },
  soon:    { label: "Due soon",     color: "#b45309", bg: "#fffbeb", border: "#fde68a", dot: "#d97706" },
  overdue: { label: "Overdue",      color: "#b91c1c", bg: "#fef2f2", border: "#fecaca", dot: "#dc2626" },
};

export const F = "'Inter', system-ui, -apple-system, sans-serif";
export const BLANK_LOG = { date: today(), food: "", amount: "", notes: "", foodId: null, severity: "none" };
export const BLANK_FOOD = { name: "", allergens: [] };

export function statusVar(statusKey, prop) {
  return `var(--status-${statusKey}-${prop})`;
}

export function severityVar(sevId, prop) {
  return `var(--severity-${sevId}-${prop})`;
}
