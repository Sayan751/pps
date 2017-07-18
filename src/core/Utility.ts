export class Utility {
    static generateAllPairs<T>(arr: T[]): T[][] {
        return arr.reduce(
            (acc: T[][], item1, index) => acc.concat(arr.slice(index + 1).map(item2 => [item1, item2])),
            []);
    }
}