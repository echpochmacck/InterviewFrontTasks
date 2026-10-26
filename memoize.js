// memoize(fn, resolver?)
// База: кэширует результат по аргументам.
// Middle: кастомный resolver для ключа; cache наружу (memoized.cache.clear()); Map вместо объекта.
// Edge cases: объекты в аргументах (ключ по ссылке или JSON.stringify и его минусы); undefined как результат; сохранение this.

function memoize(fn, resolver = null) {
  const map = new Map();
  return function (...args) {
    let key;
    if (resolver) {
      key = resolver(args);
    } else {
      key = JSON.stringify(args);
    }
    if (map.has(key)) {
      return map.get(key);
    } else {
      const result = fn.apply(this, args);
      map.set(key, result);
      return result;
    }
  };
}
function test(label, actual, expected) {
  console.log(
    actual === expected ? "✅" : "❌",
    label,
    "→",
    actual,
    `(ожидали ${expected})`,
  );
}

// ===== 1. База: кэш по одному аргументу =====
let calls = 0;
const square = (n) => {
  calls++;
  return n * n;
};
const mSquare = memoize(square);

test("первый вызов", mSquare(4), 16);
test("вызвалась 1 раз", calls, 1);
test("повтор — из кэша", mSquare(4), 16);
test("всё ещё 1 вызов", calls, 1);
test("другой аргумент", mSquare(5), 25);
test("теперь 2 вызова", calls, 2);

// ===== 2. Несколько аргументов =====
let sumCalls = 0;
const sum = (a, b) => {
  sumCalls++;
  return a + b;
};
const mSum = memoize(sum);

test("sum(1, 2)", mSum(1, 2), 3);
test("sum(1, 2) из кэша", mSum(1, 2), 3);
test("1 вызов", sumCalls, 1);
test("sum(2, 1) — другие аргументы", mSum(2, 1), 3);
test("2 вызова", sumCalls, 2);

// ===== 3. Ловушки с ключами =====
let keyCalls = 0;
const identity = (...args) => {
  keyCalls++;
  return args;
};
const mId = memoize(identity);

mId(1);
mId("1");
test('1 и "1" — разные ключи', keyCalls, 2);

mId(1, 23);
mId(12, 3);
test("(1, 23) и (12, 3) — разные ключи", keyCalls, 4); // ловушка при склейке args.join('')

// ===== 4. Falsy и undefined результаты =====
let falsyCalls = 0;
const returnsZero = () => {
  falsyCalls++;
  return 0;
};
const mZero = memoize(returnsZero);
mZero();
mZero();
mZero();
test("0 кэшируется", falsyCalls, 1);

let undefCalls = 0;
const returnsUndef = (x) => {
  undefCalls++;
  return undefined;
};
const mUndef = memoize(returnsUndef);
mUndef(1);
mUndef(1);
test("undefined кэшируется", undefCalls, 1); // ловушка: if (cache[key]) или if (cache.get(key))

// ===== 5. this =====
const calculator = {
  factor: 10,
  multiply: memoize(function (n) {
    return n * this.factor;
  }),
};
test("this сохраняется", calculator.multiply(3), 30);

// ===== 6. Объекты в аргументах (middle) =====
let objCalls = 0;
const getName = (user) => {
  objCalls++;
  return user.name;
};
const mGetName = memoize(getName);

const user = { name: "Ann" };
mGetName(user);
mGetName(user);
test("тот же объект — из кэша", objCalls, 1);

mGetName({ name: "Ann" });
console.log("новый объект с тем же содержимым — вызовов:", objCalls);
// 1 или 2 — зависит от того, как строишь ключ. Нужно уметь объяснить оба варианта.

// ===== 7. resolver (middle, как в lodash) =====
let resCalls = 0;
const fetchUser = (user) => {
  resCalls++;
  return `data for ${user.id}`;
};
const mFetchUser = memoize(fetchUser, (user) => user.id);

mFetchUser({ id: 1, name: "Ann" });
mFetchUser({ id: 1, name: "Ann (updated)" });
test("ключ по resolver — из кэша", resCalls, 1);

// ===== 8. Доступ к кэшу (middle) =====
// mSquare.cache.clear();
// mSquare(4);
// test('после clear — новый вызов', calls, 3);

// ===== 9. Практический пример: фибоначчи =====
let fibCalls = 0;
const fib = memoize((n) => {
  fibCalls++;
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
});
console.log("fib(40) =", fib(40)); // 102334155 — мгновенно
test("fib(40) — вызовов", fibCalls, 41); // без memoize было бы ~330 миллионов
