"use client";

import { useState } from "react";
import Link from "next/link";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaStar } from "react-icons/fa";

// --- Types ---
interface Question {
  id: string;
  text: string;
  subtext?: string;
  options: { label: string; emoji: string; value: string }[];
}

interface CravingProfile {
  category: string;
  emoji: string;
  label: string;
  description: string;
  confidence: number;
  signals: string[];
}

interface FoodRecommendation {
  name: string;
  restaurant: string;
  emoji: string;
  rating: number;
  price: string;
  prepTime: string;
  matchScore: number;
  reason: string;
  tags: string[];
}

// --- Smarter Question Bank ---
// These are INDIRECT -the AI infers craving type from behavioral answers
const round1Questions: Question[] = [
  {
    id: "hunger",
    text: "How hungry are you right now?",
    subtext: "Be honest with your stomach",
    options: [
      { label: "I could eat a whole buffet", emoji: "🤤", value: "starving" },
      { label: "A little hungry", emoji: "😊", value: "moderate" },
      { label: "Not really hungry, just bored", emoji: "😐", value: "bored" },
      { label: "Just want to munch something", emoji: "🍿", value: "munch" },
    ],
  },
  {
    id: "temperature",
    text: "What sounds more appealing?",
    subtext: "Imagine holding it in your hand...",
    options: [
      { label: "Something warm & steaming", emoji: "🔥", value: "hot" },
      { label: "Something chilled & refreshing", emoji: "🧊", value: "cold" },
      { label: "Room temperature is fine", emoji: "😌", value: "room" },
    ],
  },
  {
    id: "last_eaten",
    text: "When did you last eat?",
    subtext: "This tells us a lot about what you need",
    options: [
      { label: "Less than an hour ago", emoji: "⏰", value: "just_ate" },
      { label: "2-3 hours ago", emoji: "🕐", value: "few_hours" },
      { label: "4+ hours ago", emoji: "🕓", value: "long_ago" },
      { label: "I skipped a meal", emoji: "😵", value: "skipped" },
    ],
  },
  {
    id: "energy",
    text: "What's your energy level?",
    subtext: "Food should match your vibe",
    options: [
      { label: "Need a boost badly", emoji: "🔋", value: "low" },
      { label: "Feeling kinda sluggish", emoji: "😴", value: "sluggish" },
      { label: "I'm doing good", emoji: "💪", value: "good" },
      { label: "Winding down for the night", emoji: "🌙", value: "winding_down" },
    ],
  },
  {
    id: "first_thought",
    text: "Close your eyes. What pops into your head first?",
    subtext: "Don't overthink -go with your gut!",
    options: [
      { label: "Something cheesy & melty", emoji: "🧀", value: "cheesy" },
      { label: "Something chocolatey", emoji: "🍫", value: "chocolate" },
      { label: "Something spicy & flavorful", emoji: "🌶️", value: "spicy" },
      { label: "Something tangy & fresh", emoji: "🍋", value: "tangy" },
      { label: "Honestly... no clue", emoji: "🤷", value: "blank" },
    ],
  },
  {
    id: "situation",
    text: "What are you up to right now?",
    subtext: "Your setting changes what food fits",
    options: [
      { label: "Working or studying", emoji: "💻", value: "working" },
      { label: "Chilling at home", emoji: "🛋️", value: "chilling" },
      { label: "Hanging with friends", emoji: "👯", value: "friends" },
      { label: "Just got home, exhausted", emoji: "🚶", value: "tired_home" },
      { label: "Treating myself today", emoji: "💅", value: "treating" },
    ],
  },
  {
    id: "plate_vision",
    text: "If someone handed you a plate, you'd want it to be...",
    subtext: "Think about the FEEL of the food",
    options: [
      { label: "Crunchy & crispy", emoji: "🥨", value: "crunchy" },
      { label: "Soft, melty & gooey", emoji: "🫠", value: "melty" },
      { label: "Saucy & rich", emoji: "🍲", value: "saucy" },
      { label: "Light & refreshing", emoji: "🥗", value: "light" },
      { label: "Loaded & overflowing", emoji: "🍔", value: "loaded" },
    ],
  },
  {
    id: "spice",
    text: "Spice level?",
    subtext: "Your tongue, your rules",
    options: [
      { label: "No spice at all", emoji: "😇", value: "none" },
      { label: "Mild - just a hint", emoji: "🌶️", value: "mild" },
      { label: "Medium - some kick", emoji: "🔥", value: "medium" },
      { label: "BURN IT UP", emoji: "💀🌶️", value: "extreme" },
    ],
  },
  {
    id: "diet",
    text: "Dietary preference?",
    options: [
      { label: "Veg", emoji: "🥬", value: "veg" },
      { label: "Non-veg", emoji: "🍗", value: "nonveg" },
      { label: "Egg is fine", emoji: "🥚", value: "egg" },
      { label: "Vegan", emoji: "🌱", value: "vegan" },
    ],
  },
  {
    id: "budget",
    text: "Budget for this craving?",
    subtext: "Per person",
    options: [
      { label: "Under ₹100", emoji: "💰", value: "low" },
      { label: "₹100-250", emoji: "💰💰", value: "mid" },
      { label: "₹250-500", emoji: "💰💰💰", value: "high" },
      { label: "Treat mode -no limit", emoji: "💎", value: "unlimited" },
    ],
  },
];

const round2Questions: Question[] = [
  {
    id: "eating_reason",
    text: "Why are you eating right now?",
    subtext: "Be real with yourself",
    options: [
      { label: "I need comfort", emoji: "🫂", value: "comfort" },
      { label: "Rewarding / treating myself", emoji: "🏆", value: "reward" },
      { label: "Just need fuel", emoji: "⛽", value: "fuel" },
      { label: "Social -eating with others", emoji: "🎉", value: "social" },
      { label: "Boredom / habit", emoji: "📱", value: "boredom" },
    ],
  },
  {
    id: "eat_setting",
    text: "Would you eat this on the couch or at a table?",
    subtext: "This secretly tells us portion type",
    options: [
      { label: "Couch -something easy to eat", emoji: "🛋️", value: "couch" },
      { label: "Table -a proper sit-down meal", emoji: "🍽️", value: "table" },
      { label: "On the go -one hand", emoji: "🚶", value: "on_the_go" },
    ],
  },
  {
    id: "ingredient_pull",
    text: "Any ingredient calling your name?",
    subtext: "Sometimes your body knows what it wants",
    options: [
      { label: "Cheese", emoji: "🧀", value: "cheese" },
      { label: "Chocolate", emoji: "🍫", value: "chocolate" },
      { label: "Paneer", emoji: "🟨", value: "paneer" },
      { label: "Chicken", emoji: "🍗", value: "chicken" },
      { label: "Nothing specific", emoji: "🤷", value: "none" },
    ],
  },
  {
    id: "after_feeling",
    text: "After eating, you want to feel...",
    subtext: "Think about the after-effect",
    options: [
      { label: "Satisfied & full", emoji: "😌", value: "full" },
      { label: "Light & energized", emoji: "⚡", value: "energized" },
      { label: "Happy & indulged", emoji: "😍", value: "indulged" },
      { label: "Just not hungry", emoji: "🤷", value: "neutral" },
    ],
  },
  {
    id: "adventure",
    text: "Last one -play it safe or go wild?",
    subtext: "Final piece of the puzzle!",
    options: [
      { label: "Safe -something I know works", emoji: "🏠", value: "safe" },
      { label: "Wild -surprise me!", emoji: "🎲", value: "wild" },
    ],
  },
];

