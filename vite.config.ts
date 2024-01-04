import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
			imports: ['vue', 'vue-router', 'pinia'],
			eslintrc: {
				enabled: false,
				files: ['src/**/*.{ts,vue}'],
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
		proxy: {
			'/devApi': {
				target: 'https://10.194.98.123', // 所要代理的目标地址
				secure: false,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/devApi/, '') // 重写传过来的path路径
			}
		}
	}
})
