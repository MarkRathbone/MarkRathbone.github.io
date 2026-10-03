import { preview } from "vite";

// Test the built artifact, not the development server. Start and stop the
// preview here so local checks and CI use exactly the same command.
const server = await preview({
  preview: { host: "127.0.0.1", port: 4173, strictPort: true, open: false },
});

try {
  process.env.MOTION_CHECK_URL = "http://127.0.0.1:4173/";
  await import("./check-motion.mjs");
} finally {
  await server.close();
}
