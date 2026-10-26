const isEqual = (obj1, obj2) => {
    if (Number.isNaN(obj1) && Number.isNaN(obj2)) return true

    if (typeof obj1 == 'object' && typeof obj2 == 'object') {
        if (Array.isArray(obj1) !== Array.isArray(obj2)) return false
        if (obj1 instanceof Date && obj2 instanceof Date)
            return obj1.getTime() === obj2.getTime()

        if (obj1 instanceof RegExp && obj2 instanceof RegExp)
            return obj1.toString() === obj2.toString()

        
        if (obj1 && obj2) {
            const keys1 = Object.keys(obj1)
            const keys2 = Object.keys(obj2)
            let res = true
            if (keys1.length == keys2.length) {
                for (const key of keys1) {
                    if (key in obj2) {
                        res = isEqual(obj1[key], obj2[key])
                        if (!res) return false
                    } else {
                        return false
                    }
                }
                return res
            } else {
                return false
            }
        } else {
            return obj1 === obj2
        }
    } else {
        return obj1 === obj2
    }
}

function test(label, actual, expected) {
    console.log(actual === expected ? '✅' : '❌', label, '→', actual, `(ожидали ${expected})`);
}

// ===== 1. Примитивы =====
test('числа равны', isEqual(1, 1), true);
test('числа разные', isEqual(1, 2), false);
test('строки', isEqual('a', 'a'), true);
test('число vs строка', isEqual(1, '1'), false);
test('null vs null', isEqual(null, null), true);
test('undefined vs undefined', isEqual(undefined, undefined), true);
test('null vs undefined', isEqual(null, undefined), false);
test('true vs 1', isEqual(true, 1), false);

// ===== 2. Объекты =====
test('пустые объекты', isEqual({}, {}), true);
test('одинаковые объекты', isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }), true);
test('порядок ключей не важен', isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
test('разные значения', isEqual({ a: 1 }, { a: 2 }), false);
test('лишний ключ справа', isEqual({ a: 1 }, { a: 1, b: 2 }), false);
test('лишний ключ слева', isEqual({ a: 1, b: 2 }, { a: 1 }), false);
test('undefined vs нет ключа', isEqual({ a: undefined }, { b: undefined }), false);

// ===== 3. Вложенность =====
test('вложенные равны', isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } }), true);
test('вложенные разные', isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } }), false);
test('объект в массиве', isEqual([{ a: 1 }], [{ a: 1 }]), true);
test('массив в объекте', isEqual({ list: [1, 2] }, { list: [1, 2] }), true);

// ===== 4. Массивы =====
test('массивы равны', isEqual([1, 2, 3], [1, 2, 3]), true);
test('порядок важен', isEqual([1, 2, 3], [3, 2, 1]), false);
test('разная длина', isEqual([1, 2], [1, 2, 3]), false);
test('пустые массивы', isEqual([], []), true);

// ===== 5. Ловушки с типами =====
test('[] vs {}', isEqual([], {}), false);
test('null vs {}', isEqual(null, {}), false);
test('{} vs null', isEqual({}, null), false);
test('[1,2] vs {0:1,1:2}', isEqual([1, 2], { 0: 1, 1: 2 }), false);

// ===== 6. Особые числа (middle) =====
test('NaN vs NaN', isEqual(NaN, NaN), true);
test('NaN внутри', isEqual({ a: NaN }, { a: NaN }), true);
test('+0 vs -0', isEqual(0, -0), true); // lodash считает равными

// ===== 7. Спецтипы (middle) =====
test('Date равны', isEqual(new Date('2026-01-01'), new Date('2026-01-01')), true);
test('Date разные', isEqual(new Date('2026-01-01'), new Date('2026-01-02')), false);
test('RegExp равны', isEqual(/abc/g, /abc/g), true);
test('RegExp разные флаги', isEqual(/abc/g, /abc/i), false);
test('Date vs {}', isEqual(new Date(0), {}), false);

// ===== 8. Ссылки =====
const same = { a: 1 };
test('один и тот же объект', isEqual(same, same), true);

// ===== 9. Циклы (продвинутое) =====
const c1 = { a: 1 }; c1.self = c1;
const c2 = { a: 1 }; c2.self = c2;
test('циклические ссылки', isEqual(c1, c2), true);