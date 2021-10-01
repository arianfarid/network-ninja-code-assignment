module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        boxShadow: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            glow: '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)',
            'glow-sm': '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
            'glow-md': '0 0px 6px -1px rgba(255, 255, 255, 0.15), 0 2px 4px -1px rgba(255, 255, 255, 0.1)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            none: 'none',
        },
        extend: {},
    },
    variants: {
        extend: {
            borderColor: ['active', 'hover'],
            borderWidth: ['active'],
        },
    },
    plugins: [],
}