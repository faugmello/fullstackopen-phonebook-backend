import globals from "globals";
import js from "@eslint/js";

export default [
    {
        ignores: ["node_modules/", "dist/", "build/", "temp/"]
    },
    js.configs.recommended,
    {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  {
    rules: {
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
           'no-console': 0,
           'no-unused-vars': [
                     'error',
                     {
                       'argsIgnorePattern': '^_',
                       'varsIgnorePattern': '^_',
                       'caughtErrorsIgnorePattern': '^_'
                     }
                   ]
    }
  }
];
