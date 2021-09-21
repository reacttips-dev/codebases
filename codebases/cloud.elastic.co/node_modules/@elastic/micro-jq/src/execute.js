const parser = require('./parser')

module.exports = function executeScript(input, script) {
  const opCodes = parser.parse(script)

  return evaluateOpCodes([input], opCodes)
}

function evaluateOpCodes(context, opCodes, callback) {
  if (!Array.isArray(opCodes)) {
    opCodes = [opCodes]
  }

  do {
    const opCode = opCodes.shift()

    switch (opCode.op) {
      case 'current_context':
        break

      case 'literal':
        context = [opCode.value]
        break

      case 'pick':
        context = evaluateOpCode_pick(context, opCode)
        break

      case 'index':
        context = evaluateOpCode_index(context, opCode)
        break

      case 'slice':
        context = evaluateOpCode_slice(context, opCode)
        break

      case 'explode':
        context = evaluateOpCode_explode(context, opCode, callback)
        break

      case 'create_array':
        context = evaluateOpCode_create_array(context, opCode)
        break

      case 'create_object':
        context = evaluateOpCode_create_object(context, opCode, callback)
        break

      case 'pipe':
        context = evaluateOpCode_pipe(context, opCode, callback)
        break

      default:
        throw new Error('Unknown op code: ' + opCode.op)
    }
  } while (opCodes.length > 0)

  return context.length > 1 ? context : context[0]
}

function evaluateOpCode_pick(context, opCode) {
  return context.reduce((result, each) => {
    if (each != null && typeof each !== 'object') {
      if (opCode.strict) {
        throw new Error(`Cannot index ${typeof each} with ${opCode.key}`)
      }
      // Skip this value entirely
      return result
    }
    let picked = null
    if (each && each[opCode.key]) {
      picked = each[opCode.key]
    }
    result.push(picked)
    return result
  }, [])
}

function evaluateOpCode_index(context, opCode) {
  return context.reduce((result, each) => {
    if (!Array.isArray(each)) {
      if (opCode.strict) {
        throw new Error('Can only index into arrays')
      }
      return result
    }
    let indexed
    if (Math.abs(opCode.index) > each.length || opCode.index === each.length) {
      indexed = null
    } else if (opCode.index < 0) {
      indexed = each.slice(opCode.index)[0]
    } else {
      indexed = each[opCode.index]
    }
    result.push(indexed)
    return result
  }, [])
}

function evaluateOpCode_slice(context, opCode) {
  return context.reduce((result, each) => {
    if ('undefined' === typeof each.slice) {
      if (opCode.strict) {
        throw new Error('Cannot slice ' + typeof each)
      }
      return result
    }
    if (undefined === opCode.start && undefined === opCode.end) {
      throw new Error('Cannot slice with no offsets')
    }
    result.push(each.slice(opCode.start, opCode.end))
    return result
  }, [])
}

function evaluateOpCode_explode(context, opCode, callback) {
  context = context.reduce((result, each) => {
    if (Array.isArray(each)) {
      return result.concat(each)
    } else if (typeof each === 'object' && each != null) {
      return result.concat(Object.values(each))
    }
    if (opCode.strict) {
      let type = typeof each
      if (each === null) {
        // jq throws an error specifically for null, so let's
        // distinguish that from object.
        type = 'null'
      }
      throw new Error('Cannot iterate over ' + type)
    }
    return result
  }, [])
  if (callback) {
    callback(context.length)
  }
  return context
}

function evaluateOpCode_create_array(context, opCode) {
  return [
    opCode.values.reduce((result, each) => {
      const exploder = makeExploder()
      // Array creation terminates an explode chain - all generated
      // results will get collected in the singular array. As such,
      // no parent is called to makeExploderCb, and none is taken by
      // this function.
      let values = evaluateOpCodes(context, [...each], makeExploderCb(exploder))
      if (!exploder.exploded) {
        result.push(values)
      } else {
        switch (exploder.length) {
          case 0:
            break

          case 1:
            result.push(values)
            break

          default:
            result = result.concat(values)
        }
      }

      return result
    }, []),
  ]
}

function evaluateOpCode_create_object(context, opCode, callback) {
  return evaluateOpCode_create_object_build(
    {},
    Object.entries(
      opCode.entries.reduce((result, each) => {
        const exploder = makeExploder()
        let values = evaluateOpCodes(context, [...each.value], makeExploderCb(exploder, callback))
        if (!exploder.exploded) {
          result[each.key] = [values]
        } else {
          switch (exploder.length) {
            case 0:
              result[each.key] = []
              break

            case 1:
              result[each.key] = [values]
              break

            default:
              result[each.key] = values
              break
          }
        }
        return result
      }, {})
    )
  )
}

function evaluateOpCode_create_object_build(current, ops) {
  let result = []
  let key, values
  ;[key, values] = ops.shift()
  values.forEach((value) => {
    current[key] = value
    if (ops.length > 0) {
      result = result.concat(evaluateOpCode_create_object_build({ ...current }, [...ops]))
    } else {
      result.push({ ...current })
    }
  })
  return result
}

function evaluateOpCode_pipe(context, opCode, callback) {
  const exploder = makeExploder()
  context = evaluateOpCodes(context, [...opCode.in], makeExploderCb(exploder, callback))
  if (!exploder.exploded) {
    context = evaluateOpCodes([context], [...opCode.out])
  } else {
    switch (exploder.length) {
      case 0:
        context = []
        break

      case 1:
        context = [context]
        break
    }
    context = context.map((each) => evaluateOpCodes([each], [...opCode.out]))
  }
  return context
}

function makeExploder() {
  return { exploded: false, length: 0 }
}

function makeExploderCb(exploder, callback) {
  return (length) => {
    exploder.exploded = true
    exploder.length = length
    if (callback) {
      callback(length)
    }
  }
}
