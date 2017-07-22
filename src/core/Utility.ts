export class Utility {
    public static generateAllPairs<T>(arr: T[]): T[][] {
        return arr.reduce(
            (acc: T[][], item1, index) => acc.concat(arr.slice(index + 1).map((item2) => [item1, item2])),
            []);
    }

    public static *binaryCombinationGenerator(numVars: number): IterableIterator<boolean[]> {
        for (let i = 0; i < Math.pow(2, numVars); i++) {
            const c = [];
            for (let j = 0; j < numVars; j++) {
                // tslint:disable-next-line:no-bitwise
                c.push(i & (1 << j) ? true : false);
            }
            yield c;
        }
    }
}