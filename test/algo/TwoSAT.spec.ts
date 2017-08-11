import "babel-polyfill";
import { TwoSAT } from "../../src/algo/TwoSAT";
import { Clause } from "../../src/core/Clause";
import { CNF } from "../../src/core/CNF";
import { Connectives } from "../../src/core/Constants";
import { Literal } from "../../src/core/Literal";
import { NNF } from "../../src/core/NNF";
import { Utility } from "../../src/core/Utility";

describe("TwoSAT test suite", () => {

    describe("satisfiability should be determined correctly", () => {
        it(`x ${Connectives.and} ${Connectives.not}x should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true)])
            ]);

            expect(TwoSAT.isSat(cnf)).toBe(false);
        });

        it(`(x ${Connectives.or} y) ${Connectives.and} (${Connectives.not}x ${Connectives.or} ${Connectives.not}y) should be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x"), new Literal("y")]),
                new Clause([new Literal("x", true), new Literal("y", true)]),
            ]);

            expect(TwoSAT.isSat(cnf)).toBe(true);
        });

        it(`x ${Connectives.and} (${Connectives.not}x ${Connectives.or} y) ${Connectives.and} ${Connectives.not}y should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true), new Literal("y")]),
                new Clause([new Literal("y", true)]),
            ]);

            expect(TwoSAT.isSat(cnf)).toBe(false);
        });

        it(`x ${Connectives.and} (${Connectives.not}x ${Connectives.or} y) ${Connectives.and} ${Connectives.not}y ${Connectives.and} (a ${Connectives.or} z) should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true), new Literal("y")]),
                new Clause([new Literal("y", true)]),
                new Clause([new Literal("a"), new Literal("z")]),
            ]);

            expect(TwoSAT.isSat(cnf)).toBe(false);
        });

        it(`a ${Connectives.and} (${Connectives.not}a ${Connectives.or} b) ${Connectives.and} (${Connectives.not}a ${Connectives.or} ${Connectives.not}b) should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("a")]),
                new Clause([new Literal("a", true), new Literal("b")]),
                new Clause([new Literal("a", true), new Literal("b", true)]),
            ]);

            expect(TwoSAT.isSat(cnf)).toBe(false);
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

            expect(TwoSAT.isSat(cnf)).toBe(false);
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

            expect(TwoSAT.isSat(cnf)).toBe(true);
        });
    });
    describe("satisfiability should be determined correctly for the formulas in string", () => {
        it("x AND NOTx should not be satisfiable", () => {
            const str = "x AND NOTx";
            expect(TwoSAT.isSat(str)).toBe(false);
        });

        it("(x OR y) AND (NOTx or NOTy) should be satisfiable", () => {
            const str = "(x OR y) AND (NOTx or NOTy)";
            expect(TwoSAT.isSat(str)).toBe(true);
        });
    });
    describe("satisfiability should be determined correctly when CNF#isSat is used", () => {
        it(`x ${Connectives.and} ${Connectives.not}x should not be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x")]),
                new Clause([new Literal("x", true)]),
            ]);

            expect(cnf.isSat(TwoSAT)).toBe(false);
        });
        it(`(x ${Connectives.or} y) ${Connectives.and} (${Connectives.not}x ${Connectives.or} ${Connectives.not}y) should be satisfiable`, () => {
            const cnf = new CNF([
                new Clause([new Literal("x"), new Literal("y")]),
                new Clause([new Literal("x", true), new Literal("y", true)]),
            ]);

            expect(cnf.isSat(TwoSAT)).toBe(true);
        });
    });
    describe("entailment of 2 formulas should be determined correctly", () => {
        it("if alpha is not CNF then it should cause error", () => {
            expect(() => TwoSAT.entails(Literal.parse("x"), CNF.parse("x"))).toThrowError();
            expect(() => TwoSAT.entails(Clause.parse("x"), CNF.parse("x"))).toThrowError();
            expect(() => TwoSAT.entails(new NNF([new Literal("x")]), CNF.parse("x"))).toThrowError();
        });
        it("if beta is conjunctive clause then it should cause error", () => {
            expect(() => TwoSAT.entails(CNF.parse("x"), Clause.parse("x AND y"))).toThrowError(/conjunctive/ig);
        });
        it("if beta is NNF then it should cause error", () => {
            expect(() => TwoSAT.entails(CNF.parse("x"), new NNF([new Literal("x")]))).toThrowError(/NNF/ig);
        });
        it("if beta is CNF with at least one non-unit clause then it should cause error", () => {
            expect(() => TwoSAT.entails(CNF.parse("x"), CNF.parse("(x or y) and z"))).toThrowError(/CNF/ig);
        });
        it("x entails x", () => {
            expect(TwoSAT.entails(CNF.parse("x"), CNF.parse("x"))).toBe(true);
        });
        it("x does not entail y", () => {
            expect(TwoSAT.entails(CNF.parse("x"), Literal.parse("y"))).toBe(false);
        });
        it("x does not entail NOTx", () => {
            expect(TwoSAT.entails(CNF.parse("x"), Literal.parse("NOTx"))).toBe(false);
        });
        it("x entails x OR y", () => {
            expect(TwoSAT.entails(CNF.parse("x"), Clause.parse("x OR y"))).toBe(true);
        });
        it("x does not entail x AND y", () => {
            expect(TwoSAT.entails(CNF.parse("x"), CNF.parse("x AND y"))).toBe(false);
        });
        it("x AND (NOTx OR y) entails y", () => {
            expect(TwoSAT.entails(CNF.parse("x AND (NOTx OR y)"), Literal.parse("y"))).toBe(true);
        });
    });
});