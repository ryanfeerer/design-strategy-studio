import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// No API, no proxy, no backend — this is a fully static app.
export default defineConfig({
  plugins: [react()],
});
