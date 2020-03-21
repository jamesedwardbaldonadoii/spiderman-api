class BaseRoleAccess {
  static get basePermissions() {
    return {
      'users:get-current-user': true,

      'posts:all': true,

      'auth:logout': true,
      'auth:logout-all-sessions': true
    }
  }
}

module.exports = BaseRoleAccess
