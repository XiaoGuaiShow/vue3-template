// vite.config.ts
import { defineConfig } from "file:///D:/Workspace/tripwise_manage_settlement/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Workspace/tripwise_manage_settlement/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import AutoImport from "file:///D:/Workspace/tripwise_manage_settlement/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/Workspace/tripwise_manage_settlement/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/Workspace/tripwise_manage_settlement/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_dirname = "D:\\Workspace\\tripwise_manage_settlement";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    // 配置别名
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    },
    extensions: [".js", ".json", ".ts", ".vue"]
    // 使用路径别名时想要省略的后缀名
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: ["@import './src/assets/styles/index.less'; "]
      }
    }
  },
  server: {
    proxy: {
      "/devApi": {
        target: "https://10.194.98.123",
        // 所要代理的目标地址
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/devApi/, "")
        // 重写传过来的path路径
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXb3Jrc3BhY2VcXFxcdHJpcHdpc2VfbWFuYWdlX3NldHRsZW1lbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFdvcmtzcGFjZVxcXFx0cmlwd2lzZV9tYW5hZ2Vfc2V0dGxlbWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovV29ya3NwYWNlL3RyaXB3aXNlX21hbmFnZV9zZXR0bGVtZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuXHRwbHVnaW5zOiBbXHJcblx0XHR2dWUoKSxcclxuXHRcdEF1dG9JbXBvcnQoe1xyXG5cdFx0XHRyZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXHJcblx0XHR9KSxcclxuXHRcdENvbXBvbmVudHMoe1xyXG5cdFx0XHRyZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXHJcblx0XHR9KVxyXG5cdF0sXHJcblx0cmVzb2x2ZToge1xyXG5cdFx0Ly8gXHU5MTREXHU3RjZFXHU1MjJCXHU1NDBEXHJcblx0XHRhbGlhczoge1xyXG5cdFx0XHQnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcclxuXHRcdH0sXHJcblx0XHRleHRlbnNpb25zOiBbJy5qcycsICcuanNvbicsICcudHMnLCAnLnZ1ZSddIC8vIFx1NEY3Rlx1NzUyOFx1OERFRlx1NUY4NFx1NTIyQlx1NTQwRFx1NjVGNlx1NjBGM1x1ODk4MVx1NzcwMVx1NzU2NVx1NzY4NFx1NTQwRVx1N0YwMFx1NTQwRFxyXG5cdH0sXHJcblx0Y3NzOiB7XHJcblx0XHRwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcblx0XHRcdGxlc3M6IHtcclxuXHRcdFx0XHRhZGRpdGlvbmFsRGF0YTogW1wiQGltcG9ydCAnLi9zcmMvYXNzZXRzL3N0eWxlcy9pbmRleC5sZXNzJzsgXCJdXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHNlcnZlcjoge1xyXG5cdFx0cHJveHk6IHtcclxuXHRcdFx0Jy9kZXZBcGknOiB7XHJcblx0XHRcdFx0dGFyZ2V0OiAnaHR0cHM6Ly8xMC4xOTQuOTguMTIzJywgLy8gXHU2MjQwXHU4OTgxXHU0RUUzXHU3NDA2XHU3Njg0XHU3NkVFXHU2ODA3XHU1NzMwXHU1NzQwXHJcblx0XHRcdFx0c2VjdXJlOiBmYWxzZSxcclxuXHRcdFx0XHRjaGFuZ2VPcmlnaW46IHRydWUsXHJcblx0XHRcdFx0cmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2RldkFwaS8sICcnKSAvLyBcdTkxQ0RcdTUxOTlcdTRGMjBcdThGQzdcdTY3NjVcdTc2ODRwYXRoXHU4REVGXHU1Rjg0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlMsU0FBUyxvQkFBb0I7QUFDMVUsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUxwQyxJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsTUFDVixXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNsQyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVixXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNsQyxDQUFDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBO0FBQUEsSUFFUixPQUFPO0FBQUEsTUFDTixLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQzlCO0FBQUEsSUFDQSxZQUFZLENBQUMsT0FBTyxTQUFTLE9BQU8sTUFBTTtBQUFBO0FBQUEsRUFDM0M7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNKLHFCQUFxQjtBQUFBLE1BQ3BCLE1BQU07QUFBQSxRQUNMLGdCQUFnQixDQUFDLDRDQUE0QztBQUFBLE1BQzlEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNOLFdBQVc7QUFBQSxRQUNWLFFBQVE7QUFBQTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGFBQWEsRUFBRTtBQUFBO0FBQUEsTUFDaEQ7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
