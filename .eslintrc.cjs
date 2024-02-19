module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
    },
    plugins: ['simple-import-sort'],
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        'plugin:tailwindcss/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        'func-style': ['error', 'declaration'],
        'prettier/prettier': 'warn',
        'simple-import-sort/imports': [
            'error',
            { groups: [['^\\u0000', '^node:', '^@?\\w', '^', '^\\.']] },
        ],
        'simple-import-sort/exports': 'error',
        'vue/multi-word-component-names': 'off',
        'tailwindcss/no-custom-classname': 'off',
    },
};
