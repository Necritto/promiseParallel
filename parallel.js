const runTask = parallel(2);
runTask(() => new Promise((resolve) => setTimeout(resolve, 1000))).then(() => console.log("1"));
runTask(() => new Promise((resolve) => setTimeout(resolve, 1000))).then(() => console.log("2"));
runTask(() => new Promise((resolve) => setTimeout(resolve, 2000))).then(() => console.log("3"));
runTask(() => new Promise((resolve) => setTimeout(resolve, 3000))).then(() => console.log("4"));
runTask(() => new Promise((resolve) => setTimeout(resolve, 4000))).then(() => console.log("5"));

function parallel(maxCountParallelPromises) {
  const deferredTask = [];
  let currentTaskCounter = 0;
  return function runTask(cb) {
    if (currentTaskCounter < maxCountParallelPromises) {
      currentTaskCounter++;
      return cb().then(() => {
        currentTaskCounter--;
        if (deferredTask.length) {
          deferredTask.shift()();
        }
      });
    }

    return new Promise((resolve) => {
      deferredTask.push(() => runTask(cb).then(resolve));
    });
  };
}