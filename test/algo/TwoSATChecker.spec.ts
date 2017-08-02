import "babel-polyfill";
import { TwoSATChecker } from "../../src/algo/TwoSATChecker";
import { Clause } from "../../src/core/Clause";
import { CNF } from "../../src/core/CNF";
import { Connectives } from "../../src/core/Constants";
import { Literal } from "../../src/core/Literal";
import { Utility } from "../../src/core/Utility";

describe("TwoSATChecker test suite", () => {

    describe("satisfiability should be determined correctly", () => {
        it(`x ${Connectives.and} ${Connectives.not}x should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true)])
            ]);

            expect(TwoSATChecker.isSat(cnf)).toBe(false);
        });

        it(`(x ${Connectives.or} y) ${Connectives.and} (${Connectives.not}x ${Connectives.or} ${Connectives.not}y) should be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x"), new Literal("y")]),
                new Clause([new Literal("x", true), new Literal("y", true)]),
            ]);

            expect(TwoSATChecker.isSat(cnf)).toBe(true);
        });

        it(`x ${Connectives.and} (${Connectives.not}x ${Connectives.or} y) ${Connectives.and} ${Connectives.not}y should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true), new Literal("y")]),
                new Clause([new Literal("y", true)]),
            ]);

            expect(TwoSATChecker.isSat(cnf)).toBe(false);
        });

        it(`x ${Connectives.and} (${Connectives.not}x ${Connectives.or} y) ${Connectives.and} ${Connectives.not}y ${Connectives.and} (a ${Connectives.or} z) should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true), new Literal("y")]),
                new Clause([new Literal("y", true)]),
                new Clause([new Literal("a"), new Literal("z")]),
            ]);

            expect(TwoSATChecker.isSat(cnf)).toBe(false);
        });

        it(`a ${Connectives.and} (${Connectives.not}a ${Connectives.or} b) ${Connectives.and} (${Connectives.not}a ${Connectives.or} ${Connectives.not}b) should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("a")]),
                new Clause([new Literal("a", true), new Literal("b")]),
                new Clause([new Literal("a", true), new Literal("b", true)]),
            ]);

            expect(TwoSATChecker.isSat(cnf)).toBe(false);
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

            expect(TwoSATChecker.isSat(cnf)).toBe(false);
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

            expect(TwoSATChecker.isSat(cnf)).toBe(true);
        });
    });
    describe("satisfiability should be determined correctly for the formulas in string", () => {
        it("x AND NOTx should not be satisfiable", () => {
            const str = "x AND NOTx";
            expect(TwoSATChecker.isSat(str)).toBe(false);
        });

        it("(x OR y) AND (NOTx or NOTy) should be satisfiable", () => {
            const str = "(x OR y) AND (NOTx or NOTy)";
            expect(TwoSATChecker.isSat(str)).toBe(true);
        });
    });
    describe("satisfiability should be determined correctly when CNF#isSat is used", () => {
        it(`x ${Connectives.and} ${Connectives.not}x should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true)]),
            ]);

            expect(cnf.isSat(TwoSATChecker)).toBe(false);
        });
        it(`(x ${Connectives.or} y) ${Connectives.and} (${Connectives.not}x ${Connectives.or} ${Connectives.not}y) should be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x"), new Literal("y")]),
                new Clause([new Literal("x", true), new Literal("y", true)]),
            ]);

            expect(cnf.isSat(TwoSATChecker)).toBe(true);
        });
    });
});