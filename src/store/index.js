import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'
import storage from 'good-storage'
import settings from '@/settings'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((mod, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  // eslint-disable-next-line no-param-reassign
  mod[moduleName] = value.default
  return mod
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => storage.session.get(key),
        setItem: (key, value) => storage.session.set(key, value),
        removeItem: (key) => storage.session.remove(key)
      },
      key: `${settings.appName}-key`
    })
  ]
})

export default store
