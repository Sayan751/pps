import { Clause } from "../../src/core/Clause";
import { Literal } from "../../src/core/Literal";
import { IndependentSet } from "../../src/independentSet/IndependentSet";

describe("IndependentSet test suite", () => {

    describe("IndependentSet instantiation should be correct", () => {

        it("Input clauses with complimentary pair of literals should cause exception", () => {
            expect(() => new IndependentSet(
                new Set<Clause>([
                    new Clause([new Literal("x"), new Literal("y")]),
                    new Clause([new Literal("x", true), new Literal("z")])
                ]))).toThrowError();
        });

        it("Input clauses with non-complimentary pair of literals should not cause exception", () => {
            expect(() => new IndependentSet(
                new Set<Clause>([
                    new Clause([new Literal("x"), new Literal("y")]),
                    new Clause([new Literal("x"), new Literal("z", true)])
                ]))).toBeDefined();
        });
    });
});