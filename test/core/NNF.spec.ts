import { Connectives } from "../../src/core/Constants";
import { Literal } from "../../src/core/Literal";
import { NNF } from "../../src/core/NNF";

describe("NNF test suite", () => {
    describe("NNF object should be correctly constructed", () => {
        it("multiple item in a group without connective should throw error", () => {
            expect(() => new NNF([new Literal("x"), new Literal("y")])).toThrowError();
        });
        it("The literal x should be in NNF", () => {
            const nnf = new NNF([new Literal("x")]);
            expect(nnf).toBeDefined();
            expect(nnf.variableSet.size).toBe(1);
        });
        it(`The literal ${Connectives.not}x should be in NNF`, () => {
            const nnf = new NNF([new Literal("x", true)]);
            expect(nnf).toBeDefined();
            expect(nnf.variableSet.size).toBe(1);
        });
        it(`The literals x,${Connectives.not}x connected by OR should be in NNF`, () => {
            const nnf = new NNF([new Literal("x"), new Literal("x", true)], Connectives.or);
            expect(nnf).toBeDefined();
            expect(nnf.variableSet.size).toBe(1);
        });
        it(`The literals x,y connected by OR should be in NNF`, () => {
            const nnf = new NNF([new Literal("x"), new Literal("y")], Connectives.or);
            expect(nnf).toBeDefined();
            expect(nnf.variableSet.size).toBe(2);
        });
        it(`The literals x,y connected by AND should be in NNF`, () => {
            const nnf = new NNF([new Literal("x"), new Literal("y")], Connectives.and);
            expect(nnf).toBeDefined();
            expect(nnf.variableSet.size).toBe(2);
        });
        it(`The groups ([x,y], AND), ([a,b], OR) connected by AND should be in NNF`, () => {
            const nnf = new NNF([
                new NNF([new Literal("x"), new Literal("y")], Connectives.and),
                new NNF([new Literal("a"), new Literal("b")], Connectives.and)
            ], Connectives.and);
            expect(nnf).toBeDefined();
            expect(nnf.variableSet.size).toBe(4);
        });
        it(`The groups ([x,y], AND), ([a,b], OR) without any connective should cause error`, () => {
            expect(() => new NNF([
                new NNF([new Literal("x"), new Literal("y")], Connectives.and),
                new NNF([new Literal("a"), new Literal("b")], Connectives.or)
            ])).toThrowError();
        });
    });

    describe("String representation of NNF object should be correct", () => {
        it("The literal x should be (x) in string representation", () => {
            const nnf = new NNF([new Literal("x")]);
            expect(nnf.toString()).toBe(`(x)`);
        });
        it(`The literal ${Connectives.not}x should be (${Connectives.not}x) in string representation`, () => {
            const nnf = new NNF([new Literal("x", true)]);
            expect(nnf.toString()).toBe(`(${Connectives.not}x)`);
        });
        it(`The literals x,y connected by OR should be (x ${Connectives.or} y) in string representation`, () => {
            const nnf = new NNF([new Literal("x"), new Literal("y")], Connectives.or);
            expect(nnf.toString()).toBe(`(x ${Connectives.or} y)`);
        });
        it(`The literals x,y connected by AND should be (x ${Connectives.and} y) in string representation`, () => {
            const nnf = new NNF([new Literal("x"), new Literal("y")], Connectives.and);
            expect(nnf.toString()).toBe(`(x ${Connectives.and} y)`);
        });
        it(`The groups ([x,y], AND), ([a,b], OR) connected by AND should be should be ((x ${Connectives.and} y) ${Connectives.and} (a ${Connectives.or} b)) in string representation`, () => {
            const nnf = new NNF([
                new NNF([new Literal("x"), new Literal("y")], Connectives.and),
                new NNF([new Literal("a"), new Literal("b")], Connectives.or)
            ], Connectives.and);
            expect(nnf.toString()).toBe(`((x ${Connectives.and} y) ${Connectives.and} (a ${Connectives.or} b))`);
        });
    });

    describe("Satisfiability of NNF object should be correctly determined", () => {
        let nnf1: NNF;
        let nnf2: NNF;
        let nnfx: NNF;
        let nnfnotx: NNF;

        beforeEach(() => {
            nnf1 = new NNF([
                new NNF([new Literal("x"), new Literal("y")], Connectives.and),
                new NNF([new Literal("a"), new Literal("b")], Connectives.or)
            ], Connectives.and);
            nnf2 = new NNF([
                new NNF([new Literal("x"), new Literal("y")], Connectives.and),
                new NNF([new Literal("a"), new Literal("b")], Connectives.or)
            ], Connectives.or);
            nnfx = new NNF([new Literal("x")]);
            nnfnotx = new NNF([new Literal("x", true)]);
        });
        it(`((x AND y) AND (a OR b)) is satisfiable for x=T, y=T, a=T, and b=F`, () => {
            const truthAssignment = new Map<string, boolean>([["x", true], ["y", true], ["a", true], ["b", false]]);
            expect(nnf1.isSatForTruthAssignment(truthAssignment)).toBe(true);
        });
        it(`((x AND y) AND (a OR b)) is satisfiable for x=T, y=T, a=F, and b=T`, () => {
            const truthAssignment = new Map<string, boolean>([["x", true], ["y", true], ["a", false], ["b", true]]);
            expect(nnf1.isSatForTruthAssignment(truthAssignment)).toBe(true);
        });
        it(`((x AND y) AND (a OR b)) is not satisfiable for x=F, y=T, a=T, and b=F`, () => {
            const truthAssignment = new Map<string, boolean>([["x", false], ["y", true], ["a", true], ["b", false]]);
            expect(nnf1.isSatForTruthAssignment(truthAssignment)).toBe(false);
        });
        it(`((x AND y) AND (a OR b)) is not satisfiable for x=T, y=T, a=F, and b=F`, () => {
            const truthAssignment = new Map<string, boolean>([["x", true], ["y", true], ["a", false], ["b", false]]);
            expect(nnf1.isSatForTruthAssignment(truthAssignment)).toBe(false);
        });
        it(`((x AND y) OR (a OR b)) is satisfiable for x=F, y=T, a=T, and b=F`, () => {
            const truthAssignment = new Map<string, boolean>([["x", false], ["y", true], ["a", true], ["b", false]]);
            expect(nnf2.isSatForTruthAssignment(truthAssignment)).toBe(true);
        });
        it(`(x) is satisfiable for x=T`, () => {
            const truthAssignment = new Map<string, boolean>([["x", true]]);
            expect(nnfx.isSatForTruthAssignment(truthAssignment)).toBe(true);
        });
        it(`(x) is not satisfiable for x=F`, () => {
            const truthAssignment = new Map<string, boolean>([["x", false]]);
            expect(nnfx.isSatForTruthAssignment(truthAssignment)).toBe(false);
        });
        it(`(NOTx) is not satisfiable for x=T`, () => {
            const truthAssignment = new Map<string, boolean>([["x", true]]);
            expect(nnfnotx.isSatForTruthAssignment(truthAssignment)).toBe(false);
        });
        it(`(NOTx) is satisfiable for x=F`, () => {
            const truthAssignment = new Map<string, boolean>([["x", false]]);
            expect(nnfnotx.isSatForTruthAssignment(truthAssignment)).toBe(true);
        });
    });
});