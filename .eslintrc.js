module.exports = {
  root: true,
  requireConfigFile: false,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    ecmaVersion: "13",
    ecmaFeatures: {
      modules: true
    },
  },
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-unused-vars": "off",
    "no-undef": "off"
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true,
      }
    }
  ]
}