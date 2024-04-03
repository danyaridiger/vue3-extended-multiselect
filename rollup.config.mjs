import { babel } from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import vue from "rollup-plugin-vue";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "src/components/Vue3ExtendedMultiselect.vue",
    output: [
      {
        file: "dist/Vue3ExtendedMultiselect.cjs.js",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: "dist/Vue3ExtendedMultiselect.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      babel({
        babelHelpers: 'runtime',
        exclude: ["./node_modules/**", "./qa/**"],
      }),
      vue({
        preprocessStyles: true,
      }),
      postcss({
        minimize: true,
      }),
    ]
  },
  {
    input: "typings/vue3-extended-multiselect.d.ts",
    output: [
      {
        file: "dist/types/index.d.ts",
        format: "esm",
        sourcemap: false,
      }
    ],
    plugins: [dts()],
  }
];