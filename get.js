function get(obj, path, defaultValue = undefined) {
    let res = undefined
    if (obj !== null) {
        let pathArr
        if (Array.isArray(path)) {
            pathArr = path
        } else {
            pathArr = path.split('.')
        }
        if (pathArr.length == 1) {
            res = obj[pathArr[0]]
        } else {
            res = get(obj[pathArr[0]], pathArr.slice(1).join('.'), defaultValue)
        }
    }
    return res === undefined ? defaultValue : res
}


function get2(obj, path, defaultValue = undefined ) {
    let res
    path = path.replaceAll(/\[/g, '.')
    path = path.replaceAll(/\]/g, '')
    if (obj  !== null) {
        let pathArr
        if (Array.isArray(path)) {
            pathArr = path
        } else {
            pathArr = path.split('.')
            console.log(pathArr)
        }

        if (pathArr.length == 1) {
            res = obj[pathArr[0]]
        } else {
            res = get(obj[pathArr[0]], pathArr.slice(1).join('.'), defaultValue)
        }
    }
    return res === undefined ? defaultValue : res
}

const user = { profile: { address: { city: 'Moscow' } } };
const obj2 = { a: 1 }
console.log(get2(user, 'profile', 'dwfa'))
console.log(get2({ fn() { } }, 'test[0].index')); 