const { errorCodes, AppError, assert } = require('../lib')
const { actionTagPolicy } = require('../policy')

class BaseController {
  constructor({ logger } = {}) {
    if (!this.init)
      throw new Error(
        `${this.constructor.name} should implement 'init' method.`
      )
    if (!this.router)
      throw new Error(
        `${this.constructor.name} should implement 'router' getter.`
      )
    // assert.instanceOf(logger, AbstractLogger)

    // this.logger = logger
  }

  actionRunner(action) {
    assert.func(action, { required: true })

    if (!action.hasOwnProperty('accessTag')) {
      throw new Error(
        `'accessTag' getter not declared in invoked '${action.name}' action`
      )
    }

    if (!action.hasOwnProperty('run')) {
      throw new Error(
        `'run' method not declared in invoked '${action.name}' action`
      )
    }

    return async (req, res, next) => {
      assert.object(req, { required: true })
      assert.object(res, { required: true })
      assert.func(next, { required: true })

      const ctx = {
        currentUser: req.currentUser,
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip,
        method: req.method,
        url: req.url,
        headers: {
          'Content-Type': req.get('Content-Type'),
          Referer: req.get('referer'),
          'User-Agent': req.get('User-Agent')
        }
      }

      try {
        /**
         * check access to action by access tag
         */
        await actionTagPolicy(action.accessTag, ctx.currentUser)

        /**
         * verify empty body
         */
        if (
          action.validationRules &&
          action.validationRules.notEmptyBody &&
          !Object.keys(ctx.body).length
        ) {
          return next(
            new AppError({
              ...errorCodes.EMPTY_BODY,
              layer: this.constructor.name
            })
          )
        }

        /**
         * validate action input data
         */
        if (action.validationRules) {
          if (action.validationRules.query)
            this.validateSchema(
              ctx.query,
              action.validationRules.query,
              'query'
            )
          if (action.validationRules.params)
            this.validateSchema(
              ctx.params,
              action.validationRules.params,
              'params'
            )
          if (action.validationRules.body)
            this.validateSchema(ctx.body, action.validationRules.body, 'body')
        }

        /**
         * fire action
         */
        const response = await action.run(ctx)

        /**
         * set headers
         */
        if (response.headers) res.set(response.headers)

        /**
         * optional redirect
         */
        if (response.redirect)
          return res.redirect(response.redirect.status, response.redirect.url)

        /**
         * set status and return result to client
         */
        return res.status(response.status).json({
          success: response.success,
          message: response.message,
          data: response.data
        })
      } catch (error) {
        error.req = ctx
        next(error)
      }
    }
  }

  validateSchema(src, requestSchema, schemaTitle) {
    assert.object(src, {
      required: true,
      message: `Invalid request validation payload. Only object allowed. Actual type: ${Object.prototype.toString.call(
        src
      )}`
    })
    assert.object(requestSchema, { required: true })
    assert.string(schemaTitle, { required: true })

    const schemaKeys = Object.keys(requestSchema)
    const srcKeys = Object.keys(src)

    const defaultValidKeys = ['offset', 'page', 'limit', 'filter', 'orderBy']
    const invalidExtraKeys = srcKeys.filter(
      srcKey =>
        !schemaKeys.includes(srcKey) && !defaultValidKeys.includes(srcKey)
    )
    if (invalidExtraKeys.length) {
      throw new AppError({
        ...errorCodes.VALIDATION,
        message: `Extra keys found in '${schemaTitle}' payload: [${invalidExtraKeys}]`,
        layer: this.constructor.name
      })
    }

    if (!schemaKeys.length) return

    schemaKeys.forEach(propName => {
      const validationSrc = src[propName]

      const { schemaRule, options } = requestSchema[propName]
      const { validator, description, example } = schemaRule
      const hasAllowedDefaultData = options.allowed.includes(validationSrc)

      if (
        options.required &&
        !src.hasOwnProperty(propName) &&
        !hasAllowedDefaultData
      ) {
        throw new AppError({
          ...errorCodes.VALIDATION,
          message: `'${schemaTitle}.${propName}' field is required.`,
          layer: this.constructor.name
        })
      }

      if (src.hasOwnProperty(propName)) {
        const tmpValidationResult = validator(validationSrc)
        if (!['boolean', 'string'].includes(typeof tmpValidationResult)) {
          throw new AppError({
            ...errorCodes.DEV_IMPLEMENTATION,
            message: `Invalid '${schemaTitle}.${propName}' validation result. Validator should return boolean or string. Fix it !`,
            layer: this.constructor.name
          })
        }

        const validationResult = tmpValidationResult || hasAllowedDefaultData
        if (typeof validationResult === 'string') {
          throw new AppError({
            ...errorCodes.VALIDATION,
            message: `Invalid '${schemaTitle}.${propName}' field, ${validationResult}`,
            meta: { example, expect: description },
            layer: this.constructor.name
          })
        }
        if (validationResult === false) {
          throw new AppError({
            ...errorCodes.VALIDATION,
            message: `Invalid '${schemaTitle}.${propName}' field`,
            meta: { example, expect: description },
            layer: this.constructor.name
          })
        }
      }
    })
  }
}

module.exports = { BaseController }
