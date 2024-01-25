import { defineConfig, ConfigEnv, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root: string = process.cwd()
  const { VITE_PORT } = loadEnv(mode, root)
  return {
    base: `http://localhost:7038/settlement/`,
    plugins: [
      vue(),
      function () {
        let basePath = ''
        return {
          name: 'vite:micro-app',
          apply: 'build',
          configResolved(config) {
            basePath = `${config.base}${config.build.assetsDir}/`
          },
          writeBundle(options, bundle) {
            for (const chunkName in bundle) {
              if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
                const chunk = bundle[chunkName]
                if (chunk.fileName && chunk.fileName.endsWith('.js')) {
                  chunk.code = chunk.code.replace(
                    /(from|import\()(\s*['"])(\.\.?\/)/g,
                    (all, $1, $2, $3) => {
                      return all.replace($3, new URL($3, basePath))
                    }
                  )
                  const fullPath = join(options.dir, chunk.fileName)
                  writeFileSync(fullPath, chunk.code)
                }
              }
            }
          }
        }
      },
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
        dirs: ['src/**/components', 'src/tripwise/**']
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
        symbolId: 'icon-[dir]-[name]'
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
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
})
