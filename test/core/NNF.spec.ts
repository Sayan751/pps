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
        });
        it(`The literal ${Connectives.not}x should be in NNF`, () => {
            const nnf = new NNF([new Literal("x", true)]);
            expect(nnf).toBeDefined();
        });
        it(`The literals x,y connected by OR should be in NNF`, () => {
            const nnf = new NNF([new Literal("x"), new Literal("y")], Connectives.or);
            expect(nnf).toBeDefined();
        });
        it(`The literals x,y connected by AND should be in NNF`, () => {
            const nnf = new NNF([new Literal("x"), new Literal("y")], Connectives.and);
            expect(nnf).toBeDefined();
        });
        it(`The groups ([x,y], AND), ([a,b], OR) connected by AND should be in NNF`, () => {
            const nnf = new NNF([
                new NNF([new Literal("x"), new Literal("y")], Connectives.and),
                new NNF([new Literal("a"), new Literal("b")], Connectives.and)
            ], Connectives.and);
            expect(nnf).toBeDefined();
        });
        it(`The groups ([x,y], AND), ([a,b], OR) without any connective should cause error`, () => {
            expect(() => new NNF([
                new NNF([new Literal("x"), new Literal("y")], Connectives.and),
                new NNF([new Literal("a"), new Literal("b")], Connectives.and)
            ])).toThrowError();
        });
    });
});