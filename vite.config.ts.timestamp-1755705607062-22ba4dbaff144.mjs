// vite.config.ts
import { defineConfig } from "file:///D:/ReactApps/livelylightingco/node_modules/vite/dist/node/index.js";
import react from "file:///D:/ReactApps/livelylightingco/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  base: "/",
  // keep this
  server: {
    host: "localhost",
    // or true if you want LAN access
    port: 5173,
    strictPort: true,
    // fail if 5173 is taken (so you notice)
    headers: {
      "Content-Security-Policy": "connect-src 'self' ws://localhost:5173 http://localhost:5173 https:; default-src 'self'"
    },
    hmr: {
      protocol: "ws",
      // use 'wss' if your dev server is HTTPS
      host: "localhost",
      port: 5173
      // If you’re accessing via 127.0.0.1, set host: '127.0.0.1'
      // If behind a proxy (Docker/WSL), you can also set clientPort to the public port.
      // clientPort: 5173,
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxSZWFjdEFwcHNcXFxcbGl2ZWx5bGlnaHRpbmdjb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUmVhY3RBcHBzXFxcXGxpdmVseWxpZ2h0aW5nY29cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1JlYWN0QXBwcy9saXZlbHlsaWdodGluZ2NvL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBiYXNlOiBcIi9cIiwgLy8ga2VlcCB0aGlzXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwibG9jYWxob3N0XCIsIC8vIG9yIHRydWUgaWYgeW91IHdhbnQgTEFOIGFjY2Vzc1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSwgLy8gZmFpbCBpZiA1MTczIGlzIHRha2VuIChzbyB5b3Ugbm90aWNlKVxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQ29udGVudC1TZWN1cml0eS1Qb2xpY3lcIjpcbiAgICAgICAgXCJjb25uZWN0LXNyYyAnc2VsZicgd3M6Ly9sb2NhbGhvc3Q6NTE3MyBodHRwOi8vbG9jYWxob3N0OjUxNzMgaHR0cHM6OyBkZWZhdWx0LXNyYyAnc2VsZidcIixcbiAgICB9LFxuICAgIGhtcjoge1xuICAgICAgcHJvdG9jb2w6IFwid3NcIiwgLy8gdXNlICd3c3MnIGlmIHlvdXIgZGV2IHNlcnZlciBpcyBIVFRQU1xuICAgICAgaG9zdDogXCJsb2NhbGhvc3RcIixcbiAgICAgIHBvcnQ6IDUxNzMsXG4gICAgICAvLyBJZiB5b3VcdTIwMTlyZSBhY2Nlc3NpbmcgdmlhIDEyNy4wLjAuMSwgc2V0IGhvc3Q6ICcxMjcuMC4wLjEnXG4gICAgICAvLyBJZiBiZWhpbmQgYSBwcm94eSAoRG9ja2VyL1dTTCksIHlvdSBjYW4gYWxzbyBzZXQgY2xpZW50UG9ydCB0byB0aGUgcHVibGljIHBvcnQuXG4gICAgICAvLyBjbGllbnRQb3J0OiA1MTczLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsU0FBUyxvQkFBb0I7QUFDNVMsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixNQUFNO0FBQUE7QUFBQSxFQUNOLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUCwyQkFDRTtBQUFBLElBQ0o7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFVBQVU7QUFBQTtBQUFBLE1BQ1YsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSVI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
