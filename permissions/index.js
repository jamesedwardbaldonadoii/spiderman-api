const roles = require('./roles')
const RoleAdminAccess = require('./RoleAdminAccess')
const RoleModeratorAccess = require('./RoleModeratorAccess')
const RoleUserAccess = require('./RoleUserAccess')
const RoleAnonymousAccess = require('./RoleAnonymousAccess')

module.exports = {
  [roles.superadmin]: {
    ...RoleAdminAccess.can,
    ...RoleModeratorAccess.can,
    ...RoleUserAccess.can,
    ...RoleAnonymousAccess.can
  },
  [roles.admin]: RoleAdminAccess.can,
  [roles.moderator]: RoleModeratorAccess.can,
  [roles.user]: RoleUserAccess.can,
  [roles.anonymous]: RoleAnonymousAccess.can
}