// --- Craving Category Analysis Engine ---
type CravingCategory =
  | "full_meal"
  | "quick_snack"
  | "dessert_sweet"
  | "comfort_food"
  | "light_healthy"
  | "street_food"
  | "beverage"
  | "indulgence";

interface CategoryScore {
  category: CravingCategory;
  score: number;
  emoji: string;
  label: string;
  description: string;
  signals: string[];
}

function analyzeCraving(answers: Record<string, string>): CravingProfile {
  const categories: CategoryScore[] = [
    { category: "full_meal", score: 0, emoji: "🍛", label: "Full Meal", description: "You need a proper, filling meal -your body is asking for real food", signals: [] },
    { category: "quick_snack", score: 0, emoji: "🍿", label: "Quick Snack", description: "You're not that hungry -just want something to munch on while you vibe", signals: [] },
    { category: "dessert_sweet", score: 0, emoji: "🍰", label: "Dessert / Sweet Treat", description: "Your brain is craving sugar -a sweet escape is what you need", signals: [] },
    { category: "comfort_food", score: 0, emoji: "🫂", label: "Comfort Food", description: "You need food that feels like a warm hug -rich, familiar, soul-satisfying", signals: [] },
    { category: "light_healthy", score: 0, emoji: "🥗", label: "Light & Healthy", description: "Your body wants something clean and refreshing -fuel without the guilt", signals: [] },
    { category: "street_food", score: 0, emoji: "🥟", label: "Street Food / Chaat", description: "You're craving bold, tangy, chatpata flavors -street food energy!", signals: [] },
    { category: "beverage", score: 0, emoji: "🥤", label: "Beverage / Drink", description: "More thirsty than hungry -a refreshing drink or shake will hit the spot", signals: [] },
    { category: "indulgence", score: 0, emoji: "🍕", label: "Indulgence / Junk", description: "You want to go all-out -cheesy, loaded, zero guilt zone", signals: [] },
  ];

  const s = (cat: CravingCategory, points: number, signal: string) => {
    const c = categories.find((c) => c.category === cat)!;
    c.score += points;
    if (signal) c.signals.push(signal);
  };

  // --- Hunger level analysis ---
  if (answers.hunger === "starving") {
    s("full_meal", 5, "You're starving -need a real meal");
    s("comfort_food", 2, "");
  }
  if (answers.hunger === "moderate") {
    s("full_meal", 2, "");
    s("quick_snack", 2, "");
    s("street_food", 1, "");
  }
  if (answers.hunger === "bored") {
    s("quick_snack", 4, "Not really hungry -just bored");
    s("dessert_sweet", 3, "Boredom eating = sweet craving");
    s("beverage", 2, "");
  }
  if (answers.hunger === "munch") {
    s("quick_snack", 5, "Just want to munch something");
    s("street_food", 3, "Munching = street food vibes");
    s("indulgence", 1, "");
  }

  // --- Temperature ---
  if (answers.temperature === "hot") {
    s("full_meal", 2, "Want something warm");
    s("comfort_food", 3, "Hot food = comfort signal");
    s("street_food", 1, "");
  }
  if (answers.temperature === "cold") {
    s("beverage", 4, "Craving something chilled");
    s("dessert_sweet", 3, "Cold = ice cream / shake territory");
    s("light_healthy", 2, "");
  }
  if (answers.temperature === "room") {
    s("quick_snack", 2, "");
    s("indulgence", 1, "");
  }

  // --- Last eaten ---
  if (answers.last_eaten === "just_ate") {
    s("dessert_sweet", 4, "Just ate -craving dessert after meal");
    s("beverage", 3, "Post-meal drink");
    s("full_meal", -3, "");
  }
  if (answers.last_eaten === "few_hours") {
    s("quick_snack", 3, "Few hours gap -snack time");
    s("street_food", 2, "");
    s("full_meal", 1, "");
  }
  if (answers.last_eaten === "long_ago") {
    s("full_meal", 4, "Haven't eaten in 4+ hours");
    s("comfort_food", 2, "");
  }
  if (answers.last_eaten === "skipped") {
    s("full_meal", 5, "Skipped a meal -need proper food");
    s("comfort_food", 3, "Skipped meal + hunger = comfort mode");
  }

  // --- Energy ---
  if (answers.energy === "low") {
    s("beverage", 3, "Low energy -need a caffeine/sugar boost");
    s("comfort_food", 2, "Low energy = comfort craving");
    s("dessert_sweet", 2, "Sugar for energy");
  }
  if (answers.energy === "sluggish") {
    s("comfort_food", 3, "Sluggish = comfort food mood");
    s("quick_snack", 2, "");
    s("indulgence", 1, "");
  }
  if (answers.energy === "good") {
    s("light_healthy", 3, "Good energy -keep it light");
    s("street_food", 1, "");
  }
  if (answers.energy === "winding_down") {
    s("dessert_sweet", 3, "Winding down = sweet treat time");
    s("light_healthy", 2, "Night = lighter food");
    s("beverage", 2, "Evening drink");
  }

  // --- First thought (subconscious craving) ---
  if (answers.first_thought === "cheesy") {
    s("indulgence", 4, "First thought was cheese -indulgence mode");
    s("comfort_food", 3, "Cheese = comfort");
    s("full_meal", 1, "");
  }
  if (answers.first_thought === "chocolate") {
    s("dessert_sweet", 5, "Chocolate on your mind -dessert craving confirmed");
    s("beverage", 2, "Chocolate drink?");
  }
  if (answers.first_thought === "spicy") {
    s("street_food", 4, "Craving spice -street food calling");
    s("full_meal", 2, "Spicy meal");
    s("comfort_food", 2, "");
  }
  if (answers.first_thought === "tangy") {
    s("street_food", 5, "Tangy craving = chaat/street food");
    s("light_healthy", 2, "");
    s("beverage", 1, "Tangy drink like lemonade");
  }
  if (answers.first_thought === "blank") {
    s("comfort_food", 2, "No idea = go with comfort");
    s("quick_snack", 2, "");
  }

  // --- Situation ---
  if (answers.situation === "working") {
    s("quick_snack", 3, "Working -need something quick");
    s("beverage", 3, "Coffee/tea while working");
    s("light_healthy", 1, "");
  }
  if (answers.situation === "chilling") {
    s("indulgence", 3, "Chilling at home = indulgence time");
    s("dessert_sweet", 2, "");
    s("comfort_food", 2, "");
  }
  if (answers.situation === "friends") {
    s("street_food", 3, "With friends = sharing food");
    s("indulgence", 3, "Group indulgence");
    s("full_meal", 2, "");
  }
  if (answers.situation === "tired_home") {
    s("comfort_food", 4, "Exhausted -need comfort");
    s("full_meal", 3, "Tired = need proper food");
  }
  if (answers.situation === "treating") {
    s("indulgence", 4, "Treat mode -go big");
    s("dessert_sweet", 3, "Treating = something special");
  }

  // --- Plate vision (texture) ---
  if (answers.plate_vision === "crunchy") {
    s("street_food", 3, "Crunchy = fried snacks");
    s("quick_snack", 3, "");
    s("indulgence", 1, "");
  }
  if (answers.plate_vision === "melty") {
    s("dessert_sweet", 3, "Melty = chocolate / cheese");
    s("indulgence", 3, "Gooey indulgence");
    s("comfort_food", 2, "");
  }
  if (answers.plate_vision === "saucy") {
    s("comfort_food", 4, "Saucy & rich = pure comfort");
    s("full_meal", 3, "Gravy-based meal");
  }
  if (answers.plate_vision === "light") {
    s("light_healthy", 5, "Want something light");
    s("beverage", 2, "");
    s("quick_snack", 1, "");
  }
  if (answers.plate_vision === "loaded") {
    s("indulgence", 5, "Loaded plate = full indulgence");
    s("full_meal", 3, "");
    s("comfort_food", 2, "");
  }

  // --- Round 2 refinements ---
  if (answers.eating_reason === "comfort") {
    s("comfort_food", 5, "Eating for comfort");
    s("dessert_sweet", 2, "");
  }
  if (answers.eating_reason === "reward") {
    s("indulgence", 4, "Reward eating");
    s("dessert_sweet", 3, "Treating yourself = sweet");
  }
  if (answers.eating_reason === "fuel") {
    s("full_meal", 4, "Need fuel");
    s("light_healthy", 2, "");
  }
  if (answers.eating_reason === "social") {
    s("street_food", 3, "Social eating");
    s("indulgence", 2, "");
    s("full_meal", 2, "");
  }
  if (answers.eating_reason === "boredom") {
    s("quick_snack", 4, "Boredom eating");
    s("dessert_sweet", 2, "");
  }

  if (answers.eat_setting === "couch") {
    s("quick_snack", 3, "Couch eating = snack format");
    s("dessert_sweet", 2, "");
    s("indulgence", 2, "");
  }
  if (answers.eat_setting === "table") {
    s("full_meal", 4, "Sitting at table = proper meal");
    s("comfort_food", 2, "");
  }
  if (answers.eat_setting === "on_the_go") {
    s("quick_snack", 4, "On the go = grab & eat");
    s("street_food", 3, "");
    s("beverage", 2, "");
  }

  if (answers.ingredient_pull === "cheese") {
    s("indulgence", 3, "Cheese craving");
    s("comfort_food", 2, "");
  }
  if (answers.ingredient_pull === "chocolate") {
    s("dessert_sweet", 5, "Chocolate craving = dessert");
  }
  if (answers.ingredient_pull === "paneer") {
    s("full_meal", 2, "Paneer = meal ingredient");
    s("comfort_food", 2, "");
  }
  if (answers.ingredient_pull === "chicken") {
    s("full_meal", 3, "Chicken = meal");
    s("comfort_food", 2, "");
  }

  if (answers.after_feeling === "full") {
    s("full_meal", 4, "Want to feel full");
    s("comfort_food", 2, "");
  }
  if (answers.after_feeling === "energized") {
    s("light_healthy", 4, "Want energy after eating");
    s("beverage", 2, "");
  }
  if (answers.after_feeling === "indulged") {
    s("indulgence", 4, "Want indulgence feeling");
    s("dessert_sweet", 3, "");
  }
  if (answers.after_feeling === "neutral") {
    s("quick_snack", 3, "Just want to not be hungry");
  }

  // Sort and pick winner
  categories.sort((a, b) => b.score - a.score);
  const winner = categories[0];
  const totalScore = categories.reduce((sum, c) => sum + Math.max(0, c.score), 0);
  const confidence = Math.min(97, Math.round((winner.score / totalScore) * 100) + 15);

  return {
    category: winner.category,
    emoji: winner.emoji,
    label: winner.label,
    description: winner.description,
    confidence,
    signals: winner.signals.filter(Boolean).slice(0, 4),
  };
}

