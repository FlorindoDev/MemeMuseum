/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{html,ts}",
        "./src/index.{html,ts}"
    ],

    theme: {
        extend: {
            colors: {
                text: 'var(--color-text)',
                background: 'var(--color-bg)',
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
            },
        },
    },
    plugins: [],
}
