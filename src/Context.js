import {immerable, produce} from "immer";
import {createContext} from "react";

export class Ingredient {
  [immerable] = true;

  /** @type string */
  name;
  /** @type int */
  count;
  /** @type Date */
  expires;

  /**
   * @param {string} name
   * @param {int?} count
   * @param {Date?} expires
   */
  constructor(name, count, expires) {
    this.name = name;
    this.count = count ?? 0;
    this.expires = expires ?? null;
  }

  toString() {
    return "Ingredient { name: " + this.name + ", count: " + this.count + ", expires: " + this.expires + " }"
  }
}

export class IngredientStore {
  [immerable] = true;

  /** @type Array<Ingredient> */
  #list;

  constructor() {
    this.#list = [new Ingredient("Tomato"), new Ingredient("Potato"), new Ingredient("Chicken")];
  }

  toString() {
    return "IngredientStore { list: " + this.#list + " }"
  }

  all() {
    return this.#list;
  }

  /**
   * @param {Ingredient} ingredient
   * @returns {boolean}
   */
  addIngredient(ingredient) {
    for (const existing of this.#list) {
      if (existing.name === ingredient.name) {
        return false;
      }
    }
    this.#list.push(ingredient);
    return true;
  }

  /**
   * @param {Ingredient} ingredient
   */
  removeIngredient(ingredient) {
    let idx = 0;
    for (const existing of this.#list) {
      if (existing.name === ingredient.name) {
        break;
      }
      idx += 1;
    }
    this.#list.splice(idx, 1)
  }

  /**
   * @param {string} name
   * @returns {Ingredient|null}
   */
  getByName(name) {
    for(const ingredient of this.#list) {
      if (ingredient.name === name) {
        return ingredient;
      }
    }
    return null;
  }
}

export class RecipeIngredient {
  [immerable] = true;

  /** @type string */
  ingredient;
  /** @type int */
  count;

  /**
   * @param {string} ingredient
   * @param {int} count
   */
  constructor(ingredient, count) {
    this.ingredient = ingredient;
    this.count = count;
  }
}

export class Recipe {
  [immerable] = true;

  /** @type string */
  name;
  /** @type Array<RecipeIngredient> */
  ingredients;

  /**
   * @param {string} name
   * @param {Array<Recipe>?} ingredients
   */
  constructor(name, ingredients) {
    this.name = name;
    this.ingredients = ingredients ?? [];
  }
}

export class RecipeStore {
  [immerable] = true;

  /** @type Array<Recipe> */
  #list;

  constructor() {
    this.#list = [];
  }

  all() {
    return this.#list;
  }

  /**
   * @param {Recipe} recipe
   * @returns {boolean}
   */
  addRecipe(recipe) {
    for (const existing of this.#list) {
      if (existing.name === recipe.name) {
        return false;
      }
    }
    this.#list.push(recipe);
    return true;
  }

  /**
   * @param {Recipe} recipe
   */
  removeRecipe(recipe) {
    let idx = 0;
    for (const existing of this.#list) {
      if (existing.name === recipe.name) {
        break;
      }
      idx += 1;
    }
    this.#list.splice(idx, 1)
  }

  /**
   * @param {string} name
   * @returns {Recipe|null}
   */
  getByName(name) {
    for(const recipe of this.#list) {
      if (recipe.name === name) {
        return recipe;
      }
    }
    return null;
  }
}

/** @template T */
export class ImmerCtx {
  /** @type T */
  #inner;
  /** @type {(new_val: ImmerCtx<T>) => void} */
  updater;

  /**
   * @param {T} inner
   */
  constructor(inner) {
    this.updater = null;
    this.#inner = inner;
  }

  /**
   * @param {(draft: T) => void} f
   */
  update(f) {
    this.updater(new ImmerCtx(produce(this.#inner, f)));
  }

  /**
   * @template U
   * @param {(inner: T) => U} f
   * @returns {U}
   */
  access(f) {
    return f(this.#inner);
  }
}

/** @type import("react").Context<ImmerCtx<IngredientStore>> */
export const IngredientCtx = createContext(new ImmerCtx(new IngredientStore()));

/** @type import("react").Context<ImmerCtx<RecipeStore>> */
export const RecipeCtx = createContext(new ImmerCtx(new RecipeStore()));
