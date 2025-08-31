const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      zIndex: {
        '2xl': '2147483647',
        'xl': '2147483646',
      },
      height: {
        'page': 'calc(100vh - 24px - 84px - 8px)',
      },
    },
  },
  plugins: [],
};
