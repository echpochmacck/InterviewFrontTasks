
// Throttle с trailing что если мы вызывали во время паузы то выполнится еще последний вызов после нее 

function throttle(fn, ms) {
    let timerId = null;
    let setArgs
    let isCalled
    let context
    return function throttled(...args) {
        setArgs = args
        context = this
        if (!timerId) {
            fn.apply(context, args)
            const startPause = () => {
                return setTimeout(() => {
                    timerId = null
                    if (isCalled) {
                        fn.apply(context, setArgs)
                        isCalled = false
                        timerId = startPause()
                    }
                }, ms)
            }
            timerId = startPause()
        } else {
            isCalled = true
        }
    }
}




const start = Date.now();
const t = throttle((msg) => console.log(msg, Date.now() - start), 1000);
t('one'); // ожидаем: только "one ~0". У тебя: "one ~0" и "one ~1000"