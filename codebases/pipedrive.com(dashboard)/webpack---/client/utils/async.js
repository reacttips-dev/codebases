const reduceAsync = async (array, func, initial) =>
	array.reduce(async (promise, next) => func(await promise, next), Promise.resolve(initial));

export { reduceAsync };
