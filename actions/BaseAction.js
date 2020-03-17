const { assert } = require('../lib')

class BaseAction {
  static result(result) {
    assert.object(result, { notEmpty: true })
    assert.boolean(result.success)
    assert.integer(result.status)
    assert.object(result.headers)
    assert.string(result.message)
    assert.isOk(result.data)

    return {
      success: result.success || true,
      status: result.status || 200,
      ...(result.headers && { headers: result.headers }),
      ...(result.message && { message: result.message }),
      ...(result.data && { data: result.data })
    }
  }

  static redirect(options) {
    assert.object(options, { required: true })
    assert.url(options.url, { required: true })
    assert.integer(options.code)

    return {
      redirect: {
        status: options.status || 301,
        url: options.url
      }
    }
  }
}

module.exports = BaseAction
