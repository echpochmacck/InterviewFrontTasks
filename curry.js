function curry(fn) {
    return function curried(...args) {
        const context = this
        if (fn.length > Fargs.length) {
            return function (..._args) {
                return curried.apply(context, [...args, ..._args])
            }
        } else {
            return fn.apply(this, args)
        }
    }
}

const log = (a, b, c) => {
    console.log(a, b, c)
}

const log2 = curry(log)
log2(2)(4)(2)


