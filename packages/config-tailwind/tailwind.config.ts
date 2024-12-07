import type { Config } from 'tailwindcss';

const config: Omit<Config, "content"> = {
  theme: {},
  plugins: [require('daisyui')],
  daisyui: {
    // themes: ["cupcake", "dark"],
    themes: [
      {
        cupcake: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#6C63FF",
        }
      },
    
    ]
  },
  darkMode: ['selector', '[data-theme="dark"]']
};

export default config;