// --- Food Database ---
interface FoodItem extends FoodRecommendation {
  categories: CravingCategory[];
  diet: string[];
  spice: string[];
  priceNum: number;
  ingredients: string[];
}

const foodDatabase: FoodItem[] = [
  // --- Full Meals ---
  { name: "Chicken Biryani", restaurant: "Meghana Foods", emoji: "🍛", rating: 4.5, price: "₹249", prepTime: "25 min", matchScore: 0, reason: "", tags: ["Non-veg", "Spicy", "Indian"], categories: ["full_meal", "comfort_food"], diet: ["nonveg"], spice: ["medium", "extreme"], priceNum: 249, ingredients: ["chicken"] },
  { name: "Paneer Butter Masala + Naan", restaurant: "Punjab Grill", emoji: "🧈", rating: 4.3, price: "₹299", prepTime: "20 min", matchScore: 0, reason: "", tags: ["Veg", "Rich", "North Indian"], categories: ["full_meal", "comfort_food"], diet: ["veg", "egg"], spice: ["mild", "medium"], priceNum: 299, ingredients: ["paneer", "cheese"] },
  { name: "Chicken Fried Rice + Manchurian", restaurant: "Dragon Bowl", emoji: "🍜", rating: 4.1, price: "₹219", prepTime: "15 min", matchScore: 0, reason: "", tags: ["Non-veg", "Chinese", "Filling"], categories: ["full_meal", "comfort_food", "indulgence"], diet: ["nonveg"], spice: ["medium"], priceNum: 219, ingredients: ["chicken"] },
  { name: "Masala Dosa + Filter Coffee", restaurant: "Vidyarthi Bhavan", emoji: "🥞", rating: 4.7, price: "₹129", prepTime: "10 min", matchScore: 0, reason: "", tags: ["Veg", "South Indian", "Classic"], categories: ["full_meal", "light_healthy", "comfort_food"], diet: ["veg", "vegan", "egg"], spice: ["mild", "medium"], priceNum: 129, ingredients: [] },
  { name: "Mutton Rogan Josh + Rumali Roti", restaurant: "Kebab Factory", emoji: "🍖", rating: 4.6, price: "₹449", prepTime: "30 min", matchScore: 0, reason: "", tags: ["Non-veg", "Premium", "Mughlai"], categories: ["full_meal", "comfort_food", "indulgence"], diet: ["nonveg"], spice: ["medium", "extreme"], priceNum: 449, ingredients: ["chicken"] },
  { name: "Rajma Chawal", restaurant: "Bikanervala", emoji: "🫘", rating: 4.2, price: "₹149", prepTime: "12 min", matchScore: 0, reason: "", tags: ["Veg", "North Indian", "Homestyle"], categories: ["full_meal", "comfort_food"], diet: ["veg", "vegan", "egg"], spice: ["mild"], priceNum: 149, ingredients: [] },
  { name: "Egg Biryani", restaurant: "Behrouz", emoji: "🥚", rating: 4.3, price: "₹199", prepTime: "20 min", matchScore: 0, reason: "", tags: ["Egg", "Biryani", "Filling"], categories: ["full_meal", "comfort_food"], diet: ["egg", "nonveg"], spice: ["medium"], priceNum: 199, ingredients: [] },

  // --- Quick Snacks ---
  { name: "Samosa Chaat", restaurant: "Haldiram's", emoji: "🥟", rating: 4.0, price: "₹79", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Veg", "Street Food", "Tangy"], categories: ["quick_snack", "street_food"], diet: ["veg", "vegan", "egg"], spice: ["medium"], priceNum: 79, ingredients: [] },
  { name: "Pani Puri (6pc)", restaurant: "Chaat Street", emoji: "💧", rating: 4.3, price: "₹49", prepTime: "3 min", matchScore: 0, reason: "", tags: ["Veg", "Chaat", "Tangy"], categories: ["quick_snack", "street_food"], diet: ["veg", "vegan", "egg"], spice: ["medium", "extreme"], priceNum: 49, ingredients: [] },
  { name: "French Fries (Large)", restaurant: "McDonald's", emoji: "🍟", rating: 4.0, price: "₹119", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Veg", "Crispy", "Fast Food"], categories: ["quick_snack", "indulgence"], diet: ["veg", "vegan", "egg"], spice: ["none", "mild"], priceNum: 119, ingredients: [] },
  { name: "Chicken Momos (8pc)", restaurant: "Momo Point", emoji: "🥟", rating: 4.2, price: "₹99", prepTime: "10 min", matchScore: 0, reason: "", tags: ["Non-veg", "Steamed", "Quick"], categories: ["quick_snack", "street_food"], diet: ["nonveg"], spice: ["medium"], priceNum: 99, ingredients: ["chicken"] },
  { name: "Aloo Tikki Burger", restaurant: "McDonald's", emoji: "🍔", rating: 3.9, price: "₹59", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Veg", "Budget", "Quick"], categories: ["quick_snack"], diet: ["veg", "egg"], spice: ["mild"], priceNum: 59, ingredients: [] },
  { name: "Spring Rolls (4pc)", restaurant: "Wok Express", emoji: "🥢", rating: 4.0, price: "₹89", prepTime: "8 min", matchScore: 0, reason: "", tags: ["Veg", "Crispy", "Chinese"], categories: ["quick_snack", "street_food"], diet: ["veg", "egg"], spice: ["mild"], priceNum: 89, ingredients: [] },

  // --- Dessert / Sweet ---
  { name: "Chocolate Lava Cake", restaurant: "Theobroma", emoji: "🍫", rating: 4.6, price: "₹189", prepTime: "10 min", matchScore: 0, reason: "", tags: ["Dessert", "Chocolate", "Premium"], categories: ["dessert_sweet", "indulgence"], diet: ["veg", "egg"], spice: ["none"], priceNum: 189, ingredients: ["chocolate"] },
  { name: "Ice Cream Sundae", restaurant: "Baskin Robbins", emoji: "🍨", rating: 4.5, price: "₹199", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Dessert", "Cold", "Sweet"], categories: ["dessert_sweet", "beverage"], diet: ["veg", "egg"], spice: ["none"], priceNum: 199, ingredients: ["chocolate"] },
  { name: "Gulab Jamun (4pc)", restaurant: "Bikanervala", emoji: "🍮", rating: 4.3, price: "₹79", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Indian", "Sweet", "Hot"], categories: ["dessert_sweet"], diet: ["veg", "egg"], spice: ["none"], priceNum: 79, ingredients: [] },
  { name: "Belgian Chocolate Shake", restaurant: "Keventers", emoji: "🥤", rating: 4.4, price: "₹169", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Beverage", "Chocolate", "Cold"], categories: ["dessert_sweet", "beverage"], diet: ["veg", "egg"], spice: ["none"], priceNum: 169, ingredients: ["chocolate"] },
  { name: "Red Velvet Pastry", restaurant: "Theobroma", emoji: "🍰", rating: 4.4, price: "₹149", prepTime: "3 min", matchScore: 0, reason: "", tags: ["Dessert", "Cake", "Premium"], categories: ["dessert_sweet"], diet: ["veg", "egg"], spice: ["none"], priceNum: 149, ingredients: ["chocolate", "cheese"] },
  { name: "Rasgulla (4pc)", restaurant: "KC Das", emoji: "⚪", rating: 4.2, price: "₹89", prepTime: "3 min", matchScore: 0, reason: "", tags: ["Indian", "Sweet", "Light"], categories: ["dessert_sweet", "light_healthy"], diet: ["veg", "egg"], spice: ["none"], priceNum: 89, ingredients: [] },

  // --- Comfort Food ---
  { name: "Butter Chicken + Garlic Naan", restaurant: "Punjab Grill", emoji: "🍗", rating: 4.5, price: "₹349", prepTime: "20 min", matchScore: 0, reason: "", tags: ["Non-veg", "Rich", "North Indian"], categories: ["comfort_food", "full_meal", "indulgence"], diet: ["nonveg"], spice: ["mild", "medium"], priceNum: 349, ingredients: ["chicken"] },
  { name: "Mac & Cheese", restaurant: "Pasta Street", emoji: "🧀", rating: 4.1, price: "₹229", prepTime: "12 min", matchScore: 0, reason: "", tags: ["Veg", "Cheesy", "Italian"], categories: ["comfort_food", "indulgence"], diet: ["veg", "egg"], spice: ["none", "mild"], priceNum: 229, ingredients: ["cheese"] },
  { name: "Dal Makhani + Butter Naan", restaurant: "Dhabha Express", emoji: "🫘", rating: 4.4, price: "₹199", prepTime: "15 min", matchScore: 0, reason: "", tags: ["Veg", "Rich", "Punjabi"], categories: ["comfort_food", "full_meal"], diet: ["veg", "egg"], spice: ["mild"], priceNum: 199, ingredients: [] },
  { name: "Schezwan Noodles", restaurant: "Wok Express", emoji: "🍜", rating: 4.1, price: "₹179", prepTime: "12 min", matchScore: 0, reason: "", tags: ["Veg", "Chinese", "Spicy"], categories: ["comfort_food", "full_meal"], diet: ["veg", "egg"], spice: ["medium", "extreme"], priceNum: 179, ingredients: [] },

  // --- Light & Healthy ---
  { name: "Quinoa Buddha Bowl", restaurant: "Green Theory", emoji: "🥗", rating: 4.3, price: "₹329", prepTime: "12 min", matchScore: 0, reason: "", tags: ["Vegan", "Healthy", "Bowl"], categories: ["light_healthy"], diet: ["veg", "vegan", "egg"], spice: ["none", "mild"], priceNum: 329, ingredients: [] },
  { name: "Grilled Chicken Salad", restaurant: "Freshmenu", emoji: "🥗", rating: 4.2, price: "₹249", prepTime: "10 min", matchScore: 0, reason: "", tags: ["Non-veg", "Protein", "Healthy"], categories: ["light_healthy"], diet: ["nonveg"], spice: ["none", "mild"], priceNum: 249, ingredients: ["chicken"] },
  { name: "Fruit Bowl + Yogurt", restaurant: "FreshBowl", emoji: "🍓", rating: 4.0, price: "₹149", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Veg", "Fresh", "Light"], categories: ["light_healthy", "dessert_sweet"], diet: ["veg", "egg"], spice: ["none"], priceNum: 149, ingredients: [] },
  { name: "Idli Sambar (4pc)", restaurant: "Vasudev Adiga's", emoji: "🫕", rating: 4.4, price: "₹69", prepTime: "8 min", matchScore: 0, reason: "", tags: ["Veg", "South Indian", "Steamed"], categories: ["light_healthy", "full_meal"], diet: ["veg", "vegan", "egg"], spice: ["mild"], priceNum: 69, ingredients: [] },

  // --- Street Food ---
  { name: "Chole Bhature", restaurant: "Bikanervala", emoji: "🫓", rating: 4.3, price: "₹129", prepTime: "10 min", matchScore: 0, reason: "", tags: ["Veg", "North Indian", "Spicy"], categories: ["street_food", "full_meal", "comfort_food"], diet: ["veg", "vegan", "egg"], spice: ["medium", "extreme"], priceNum: 129, ingredients: [] },
  { name: "Pav Bhaji", restaurant: "Sardar Pav Bhaji", emoji: "🧈", rating: 4.4, price: "₹99", prepTime: "10 min", matchScore: 0, reason: "", tags: ["Veg", "Mumbai Style", "Buttery"], categories: ["street_food", "comfort_food"], diet: ["veg", "egg"], spice: ["medium"], priceNum: 99, ingredients: [] },
  { name: "Chicken Kathi Roll", restaurant: "Rollsking", emoji: "🌯", rating: 4.1, price: "₹139", prepTime: "10 min", matchScore: 0, reason: "", tags: ["Non-veg", "Roll", "Quick"], categories: ["street_food", "quick_snack"], diet: ["nonveg"], spice: ["medium"], priceNum: 139, ingredients: ["chicken"] },
  { name: "Vada Pav", restaurant: "Goli Vada Pav", emoji: "🍔", rating: 4.0, price: "₹39", prepTime: "3 min", matchScore: 0, reason: "", tags: ["Veg", "Mumbai", "Spicy"], categories: ["street_food", "quick_snack"], diet: ["veg", "vegan", "egg"], spice: ["medium"], priceNum: 39, ingredients: [] },
  { name: "Dahi Puri", restaurant: "Chaat Street", emoji: "🥣", rating: 4.2, price: "₹59", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Veg", "Chaat", "Tangy"], categories: ["street_food", "quick_snack"], diet: ["veg", "egg"], spice: ["mild", "medium"], priceNum: 59, ingredients: [] },

  // --- Beverages ---
  { name: "Cold Coffee Frappe", restaurant: "Third Wave", emoji: "☕", rating: 4.4, price: "₹189", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Cold", "Caffeine", "Refreshing"], categories: ["beverage"], diet: ["veg", "egg"], spice: ["none"], priceNum: 189, ingredients: [] },
  { name: "Mango Lassi", restaurant: "Lassi Shop", emoji: "🥭", rating: 4.3, price: "₹79", prepTime: "3 min", matchScore: 0, reason: "", tags: ["Sweet", "Refreshing", "Indian"], categories: ["beverage", "dessert_sweet"], diet: ["veg", "egg"], spice: ["none"], priceNum: 79, ingredients: [] },
  { name: "Masala Chai + Bun Maska", restaurant: "Chai Point", emoji: "☕", rating: 4.2, price: "₹89", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Hot", "Classic", "Comfort"], categories: ["beverage", "quick_snack", "comfort_food"], diet: ["veg", "egg"], spice: ["mild"], priceNum: 89, ingredients: [] },
  { name: "Fresh Watermelon Juice", restaurant: "Juice Junction", emoji: "🍉", rating: 4.1, price: "₹59", prepTime: "3 min", matchScore: 0, reason: "", tags: ["Fresh", "Healthy", "Cold"], categories: ["beverage", "light_healthy"], diet: ["veg", "vegan", "egg"], spice: ["none"], priceNum: 59, ingredients: [] },

  // --- Indulgence ---
  { name: "Loaded Cheese Burst Pizza", restaurant: "Domino's", emoji: "🍕", rating: 4.1, price: "₹399", prepTime: "20 min", matchScore: 0, reason: "", tags: ["Veg", "Cheesy", "Italian"], categories: ["indulgence", "comfort_food", "full_meal"], diet: ["veg", "egg"], spice: ["none", "mild"], priceNum: 399, ingredients: ["cheese"] },
  { name: "Whopper Meal", restaurant: "Burger King", emoji: "🍔", rating: 4.2, price: "₹249", prepTime: "10 min", matchScore: 0, reason: "", tags: ["Non-veg", "American", "Filling"], categories: ["indulgence", "full_meal"], diet: ["nonveg"], spice: ["none", "mild"], priceNum: 249, ingredients: [] },
  { name: "Cheesy Nachos Supreme", restaurant: "Taco Bell", emoji: "🧀", rating: 4.0, price: "₹179", prepTime: "8 min", matchScore: 0, reason: "", tags: ["Veg", "Mexican", "Loaded"], categories: ["indulgence", "quick_snack"], diet: ["veg", "egg"], spice: ["mild", "medium"], priceNum: 179, ingredients: ["cheese"] },
  { name: "Double Chocolate Brownie + Ice Cream", restaurant: "Theobroma", emoji: "🍫", rating: 4.7, price: "₹249", prepTime: "5 min", matchScore: 0, reason: "", tags: ["Dessert", "Premium", "Rich"], categories: ["indulgence", "dessert_sweet"], diet: ["veg", "egg"], spice: ["none"], priceNum: 249, ingredients: ["chocolate"] },
  { name: "Paneer Tikka Pizza", restaurant: "Domino's", emoji: "🍕", rating: 4.0, price: "₹349", prepTime: "20 min", matchScore: 0, reason: "", tags: ["Veg", "Fusion", "Cheesy"], categories: ["indulgence", "comfort_food"], diet: ["veg", "egg"], spice: ["medium"], priceNum: 349, ingredients: ["cheese", "paneer"] },
];

// --- Recommendation Engine ---
function getRecommendations(
  answers: Record<string, string>,
  craving: CravingProfile
): FoodRecommendation[] {
  const scored = foodDatabase.map((item) => {
    let score = 0;

    // Primary: category match (biggest weight)
    if (item.categories.includes(craving.category as CravingCategory)) score += 10;
    // Secondary category partial match
    item.categories.forEach((cat) => {
      if (cat !== craving.category) score += 1;
    });

    // Diet filter (hard)
    const diet = answers.diet;
    if (diet === "veg" && !item.diet.includes("veg")) return { ...item, matchScore: -100, reason: "" };
    if (diet === "vegan" && !item.diet.includes("vegan")) return { ...item, matchScore: -100, reason: "" };
    if (diet === "nonveg" && item.diet.includes("nonveg")) score += 2;
    if (diet === "egg" && (item.diet.includes("egg") || item.diet.includes("veg"))) score += 1;

    // Spice match
    if (answers.spice && item.spice.includes(answers.spice)) score += 3;

    // Budget match
    if (answers.budget === "low" && item.priceNum <= 100) score += 3;
    if (answers.budget === "low" && item.priceNum > 150) score -= 5;
    if (answers.budget === "mid" && item.priceNum <= 250) score += 2;
    if (answers.budget === "mid" && item.priceNum > 300) score -= 3;
    if (answers.budget === "high" && item.priceNum <= 500) score += 1;
    if (answers.budget === "unlimited") score += 1;

    // Ingredient match from round 2
    if (answers.ingredient_pull && answers.ingredient_pull !== "none") {
      if (item.ingredients.includes(answers.ingredient_pull)) score += 4;
    }

    // Temperature alignment
    if (answers.temperature === "hot" && (
      item.tags.some(t => t.includes("Hot") || t.includes("Spicy") || t.includes("Steamed") || t.includes("Rich"))
    )) score += 2;
    if (answers.temperature === "cold" && (
      item.tags.some(t => t.includes("Cold") || t.includes("Fresh") || t.includes("Refreshing"))
    )) score += 2;

    // Texture from plate_vision
    if (answers.plate_vision === "crunchy" && item.tags.some(t => t.includes("Crispy") || t.includes("Crunchy"))) score += 2;
    if (answers.plate_vision === "melty" && item.tags.some(t => t.includes("Cheesy") || t.includes("Chocolate"))) score += 2;
    if (answers.plate_vision === "saucy" && item.tags.some(t => t.includes("Rich") || t.includes("Buttery"))) score += 2;
    if (answers.plate_vision === "light" && item.tags.some(t => t.includes("Light") || t.includes("Fresh") || t.includes("Healthy"))) score += 2;
    if (answers.plate_vision === "loaded" && item.tags.some(t => t.includes("Loaded") || t.includes("Filling"))) score += 2;

    // Adventure preference
    if (answers.adventure === "wild" && item.tags.some(t => t.includes("Fusion") || t.includes("Premium"))) score += 2;
    if (answers.adventure === "safe" && item.tags.some(t => t.includes("Classic") || t.includes("Homestyle") || t.includes("Mumbai"))) score += 2;

    return { ...item, matchScore: score, reason: "" };
  });

  return scored
    .filter((item) => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
    .map((item, i) => {
      const maxScore = Math.max(...scored.filter(s => s.matchScore > 0).map(s => s.matchScore), 1);
      const percent = Math.min(98, Math.round((item.matchScore / maxScore) * 100));
      return {
        name: item.name,
        restaurant: item.restaurant,
        emoji: item.emoji,
        rating: item.rating,
        price: item.price,
        prepTime: item.prepTime,
        tags: item.tags,
        matchScore: Math.max(percent, 75 - i * 8),
        reason: buildReason(craving, answers, item),
      };
    });
}

function buildReason(craving: CravingProfile, answers: Record<string, string>, item: FoodItem): string {
  const parts: string[] = [];

  if (item.categories.includes(craving.category as CravingCategory)) {
    const map: Record<string, string> = {
      full_meal: "fills the hunger gap you described",
      quick_snack: "perfect for casual munching",
      dessert_sweet: "satisfies your sweet craving",
      comfort_food: "exactly the comfort you need right now",
      light_healthy: "keeps it light & energizing",
      street_food: "bold flavors for your chatpata mood",
      beverage: "refreshing pick-me-up",
      indulgence: "full indulgence mode activated",
    };
    parts.push(map[craving.category] || "great match");
  }

  if (answers.first_thought === "cheesy" && item.ingredients.includes("cheese")) parts.push("has the cheese you imagined");
  if (answers.first_thought === "chocolate" && item.ingredients.includes("chocolate")) parts.push("chocolate craving sorted");
  if (answers.temperature === "cold" && item.tags.some(t => t.includes("Cold"))) parts.push("served cold as you wanted");
  if (answers.temperature === "hot" && item.tags.some(t => t.includes("Hot") || t.includes("Spicy"))) parts.push("served hot & fresh");

  return parts.length > 0 ? parts.slice(0, 2).join(" + ") : "tailored to your vibe";
}

// --- Component ---
type Phase = "intro" | "round1" | "checkpoint" | "round2" | "analyzing" | "craving_reveal" | "results";

export default function FoodAdvisorPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [cravingProfile, setCravingProfile] = useState<CravingProfile | null>(null);
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  const isRound2 = phase === "round2";
  const questions = isRound2 ? round2Questions : round1Questions;
  const totalQuestions = isRound2
    ? round1Questions.length + round2Questions.length
    : round1Questions.length;
  const questionIndex = isRound2
    ? round1Questions.length + currentQ
    : currentQ;

  const handleAnswer = (questionId: string, value: string) => {
    setSelectedOption(value);
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else if (phase === "round1") {
        setPhase("checkpoint");
      } else {
        runAnalysis(newAnswers);
      }
    }, 400);
  };

  const runAnalysis = (finalAnswers: Record<string, string>) => {
    setPhase("analyzing");
    setAnalyzeStep(0);

    // Staggered analysis animation
    const steps = [0, 1, 2, 3, 4];
    steps.forEach((step, i) => {
      setTimeout(() => setAnalyzeStep(step + 1), i * 600);
    });

    setTimeout(() => {
      const craving = analyzeCraving(finalAnswers);
      setCravingProfile(craving);
      const recs = getRecommendations(finalAnswers, craving);
      setRecommendations(recs);
      setPhase("craving_reveal");
    }, 3500);
  };

  const handleCheckpoint = (decided: boolean) => {
    if (decided) {
      runAnalysis(answers);
    } else {
      setCurrentQ(0);
      setPhase("round2");
    }
  };

  const restart = () => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers({});
    setCravingProfile(null);
    setRecommendations([]);
    setSelectedOption(null);
    setAnalyzeStep(0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link href="/">
          <MdKeyboardArrowLeft className="text-2xl text-swiggy-dark" />
        </Link>
        <div>
          <h1 className="text-sm font-bold text-swiggy-dark">Swiggy Food Advisor</h1>
          <p className="text-[10px] text-swiggy-light-gray">AI-powered craving decoder</p>
        </div>
      </header>

      {/* INTRO */}
      {phase === "intro" && (
        <div className="px-4 pt-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🧠</div>
            <h2 className="text-2xl font-extrabold text-swiggy-dark leading-tight">
              Can&apos;t decide<br />
              <span className="text-swiggy-orange">what to eat?</span>
            </h2>
            <p className="text-sm text-swiggy-gray mt-3 max-w-[300px] mx-auto leading-relaxed">
              Stop doom-scrolling menus. We&apos;ll decode your craving.
              are you really hungry, or just want dessert? Snack or full meal?
              <span className="font-bold text-swiggy-dark"> We&apos;ll figure it out.</span>
            </p>
          </div>

          {/* What we decode */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 mb-6">
            <p className="text-xs font-bold text-swiggy-dark mb-3">Our AI decodes your...</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { emoji: "🍰", label: "Snack vs Meal vs Dessert" },
                { emoji: "🌡️", label: "Hot vs Cold craving" },
                { emoji: "😌", label: "Comfort vs Adventure" },
                { emoji: "🎯", label: "Exact dish match" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-[10px] font-medium text-swiggy-dark">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex -space-x-2">
                {["😊", "😄", "🤩", "😋"].map((e, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-sm border-2 border-white">
                    {e}
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-swiggy-light-gray">2.3k people used this today</span>
            </div>
            <p className="text-[11px] text-swiggy-gray italic">
              &quot;I opened Swiggy to order biryani but the AI figured out I actually wanted dessert. It was right!&quot;
            </p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {[
              { emoji: "❓", label: "10 Q's" },
              { emoji: "🧠", label: "AI Decodes" },
              { emoji: "🎯", label: "Craving Revealed" },
              { emoji: "🍽️", label: "Order!" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl mb-0.5">{s.emoji}</div>
                <p className="text-[9px] font-medium text-swiggy-gray">{s.label}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase("round1")}
            className="w-full py-3.5 bg-swiggy-orange text-white font-bold rounded-xl text-sm active:scale-[0.98] transition-transform"
          >
            Decode My Craving
          </button>
          <p className="text-center text-[10px] text-swiggy-light-gray mt-3">
            Takes under 2 minutes
          </p>
        </div>
      )}

      {/* QUESTIONS (Round 1 & 2) */}
      {(phase === "round1" || phase === "round2") && (
        <div className="px-4 pt-6 animate-fadeIn">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-swiggy-light-gray">
                Question {questionIndex + 1} of {totalQuestions}
              </span>
              {phase === "round2" && (
                <span className="text-[10px] font-bold text-purple-500">Deep Dive Round</span>
              )}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-swiggy-orange to-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Live signals (after 3 questions) */}
          {questionIndex >= 3 && (
            <div className="mb-4 flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2">
              <span className="text-sm">🧠</span>
              <p className="text-[10px] text-purple-600 font-medium">
                {questionIndex < 6
                  ? "Hmm, getting interesting signals..."
                  : questionIndex < 8
                  ? "I think I know what you want..."
                  : "Almost decoded your craving!"}
              </p>
            </div>
          )}

          {/* Question */}
          <div key={questions[currentQ].id} className="animate-slideUp">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-swiggy-dark leading-snug">
                {questions[currentQ].text}
              </h2>
              {questions[currentQ].subtext && (
                <p className="text-xs text-swiggy-light-gray mt-1.5">
                  {questions[currentQ].subtext}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {questions[currentQ].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(questions[currentQ].id, option.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                    selectedOption === option.value
                      ? "border-swiggy-orange bg-orange-50 scale-[0.98]"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-sm font-semibold text-swiggy-dark">
                    {option.label}
                  </span>
                  {selectedOption === option.value && (
                    <span className="ml-auto text-swiggy-orange text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CHECKPOINT */}
      {phase === "checkpoint" && (
        <div className="px-4 pt-8 animate-fadeIn text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-xl font-extrabold text-swiggy-dark mb-2">
            10 questions done!
          </h2>
          <p className="text-sm text-swiggy-gray mb-2 max-w-[280px] mx-auto">
            I have a good read on you. But if you&apos;re still clueless...
          </p>
          <p className="text-xs text-swiggy-light-gray mb-8 max-w-[260px] mx-auto">
            5 more deep-dive questions will sharpen my prediction
          </p>

          <div className="space-y-3">
            <button
              onClick={() => handleCheckpoint(true)}
              className="w-full py-3.5 bg-swiggy-orange text-white font-bold rounded-xl text-sm active:scale-[0.98] transition-transform"
            >
              Decode Now -Show My Craving!
            </button>
            <button
              onClick={() => handleCheckpoint(false)}
              className="w-full py-3.5 border-2 border-purple-400 text-purple-600 font-bold rounded-xl text-sm active:scale-[0.98] transition-transform"
            >
              Still confused -go deeper (5 more)
            </button>
          </div>

          <div className="mt-6 bg-purple-50 rounded-xl p-4">
            <p className="text-[10px] text-purple-600">
              🧠 The deep-dive asks WHY you&apos;re eating, how you want to
              feel AFTER, and what ingredient is calling you -for a razor-sharp
              recommendation
            </p>
          </div>
        </div>
      )}

      {/* ANALYZING ANIMATION */}
      {phase === "analyzing" && (
        <div className="px-4 pt-10 animate-fadeIn text-center">
          <div className="relative inline-block mb-6">
            <div className="text-7xl animate-bounce">🧠</div>
            <div className="absolute -right-3 -top-3 text-2xl animate-ping">✨</div>
          </div>
          <h2 className="text-lg font-extrabold text-swiggy-dark mb-6">
            Decoding your craving...
          </h2>

          <div className="max-w-[280px] mx-auto space-y-3">
            {[
              { text: "Analyzing hunger signals", icon: "📡" },
              { text: "Reading taste preferences", icon: "👅" },
              { text: "Detecting craving category", icon: "🔍" },
              { text: "Snack? Meal? Dessert?...", icon: "🤔" },
              { text: "Matching perfect dishes", icon: "🎯" },
            ].map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-500 ${
                  analyzeStep > i
                    ? "bg-green-50 border border-green-200"
                    : analyzeStep === i
                    ? "bg-orange-50 border border-orange-200"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <span className="text-lg">
                  {analyzeStep > i ? "✅" : step.icon}
                </span>
                <span
                  className={`text-xs font-medium ${
                    analyzeStep > i
                      ? "text-green-700"
                      : analyzeStep === i
                      ? "text-swiggy-orange"
                      : "text-gray-300"
                  }`}
                >
                  {step.text}
                </span>
                {analyzeStep === i && (
                  <div className="ml-auto w-4 h-4 border-2 border-swiggy-orange border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CRAVING REVEAL */}
      {phase === "craving_reveal" && cravingProfile && (
        <div className="px-4 pt-6 pb-8 animate-fadeIn">
          {/* Big reveal */}
          <div className="text-center mb-6">
            <p className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2">
              Craving Decoded
            </p>
            <div className="animate-bounceIn">
              <div className="text-7xl mb-3">{cravingProfile.emoji}</div>
            </div>
            <h2 className="text-2xl font-extrabold text-swiggy-dark">
              You&apos;re craving
            </h2>
            <h2 className="text-2xl font-extrabold text-swiggy-orange">
              {cravingProfile.label}!
            </h2>
            <p className="text-sm text-swiggy-gray mt-2 max-w-[300px] mx-auto leading-relaxed">
              {cravingProfile.description}
            </p>
          </div>

          {/* Confidence meter */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-swiggy-dark">AI Confidence</span>
              <span className="text-sm font-extrabold text-purple-600">
                {cravingProfile.confidence}%
              </span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${cravingProfile.confidence}%` }}
              />
            </div>
          </div>

          {/* Signals that led to this */}
          {cravingProfile.signals.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-xs font-bold text-swiggy-dark mb-2">How I figured it out:</p>
              <div className="space-y-2">
                {cravingProfile.signals.map((signal, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-swiggy-orange text-[10px] mt-0.5">●</span>
                    <p className="text-[11px] text-swiggy-gray">{signal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-swiggy-dark mb-1">
              Perfect matches for you
            </h3>
            <p className="text-[11px] text-swiggy-light-gray mb-4">
              Based on your {cravingProfile.label.toLowerCase()} craving
            </p>

            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div
                  key={rec.name}
                  className={`rounded-2xl border-2 overflow-hidden animate-slideUp ${
                    i === 0 ? "border-swiggy-orange" : "border-gray-100"
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {i === 0 && (
                    <div className="bg-gradient-to-r from-swiggy-orange to-orange-400 text-white text-center py-1.5 text-xs font-bold">
                      🏆 Top Pick -{rec.matchScore}% match
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{rec.emoji}</div>
                      <div className="flex-1">
                        <h3 className="text-base font-extrabold text-swiggy-dark">
                          {rec.name}
                        </h3>
                        <p className="text-xs text-swiggy-light-gray">{rec.restaurant}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px]">
                            <FaStar className="text-[8px]" />
                            <span className="font-bold">{rec.rating}</span>
                          </div>
                          <span className="text-[11px] text-swiggy-light-gray">
                            {rec.prepTime}
                          </span>
                          <span className="text-[11px] font-bold text-swiggy-dark">
                            {rec.price}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {rec.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] bg-gray-100 text-swiggy-gray px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {i !== 0 && (
                          <p className="text-[10px] text-swiggy-light-gray mt-1">
                            {rec.matchScore}% match
                          </p>
                        )}
                        <p className="text-[11px] text-swiggy-orange font-medium mt-2">
                          💡 {rec.reason}
                        </p>
                      </div>
                    </div>
                    <button className="w-full mt-3 py-2.5 bg-swiggy-orange text-white font-bold rounded-xl text-sm active:scale-[0.98] transition-transform">
                      Order from {rec.restaurant}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={restart}
              className="w-full py-3 border-2 border-gray-200 text-swiggy-gray font-bold rounded-xl text-sm active:scale-[0.98] transition-transform"
            >
              🔄 Start Over
            </button>
            <Link
              href="/"
              className="block w-full py-3 text-center text-swiggy-orange font-bold text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
