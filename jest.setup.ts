// for testing
// jest by default doesnt give you the error when a test fails for some reason

const wrap = (fn: Function) => {
    return (...args: any[]) => {
        const testFn = args.pop();
        args.push(async () => {
            try {
                await testFn();
            } catch (e) {
                console.error(e);
                throw e;
            }
        });
        fn(...args);
    };
};

(globalThis as any).it = wrap(it);
(globalThis as any).test = wrap(test);
(globalThis as any).beforeEach = wrap(beforeEach);
(globalThis as any).afterEach = wrap(afterEach);

