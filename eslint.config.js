const { defineConfig } = require("eslint/config");

const globals = require("globals");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

module.exports = defineConfig([{
    requireConfigFile: false,

    languageOptions: {
        globals: {
            ...globals.node,
        },

        sourceType: "module",
        ecmaVersion: "13",

        parserOptions: {
            parser: "babel-eslint",

            ecmaFeatures: {
                modules: true,
            },
        },
    },

    extends: compat.extends("plugin:vue/vue3-essential", "eslint:recommended"),

    rules: {
        "no-console": "off",
        "no-debugger": "off",
        "no-unused-vars": "off",
        "no-undef": "off",
    },
}, {
    files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}]);