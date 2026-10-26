function cloneDeep(obj) {

    if (typeof obj === 'object' && obj !== null) {
        let clone
        if (Array.isArray(obj)) {
            clone = []
        } else {
            clone = Object.assign({}, obj)
        }
        for (let key in obj) {
            clone[key] = cloneDeep(obj[key])
        }
        return clone
    }
    return obj
}


const obj1 = { a: 123, b: { c: 3 } }

const array = [123, 3, 4, 5 ]

const obj2 = cloneDeep(array)

console.log(obj2, obj1)