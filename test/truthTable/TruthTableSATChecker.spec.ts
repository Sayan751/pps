import "babel-polyfill";
import { Clause } from "../../src/core/Clause";
import { CNF } from "../../src/core/CNF";
import { Connectives } from "../../src/core/Constants";
import { Literal } from "../../src/core/Literal";
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
});