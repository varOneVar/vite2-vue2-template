export default {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  hiddenOther: (state) => state.app.hiddenOther,
  storeId: (state) => state.user.storeId,
  userId: (state) => (state.user.userInfo || {}).userId,
  appId: (state) => state.user.appId,
  userInfo: (state) => state.user.userInfo,
  token: (state) => state.user.token,
  roles: (state) => state.user.roles,
  hasAuth: (state) => (needRoles) => needRoles.some((v) => state.user.roles.includes(v)),
  userName: (state) => (state.user.userInfo || {}).userName,
  accessedRoutes: (state) => state.user.accessedRoutes,
  wholePageLoading: (state) => state.app.wholePageLoading
}
