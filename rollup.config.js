import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import ts from "rollup-plugin-ts";
import alias from "@rollup/plugin-alias";

export default [
  {
    input: "node-ipc.ts",
    output: [
      {
        dir: "dist",
        format: "esm",
      },
    ],
    plugins: [ts(), nodeResolve(), commonjs()],
    external: [
      "@node-ipc/event-pubsub",
      "js-message",
      "js-queue",
      "type-strong",
    ],
  },
  {
    input: "node-ipc.ts",
    output: [
      {
        dir: "cjs",
        format: "cjs",
      },
    ],
    plugins: [
      ts(),
      alias({
        entries: [
          {
            find: "../strong-type/index.js",
            replacement: "strong-type/index.js",
          },
        ],
      }),
      nodeResolve(),
      commonjs(),
    ],
  },
];
