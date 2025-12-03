/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                // Keep default Tailwind colors, just documenting our primary ones
                // Primary: indigo, violet
                // Neutrals: slate
                // Functional: emerald, amber, rose, sky
            },
        },
    },
    plugins: [],
}
