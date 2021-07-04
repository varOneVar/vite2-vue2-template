import store from '@/store'

export default {
  inserted(el, binding) {
    const { value } = binding
    const roles = store.getters && store.getters.roles
    // if (value && value instanceof Array && value.length > 0) {
    if (value) {
      const permissionRoles = value
      let hasPermission = false
      if (
        permissionRoles &&
        (permissionRoles.include_permissions || permissionRoles.exclude_permissions)
      ) {
        if (permissionRoles.include_permissions && permissionRoles.exclude_permissions) {
          const includePermission = roles.some((role) => {
            return permissionRoles.include_permissions.includes(role.ruleCode)
          })
          const excludePermission = !roles.some((role) => {
            return permissionRoles.exclude_permissions.includes(role.ruleCode)
          })
          hasPermission = includePermission && excludePermission
        } else if (permissionRoles.include_permissions) {
          const includePermission = roles.some((role) => {
            return permissionRoles.include_permissions.includes(role.ruleCode)
          })
          hasPermission = includePermission
        } else if (permissionRoles.exclude_permissions) {
          const excludePermission = !roles.some((role) => {
            return permissionRoles.exclude_permissions.includes(role.ruleCode)
          })
          hasPermission = excludePermission
        }
      } else {
        hasPermission = true
      }

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
