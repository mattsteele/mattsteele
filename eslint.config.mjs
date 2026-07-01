import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default defineConfig([
	tseslint.configs.recommended,
	eslintPluginAstro.configs.recommended,
	eslintConfigPrettier,
	{
		ignores: ["dist/**", ".astro/**"],
	},
	{
		files: ["**/env.d.ts"],
		rules: {
			"@typescript-eslint/triple-slash-reference": "off",
		},
	},
]);
