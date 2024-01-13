import { babel } from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import vue from "rollup-plugin-vue";
import copy from "rollup-plugin-copy";
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
      copy({
        targets: [
          { src: 'src/assets/images/*', dest: 'dist/assets/images' }
        ],
      }),
      vue({
        preprocessStyles: true,
      }),
      postcss({
        minimize: true,
      }),
      {
        transform(code) {
          const importMetaRegExp = /require\('url'\).pathToFileURL\(__filename\).toString\(\)/g;
          const assetsRegExp = /\.\.\/assets\/images/g;
          const importMetaMatches = Array.from(code.matchAll(importMetaRegExp));
          const assetsMatches = Array.from(code.matchAll(assetsRegExp));
          let newCode = code;

          for (const [all] of importMetaMatches) {
            newCode = newCode.replace(all, "import.meta.url");
          }

          for (const [all] of assetsMatches) {
            newCode = newCode.replace(all, "./assets/images");
          }

          return {
            code: newCode,
            map: {mappings: ""},
          };
        }
      }
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