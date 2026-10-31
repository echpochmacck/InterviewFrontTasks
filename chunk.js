function chunk(arr, size) {
  const formattedSize = parseInt(size);
  if (formattedSize < 1) return [];
  let i = 0;
  const res = [];
  while (i < arr.length) {
    res.push(arr.slice(i, i + formattedSize));
    i = i + formattedSize;
  }
  return res;
}

console.log(chunk([1, 2, 3, 4, 5], 2.75));
