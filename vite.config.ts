import { defineConfig, ConfigEnv, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root: string = process.cwd()
  const { VITE_PORT } = loadEnv(mode, root)
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        eslintrc: {
          enabled: false,
          globalsPropValue: true
        }
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: true,
        dirs: ['src/**/components']
      })
    ],
    resolve: {
      // 配置别名
      alias: {
        '@': resolve(__dirname, 'src')
      },
      extensions: ['.js', '.json', '.ts', '.vue'] // 使用路径别名时想要省略的后缀名
    },
    css: {
      preprocessorOptions: {
        less: {
          additionalData: ["@import './src/assets/styles/index.less'; "]
        }
      }
    },
    server: {
      // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0" 也可设置成你的ip地址
      host: '0.0.0.0',
      port: parseInt(VITE_PORT),
      open: true,
      cors: true
    }
  }
})
