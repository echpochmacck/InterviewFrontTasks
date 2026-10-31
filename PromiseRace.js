 function promiseRace (arr) {
    return new Promise((res, rej) => {
        if (arr.length) {
            arr.forEach((item) => {
                Promise.resolve(item).then((val) => {
                        res(val)
                }).catch(rej)               
            });
            
        }
    })

 }