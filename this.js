'use strict'

const user = {
  name: 'Аня',
  regular() { return this },
  arrow: () => this,
}

console.log(user.regular() )              // 1
const fn = user.regular
console.log(fn())                          // 2 undefined
console.log(user.arrow())                  // 3
console.log(user.regular.call({ x: 1 }))   // 4
console.log(new function () { this.a = 1 })