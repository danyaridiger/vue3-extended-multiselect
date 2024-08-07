module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest"
  },
  expand: true,
  displayName: {
    name: "vue3-extended-multiselect",
    color: "bgGreen",
  },
  extraGlobals: [],
  globals: {
    OPTIONS: [
      { label: "First Option", customLabel: "First Option Custom Label" },
      { label: "Second Option" },
      { label: "Third Option", searchByField: "First" },
      126,
    ],
    INPUT_ID: "vue3-extended-multiselect-input-1",
    SEARCH_VALUE: "Search for options",
    SEARCH_VALUE_WITH_RESULTS: "First",
    MORE_THAN_LIMIT: "You have to select no more than one option",
    LESS_THAN_LIMIT: "You have to select at least two options",
  },
  include: [
    "<rootDir>/components/ExtendedMultiselectOptions.vue",
  ],
  injectGlobals: true,
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "json",
    "jsx",
    "mjs",
    "node",
    "vue"
  ],
  moduleNameMapper: {
    "\\.svg$" : "<rootDir>/tests/utils/stubs",
    "\\.scss$" : "identity-obj-proxy",
  },
  resetModules: true,
  resetMocks: true,
  rootDir: "./",
  setupFiles: ["<rootDir>/tests/utils/mocks"],
  slowTestThreshold: 20,
  testEnvironment: "jsdom",
  testLocationInResults: true,
  testMatch: [
    "**/tests/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  testPathIgnorePatterns: [
    "tests/utils"
  ],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/"
  ],
  timers: "real",
}
