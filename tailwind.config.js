/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './vueform.config.ts',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.vue',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.js',
    './node_modules/@vueform/vueform/dist/**/*.js',
  ],
  safelist: [
    // Classes VueForm essentielles
    {
      pattern: /^vueform/,
    },
    {
      pattern: /^form-element/,
    },
    {
      pattern: /^form-element-message/,
    },
    {
      pattern: /^form-element-wrapper/,
    },
    {
      pattern: /^form-element-container/,
    },
    {
      pattern: /^form-element-content/,
    },
    {
      pattern: /^form-element-info/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@vueform/vueform/tailwind'),
  ],
}
