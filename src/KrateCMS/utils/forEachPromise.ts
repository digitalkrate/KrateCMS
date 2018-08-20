export default async function forEachPromise(items, fn) {
  return items.reduce(async(promise, item) => {
    return promise.then(() => {
      return fn(item);
    });
  }, Promise.resolve());
}
