import tailwindCssPlugin from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

const config = {
  plugins: [tailwindCssPlugin(), autoprefixer()],
};

export default config;
