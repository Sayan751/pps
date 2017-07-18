import { Utility } from "../../src/core/Utility";

describe("Utility test suite", () => {
    describe("generateAllPairs test suite", () => {

        const threeItems = [1, 2, 3];
        const fourItems = [1, 2, 3, 4];
        /*
        'input:', [1, 2, 3], ', output:', [[1, 2], [1, 3], [2, 3]]
        'input:', [1, 2, 3, 4], ', output:', [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
        */
        it("generateAllPairs should return value", () => {
            expect(Utility.generateAllPairs(threeItems)).toBeDefined();
        });
        it("generateAllPairs should return empty value for empty input", () => {
            expect(Utility.generateAllPairs([]).length).toBe(0);
        });
        it("generateAllPairs should return 0 combination for input array with 1 item", () => {
            expect(Utility.generateAllPairs([1]).length).toBe(0);
        });
        it("generateAllPairs should return 1 combination for input array with 2 items", () => {
            expect(Utility.generateAllPairs([1, 2]).length).toBe(1);
        });
        it("generateAllPairs should return 3 combinations for input array with 3 items", () => {
            expect(Utility.generateAllPairs(threeItems).length).toBe(3);
        });
        it("generateAllPairs should return 6 combinations for input array with 4 items", () => {
            expect(Utility.generateAllPairs(fourItems).length).toBe(6);
        });
    });
});