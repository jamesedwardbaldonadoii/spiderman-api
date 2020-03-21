const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDao')

const { makePasswordHash } = require('./common/makePasswordHash')

class CreateUserAction extends BaseAction {
  static get accessTag() {
    return 'users:create'
  }

  // static get validationRules() {
  // return {
  // body: {
  // name: new RequestRule(UserModel.schema.name, { required: true }),
  // username: new RequestRule(UserModel.schema.username, { required: true }),
  // email: new RequestRule(UserModel.schema.email, { required: true }),
  // location: new RequestRule(UserModel.schema.location),
  // password: new RequestRule(UserModel.schema.passwordHash, { required: true })
  // }
  // }
  // }

  static async run(ctx) {
    const hash = await makePasswordHash(ctx.body.password)
    delete ctx.body.password

    const user = await UserDAO.create({
      ...ctx.body,
      password: hash
    })

    //Send confirmation email on registration
    // const emailConfirmToken = await makeEmailConfirmToken(user)
    // await UserDAO.baseUpdate(user.id, { emailConfirmToken })
    try {
      // const result = await emailAgent.send(new WelcomeEmail({
      //   to: user.email,
      //   username: user.username,
      //   emailConfirmToken
      // }))
      // logger.info('Registration email, delivered', { to: user.email, ...result, ctx: this.name })
    } catch (error) {
      if (error.statusCode) {
        // log mailGun errors
        logger.error(error.message, error, { ctx: this.name })
      } else {
        throw error
      }
    }

    return this.result({ data: user })
  }
}

module.exports = CreateUserAction
