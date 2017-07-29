import "babel-polyfill";
import { Clause } from "../../src/core/Clause";
import { CNF } from "../../src/core/CNF";
import { Connectives } from "../../src/core/Constants";
import { Literal } from "../../src/core/Literal";
import { Utility } from "../../src/core/Utility";
import { TruthTableSATChecker } from "../../src/truthTable/TruthTableSATChecker";

describe("TruthTableSATChecker test suite", () => {

    describe("satisfiability should be determined correctly", () => {
        it(`x ${Connectives.and} ${Connectives.not}x should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true)]),
            ]);

            expect(TruthTableSATChecker.isSat(cnf)).toBe(false);
        });

        it(`(x ${Connectives.or} y) ${Connectives.and} (${Connectives.not}x ${Connectives.or} ${Connectives.not}y) should be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x"), new Literal("y")]),
                new Clause([new Literal("x", true), new Literal("y", true)]),
            ]);

            expect(TruthTableSATChecker.isSat(cnf)).toBe(true);
        });

        it(`x ${Connectives.and} (${Connectives.not}x ${Connectives.or} y) ${Connectives.and} ${Connectives.not}y should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true), new Literal("y")]),
                new Clause([new Literal("y", true)]),
            ]);

            expect(TruthTableSATChecker.isSat(cnf)).toBe(false);
        });

        it(`x ${Connectives.and} (${Connectives.not}x ${Connectives.or} y) ${Connectives.and} ${Connectives.not}y ${Connectives.and} (a ${Connectives.or} z) should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true), new Literal("y")]),
                new Clause([new Literal("y", true)]),
                new Clause([new Literal("a"), new Literal("z")]),
            ]);

            expect(TruthTableSATChecker.isSat(cnf)).toBe(false);
        });

        it(`a ${Connectives.and} (${Connectives.not}a ${Connectives.or} b) ${Connectives.and} (${Connectives.not}a ${Connectives.or} ${Connectives.not}b) should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("a")]),
                new Clause([new Literal("a", true), new Literal("b")]),
                new Clause([new Literal("a", true), new Literal("b", true)]),
            ]);

            expect(TruthTableSATChecker.isSat(cnf)).toBe(false);
        });

        let formula = `(a ${Connectives.or} ${Connectives.not}b ${Connectives.or} ${Connectives.not}c) ${Connectives.and} ` +
            `(${Connectives.not}a ${Connectives.or} ${Connectives.not}b) ${Connectives.and} b ${Connectives.and} c`;
        it(`${formula} should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("a"), new Literal("b", true), new Literal("c", true)]),
                new Clause([new Literal("a", true), new Literal("b", true)]),
                new Clause([new Literal("b")]),
                new Clause([new Literal("c")]),
            ]);

            expect(TruthTableSATChecker.isSat(cnf)).toBe(false);
        });

        formula = `(y ${Connectives.or} z ${Connectives.or} u) ${Connectives.and}` +
            `(${Connectives.not}y ${Connectives.or} ${Connectives.not}z ${Connectives.or} w) ${Connectives.and}` +
            `(y ${Connectives.or} z) ${Connectives.and} ${Connectives.not}w`;
        it(`${formula} should be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("y"), new Literal("z"), new Literal("u")]),
                new Clause([new Literal("y", true), new Literal("z", true), new Literal("w")]),
                new Clause([new Literal("y"), new Literal("z")]),
                new Clause([new Literal("w")]),
            ]);

            expect(TruthTableSATChecker.isSat(cnf)).toBe(true);
        });
    });
    describe("satisfiability should be determined correctly for the formulas in string", () => {
        it("x AND NOTx should not be satisfiable", () => {
            const str = "x AND NOTx";
            expect(TruthTableSATChecker.isSat(str)).toBe(false);
        });

        it("(x OR y) AND (NOTx or NOTy) should be satisfiable", () => {
            const str = "(x OR y) AND (NOTx or NOTy)";
            expect(TruthTableSATChecker.isSat(str)).toBe(true);
        });
    });
    describe("satisfiability should be determined correctly when CNF#isSat is used", () => {
        it(`x ${Connectives.and} ${Connectives.not}x should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true)]),
            ]);

            expect(cnf.isSat(TruthTableSATChecker)).toBe(false);
        });
        it(`(x ${Connectives.or} y) ${Connectives.and} (${Connectives.not}x ${Connectives.or} ${Connectives.not}y) should be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x"), new Literal("y")]),
                new Clause([new Literal("x", true), new Literal("y", true)]),
            ]);

            expect(cnf.isSat(TruthTableSATChecker)).toBe(true);
        });
    });

    describe("satisfiability model should be determined correctly", () => {
        it("x AND NOTx should should have an empty model", () => {
            const str = "x AND NOTx";
            expect(TruthTableSATChecker.getModel(str).length).toBe(0);
        });

        it("(x OR y) AND (NOTx or NOTy)should should have model of size 2", () => {
            const str = "(x OR y) AND (NOTx or NOTy)";
            const model = TruthTableSATChecker.getModel(str);
            const expected = new Set([
                new Map<string, boolean>([["x", true], ["y", false]]),
                new Map<string, boolean>([["x", false], ["y", true]])
            ]);
            expect(model.length).toBe(2);
            expect(JSON.stringify(expected)).toBe(JSON.stringify(model));
        });
    });

    describe("isSat should call the binary combination generator correct number of times", () => {
        const formula = `x ${Connectives.and} (${Connectives.not}x ${Connectives.or} y) ${Connectives.and} ${Connectives.not}y ${Connectives.and} (a ${Connectives.or} z)`;
        it(`For ${formula} the generator should be called 17 times`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true), new Literal("y")]),
                new Clause([new Literal("y", true)]),
                new Clause([new Literal("a"), new Literal("z")]),
            ]);

            const binaryCombinationsSpy = jasmine.createSpyObj("binaryCombinationGenerator", ["next", "counter"]);
            binaryCombinationsSpy.counter = 0;
            const values = [
                { value: [false, false, false, false] },
                { value: [false, false, false, true] },
                { value: [false, false, true, false] },
                { value: [false, false, true, true] },
                { value: [false, true, false, false] },
                { value: [false, true, false, true] },
                { value: [false, true, true, false] },
                { value: [false, true, true, true] },
                { value: [true, false, false, false] },
                { value: [true, false, false, true] },
                { value: [true, false, true, false] },
                { value: [true, false, true, true] },
                { value: [true, true, false, false] },
                { value: [true, true, false, true] },
                { value: [true, true, true, false] },
                { value: [true, true, true, true] }];
            binaryCombinationsSpy.next.and.callFake(() => {
                if (binaryCombinationsSpy.counter < values.length) {
                    binaryCombinationsSpy.counter++;
                    return values[binaryCombinationsSpy.counter - 1];
                }
                return { value: undefined };
            });
            spyOn(Utility, "binaryCombinationGenerator").and.returnValue(binaryCombinationsSpy);

            TruthTableSATChecker.isSat(cnf);
            expect(binaryCombinationsSpy.next).toHaveBeenCalledTimes(Math.pow(2, 4) + 1);
        });

        it(`For (${Connectives.not}x ${Connectives.or} x) the generator should be called once`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x"), new Literal("x", true)])
            ]);

            const binaryCombinationsSpy = jasmine.createSpyObj("binaryCombinationGenerator", ["next", "counter"]);
            binaryCombinationsSpy.counter = 0;
            const values = [
                { value: [false] },
                { value: [true] }];
            binaryCombinationsSpy.next.and.callFake(() => {
                if (binaryCombinationsSpy.counter < values.length) {
                    binaryCombinationsSpy.counter++;
                    return values[binaryCombinationsSpy.counter - 1];
                }
                return { value: undefined };
            });
            spyOn(Utility, "binaryCombinationGenerator").and.returnValue(binaryCombinationsSpy);

            TruthTableSATChecker.isSat(cnf);
            expect(binaryCombinationsSpy.next).toHaveBeenCalledTimes(1);
        });

        it(`For (x ${Connectives.or} y) the generator should be called twice`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x"), new Literal("y")])
            ]);

            const binaryCombinationsSpy = jasmine.createSpyObj("binaryCombinationGenerator", ["next", "counter"]);
            binaryCombinationsSpy.counter = 0;
            const values = [
                { value: [false, false] },
                { value: [false, true] },
                { value: [true, false] },
                { value: [true, true] }];
            binaryCombinationsSpy.next.and.callFake(() => {
                if (binaryCombinationsSpy.counter < values.length) {
                    binaryCombinationsSpy.counter++;
                    return values[binaryCombinationsSpy.counter - 1];
                }
                return { value: undefined };
            });
            spyOn(Utility, "binaryCombinationGenerator").and.returnValue(binaryCombinationsSpy);

            TruthTableSATChecker.isSat(cnf);
            expect(binaryCombinationsSpy.next).toHaveBeenCalledTimes(2);
        });
    });
});