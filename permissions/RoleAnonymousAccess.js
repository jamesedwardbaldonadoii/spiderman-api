class RoleAnonymousAccess {
  static get can() {
    return {
      'users:create': true,

      'auth:login': true,
      'auth:refresh-tokens': true
    }
  }
}

module.exports = RoleAnonymousAccess
