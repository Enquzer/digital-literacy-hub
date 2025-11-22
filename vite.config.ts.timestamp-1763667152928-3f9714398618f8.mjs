// vite.config.ts
import { defineConfig } from "file:///C:/Users/USER%201/Documents/my_Codes/e-learning/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/USER%201/Documents/my_Codes/e-learning/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\USER 1\\Documents\\my_Codes\\e-learning";
var vite_config_default = defineConfig({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    // Handle Node.js built-in modules
    conditions: ["node"]
  },
  build: {
    rollupOptions: {
      external: ["mysql2", "mysql2/promise", "buffer", "stream", "events"]
    }
  },
  // Handle Node.js built-in modules
  define: {
    global: "globalThis"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVU0VSIDFcXFxcRG9jdW1lbnRzXFxcXG15X0NvZGVzXFxcXGUtbGVhcm5pbmdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVTRVIgMVxcXFxEb2N1bWVudHNcXFxcbXlfQ29kZXNcXFxcZS1sZWFybmluZ1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVVNFUiUyMDEvRG9jdW1lbnRzL215X0NvZGVzL2UtbGVhcm5pbmcvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IFwiOjpcIixcclxuICAgIHBvcnQ6IDgwODAsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gICAgLy8gSGFuZGxlIE5vZGUuanMgYnVpbHQtaW4gbW9kdWxlc1xyXG4gICAgY29uZGl0aW9uczogWydub2RlJ10sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogWydteXNxbDInLCAnbXlzcWwyL3Byb21pc2UnLCAnYnVmZmVyJywgJ3N0cmVhbScsICdldmVudHMnXSxcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIEhhbmRsZSBOb2RlLmpzIGJ1aWx0LWluIG1vZHVsZXNcclxuICBkZWZpbmU6IHtcclxuICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxyXG4gIH1cclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VSxTQUFTLG9CQUFvQjtBQUNwVyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUE7QUFBQSxJQUVBLFlBQVksQ0FBQyxNQUFNO0FBQUEsRUFDckI7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxVQUFVLGtCQUFrQixVQUFVLFVBQVUsUUFBUTtBQUFBLElBQ3JFO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
