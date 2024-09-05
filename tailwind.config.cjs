module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,html}", "*.{js,ts,jsx,tsx,html}"],
    darkMode: "class",
    theme: {
        extend: {
            outline: ["focus"],
            screens: {
                mini: { raw: "(min-width: 480px) and (min-height: 480px)" },
                tablet: "1025px",
                landscape: { raw: "(orientation: landscape)" },
                portrait: { raw: "(orientation: portrait)" },
            },
            colors: {
                'm-blue-light': {
                    '1': '#F1FAFF',
                    '2': '#EAF8FF',
                    '3': '#D5F5FF',
                    '4': '#67cfff',
                    '45': '#51c7ff',
                    '5': '#1285BA'
                },
                'm-gray-light': {
                    '1': '#CDD7DB',
                    '2': '#6A8692',
                    '3': '#517280',
                    '4': '#07354A'
                },
                'm-green': '#16CF8D',
                'm-red': '#D00A51', 
                'm-blue-dark': {
                    '1': '#07354A',
                    '2': '#042838',
                    '3': '#042432',
                    '4': '#031D28'
                },
                'm-gray-dark': {
                    '1': '#B3BBBE',
                    '2': '#9AA5A9',
                    '3': '#354A53'
                }
            },
        },
    },
    plugins: [],
}
