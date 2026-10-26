
// flatten with recursion
const flatten = (array, depth = 1, currentDepth = 0) => {
    const res = [];
    array.forEach((item) => {
        if (Array.isArray(item) && depth > currentDepth) {
            res.push(...flatten(item, depth, currentDepth+1))
        } else {
            res.push(item)
        }   
    })
    return res
}



console.log(flatten([213, [123, [4]], [3]]))