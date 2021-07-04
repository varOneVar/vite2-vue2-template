/*
 * @Author: song qing<vn0bn6u>
 * @Date: 2021-07-03 16:30:50
 * @LastEditTime: 2021-07-04 02:10:51
 * @LastEditors: your name
 * @Description: eslint config
 * @FilePath: \vue2-tt\.eslintrc.js
 */
const path = require('path')

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  // settings: {
  //   'prettier-vue': {
  //     // Settings for how to process Vue SFC Blocks
  //     SFCBlocks: {
  //       /**
  //        * Use prettier to process `<template>` blocks or not
  //        *
  //        * If set to `false`, you may need to enable those vue rules that are disabled by `eslint-config-prettier`,
  //        * because you need them to lint `<template>` blocks
  //        *
  //        * @default true
  //        */
  //       template: true
  //     }
  //   }
  // },
  // parser: "@babel/eslint-parser",
  extends: [
    'airbnb-base/legacy',
    'plugin:vue/recommended',
    'plugin:prettier-vue/recommended' // 添加 prettier 插件
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 12,
    sourceType: 'module',
    babelOptions: {
      configFile: path.resolve(__dirname, './babel.config.js')
    }
    // parser: '@babel/eslint-parser'
  },
  plugins: ['vue', 'html', '@babel'],
  rules: {
    'prettier-vue/prettier': 'error',
    // 'no-param-reassign': 'off',
    // 'import/no-unresolved': 'off',
    // 'import/extensions': 'off',
    // 'import/no-absolute-path': 'off',
    // 'import/no-extraneous-dependencies': 'off',
    // 'vue/no-multiple-template-root': 'off',
    // 'no-unused-expressions': 0,
    // 'no-underscore-dangle': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? { allow: ['warn', 'error'] } : 0,
    'vue/order-in-components': [
      'warn',
      {
        order: [
          'el',
          'name',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['directives', 'filters'],
          'extends',
          'mixins',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'fetch',
          'asyncData',
          'data',
          'methods',
          'LIFECYCLE_HOOKS',
          'computed',
          'watch',
          'components',
          'head',
          ['template', 'render'],
          'renderError'
        ]
      }
    ]
  }
}
