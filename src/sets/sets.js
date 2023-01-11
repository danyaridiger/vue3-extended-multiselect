/**
 * Set of background- and border- style variants
 * @constant {Array} themeTypes
 */
export const themeTypes = [
  "basic",
  "slate-grey",
  "slate-blue",
  "teal",
  "strict"
];

/**
 * Set of color-style variants for loader
 * @constant {Array} loaderThemeTypes
 */
export const loaderThemeTypes = [
  "loader-default",
  ...themeTypes
];

/**
 * Set of icon filenames
 * @constant {Array} toggleIcons
 */
export const toggleIcons = [
  "base-arrow",
  "double-arrow",
  "wide-arrow",
  "circle-arrow",
  "inner-arrow",
  "triangle-arrow",
  "triangle-circle-arrow"
];

/**
 * Set of icon colors filtered by svg
 * @constant {Array} iconFilters
 */
export const iconFilters = [
  "basic",
  "black",
  "green"
];

/**
 * Set of icons sizes filtered by css
 * @constant {Array} iconSizes
 */
export const iconSizes = [
  "large",
  "medium",
  "small"
];

/**
 * Set of types for options created by user
 * @constant {Array} createOptionTypes
 */
export const createOptionTypes = [
  "primitive",
  "array",
  "object"
];

/**
 * Set of keys to combine with cliks on options list and blocking choice
 * @constant {Array} specialKeysToBlock
 */
export const specialKeysToBlock = [
  "alt",
  "ctrl",
  "shift"
];

/**
 * Set of appearance variants of options list
 * @constant {Array} toggleAppearenceSides
 */
export const toggleAppearenceSides = [
  "auto",
  "atop",
  "under"
];

/**
 * Set of available types for options
 * @constant {Array} UnionPropType
 * @typedef {(string|number|boolean|Array|Object|Function|null|undefined)} UnionPropType
 */
export const UnionPropType = [
  String,
  Number,
  Boolean,
  Array,
  Object,
  Function,
  null,
  undefined
];