/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */

import { fileURLToPath } from 'node:url'

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  /* General Prettier Config */
  semi: false,
  tabWidth: 2,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'all',

  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],

  tailwindFunctions: ['cn', 'cva'],
  tailwindAttributes: ['className', 'tw'],
  tailwindStylesheet: fileURLToPath(
    new URL('resources/css/globals.css', import.meta.url),
  ),

  importOrder: [
    '<TYPES>',
    '^(react/(.*)$)|^(react$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^@/core',
    '^@/core',
    '',
    '<TYPES>^(@/(.*)$|@client/(.*)$)',
    '<TYPES>^[.|..]',
    '^(@/(.*)$|@client/(.*)$)',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '4.4.0',
}

export default config
