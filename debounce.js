function debounce(fn, delay) {
    let timerId = null;
    return function debounced(...args) {
        if (timerId) {
            clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

const log = debounce((msg) => console.log('Вызов:', msg), 1000)

log('первый')   // отменится
log('второй')   // отменится
log('третий')   // выполнится через 1 сек

setTimeout(() => log('четвёртый'), 2000)


//С усложнениями в виде cancel и flush


function debounce(fn, delay) {
    let timerId = null;
    let setArgs
    let context
    function debounced(...args) {
        setArgs = args
        context = this 
        if (timerId) {
            clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
            fn.apply(context, args)
            timerId = null
        }, delay)
    }

    debounced.cancel = () => {
        clearTimeout(timerId)
        timerId = null;
    }
    debounced.flush = () => {
        if (timerId) {
        fn.apply(context, setArgs)
        clearTimeout(timerId)
        timerId = null;    
        }
    }
    return debounced
}

const d = debounce((msg) => console.log('Вызов:', msg), 1000);
d('data');
d.flush();