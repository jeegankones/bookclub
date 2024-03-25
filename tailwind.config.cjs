/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue,css}'],
    theme: {
        extend: {
            transitionProperty: {
                width: 'width',
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['dracula'],
    },
};
