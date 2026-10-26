function promiseAll(arr) {
    return new Promise((resolve, rej) => {
        let completed = 0;
        const res = []
        if (!arr.length) resolve([])

        arr.forEach((item, i) => {
            Promise.resolve((item)).then((val) => {
                res[i] = val
                completed++
                if (arr.length == completed) {
                    resolve(res)
                }
            }).catch(rej)

        });
    })

}

const p0 = new Promise((resolve) => setTimeout(() => resolve('p0'), 1000))
const p1 = 1
const p2 = new Promise((resolve) => resolve(2))


promiseAll([p0, p1, p2]).then((val) => console.log(val))