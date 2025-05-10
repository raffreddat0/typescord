import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["*/**/dist"]), {
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        quotes: ["error", "double"],
        semi: ["error", "always"],
        indent: ["error", 4],
        curly: ["error", "multi"],
        "object-curly-spacing": ["error", "always"],
        eqeqeq: ["error"],

        "new-cap": ["error", {
            newIsCap: true,
        }],

        "func-style": ["error", "declaration", {
            allowArrowFunctions: true,
        }],

        camelcase: ["error", {
            properties: "never",
            ignoreDestructuring: true,
            ignoreImports: true,
            ignoreGlobals: true,
        }],

        "space-before-function-paren": ["error", {
            anonymous: "never",
            named: "never",
            asyncArrow: "always",
        }],

        "space-unary-ops": ["error", {
            words: true,
            nonwords: false,
        }],

        "no-else-return": ["error", {
            allowElseIf: false,
        }],

        "prefer-rest-params": ["error"],
        "space-infix-ops": ["error"],
        "space-in-parens": ["error", "never"],

        "no-multiple-empty-lines": ["error", {
            max: 1,
        }],

        "no-whitespace-before-property": ["error"],
        "space-before-blocks": ["error"],
        "no-trailing-spaces": ["error"],
        "no-mixed-spaces-and-tabs": ["error"],
        "semi-spacing": ["error"],
        "no-multi-spaces": ["error"],
        "no-lonely-if": ["error"],
        "no-var": ["error"],
        "block-spacing": ["error"],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/ban-types": "off",
    },
}]);