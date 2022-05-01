/**
 * createShuffledArray shuffles the order of the elements in the provided arr
 * @param arr - array to shuffle
 * @param n - number of elements to shuffle, defaults to all elements
 */
export const shuffleArray = <T extends unknown>(
  arr: Array<T>,
  n: number = arr.length
): Array<T> => {
  const res = [...arr];
  for (let i = n - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
};

export const partitionArray = <T extends unknown>(
  arr: Array<T>,
  n: number
): Array<Array<T>> => {
  const res = [];
  while (arr.length) {
    const size = Math.ceil(arr.length / n);
    n--;
    res.push(arr.slice(0, size));
    arr = arr.slice(size);
  }
  return res;
};
