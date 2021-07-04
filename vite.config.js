// https://github.com/underfin/vite-plugin-vue2
const { createVuePlugin } = require('vite-plugin-vue2')
import legacy from '@vitejs/plugin-legacy'
import { defineConfig, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import viteStylelint from '@amatlash/vite-plugin-stylelint'
import path from 'path'

function resolvePath(str) {
  return path.resolve(__dirname, str)
}

export default ({ mode }) => {
  const ENVS = loadEnv(mode, process.cwd()) // 拿到当前模式的环境变量
  console.log(`当前模式：${mode}`)
  return defineConfig({
    base: ENVS.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': resolvePath('src')
      },
      extensions: ['.js', '.vue', 'ts', 'jsx', 'json']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/element-variables.scss";`
        }
      }
    },
    server: {
      port: 4765,
      open: true
      // proxy: '' // https://cn.vitejs.dev/config/#server-proxy
    },
    // 构建相关
    build: {
      target: 'esnext'
    },
    plugins: [
      createVuePlugin(),
      legacy(),
      viteStylelint(),
      viteMockServe({ supportTs: false, configPath: '/mock/index.js' })
    ]
  })
}
