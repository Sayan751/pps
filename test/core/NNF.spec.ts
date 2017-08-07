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
});