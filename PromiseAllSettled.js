function promiseAllSettled(arr) {
  return new Promise((res) => {
    const result = [];
    let completed = 0;
    arr.forEach((item, i) => {
      Promise.resolve(item)
        .then((val) => {
          result[i] = { status: "fulfilled", value: val };
          completed++;
          if (completed == arr.length) {
            res(result);
          }
        })
        .catch((err) => {
          result[i] = { status: "rejected", reason: err };
          completed++;
          if (completed == arr.length) {
            res(result);
          }
        });
    });
  });
}

// Хелпер: печатает результат в читаемом виде
const show = (label) => (res) =>
  console.log(
    label,
    JSON.stringify(
      res.map((r) =>
        r.status === "fulfilled"
          ? r
          : { status: r.status, reason: String(r.reason?.message ?? r.reason) },
      ),
    ),
  );

const delay = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms));
const fail = (ms, msg) =>
  new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms));

promiseAllSettled([delay(100, "a"), delay(50, "b")]).then(show("1. все ок:"));

promiseAllSettled([delay(100, "ok"), fail(50, "упал"), 42]).then(
  show("2. смешанные:"),
);
promiseAllSettled([fail(10, "e1"), fail(20, "e2")])
  .then(show("3. все упали (then):"))
  .catch(() => console.log("❌ 3. попали в catch — так быть не должно"));
promiseAllSettled([
  delay(300, "slow"),
  delay(10, "fast"),
  fail(100, "mid"),
]).then(show("4. порядок:"));
const start = Date.now();
promiseAllSettled([fail(50, "early"), delay(500, "late")]).then(
  () => console.log("5. время ~500:", Date.now() - start), // не ~50
);
