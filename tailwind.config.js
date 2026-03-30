/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],

    safelist: [
        "bg-[#a6c792]",
        "h-[100dvh]",
        "overflow-y-auto",
        "overflow-hidden",
        "m-0",
        "inset-0",
        "z-1",
        "bg-teal-400",

        "xs:block",
        "sm:block",
        "md:block",
        "lg:block",
        "xl:block",
        "2xl:block",
        "3xl:block",

        // hidden
        "xs:hidden",
        "sm:hidden",
        "md:hidden",
        "lg:hidden",
        "xl:hidden",
        "2xl:hidden",
        "3xl:hidden",

        "left-[0px]",
        "right-[0px]",
        "left-[0rem]",
        "right-[0rem]",

    ],
    theme: {      
        screens: {
            xs: '480px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
            '3xl': '1880px'
        }
    },

    extend: {
        colors: {
            white: "#ffffff",
            black: "#111114",
            yellow: "#efff5b",
            green: "#4cd964",
            orange: "#f54f11",
            grey: "#a0a0a0",
            blue: "#007aff"
        },

        fontFamily: {
            inter: ["Inter", "sans-serif"]
        },

        fontSize: {
            h1: ["48px", { lineHeight: "120%", fontWeight: "700" }],
            h2: ["36px", { lineHeight: "120%", fontWeight: "700" }],
            h3: ["28px", { lineHeight: "120%", fontWeight: "600" }],
            h4: ["22px", { lineHeight: "120%", fontWeight: "600" }],

            body: ["16px", { lineHeight: "160%" }],
            small: ["14px", { lineHeight: "160%" }],
        },
    },

    plugins: [],
};