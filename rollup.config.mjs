import { babel } from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import banner from "rollup-plugin-banner2";
import vue from "rollup-plugin-vue";
import postcss from "rollup-plugin-postcss";
import { readFileSync } from "fs";

const LIB_NAME = "Vue3ExtendedMultiselect";
const packageInfo = JSON.parse(readFileSync("./package.json", "utf8"));

export default [
  {
    input: "./index.js",
    output: [
      {
        file: "./dist/index.cjs.js",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: "./dist/index.esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "./dist/index.umd.js",
        format: "umd",
        name: LIB_NAME,
        exports: "named",
        sourcemap: true,
        globals: {
          vue: "Vue",
        },
      },
    ],
    external: ["vue"],
    plugins: [
      vue({
        preprocessStyles: true,
      }),
      postcss({
        minimize: true,
      }),
      commonjs(),
      babel({
        exclude: ["./node_modules/**", "./qa/**"],
        babelHelpers: "runtime",
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            {
              helpers: true,
              regenerator: false,
              useESModules: false,
            },
          ],
        ],
      }),
      banner(() => {
        return `
/*!
 * ${packageInfo.name} v${packageInfo.version}
 * Author: ${packageInfo.author}
 * Description: ${packageInfo.description}
 * License: ${packageInfo.license}
 * Repository: ${packageInfo.repository?.url}
 */
        `;
      }),
      terser({
        mangle: {
          reserved: ["_classCallCheck", "_createClass", "_defineProperty", "_inherits"],
        },
      }),
    ],
  },
  {
    input: "./types/index.d.ts",
    output: {
      file: "./dist/types/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
