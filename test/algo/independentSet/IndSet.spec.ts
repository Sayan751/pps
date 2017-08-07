import { IndSet } from "../../../src/algo/independentSet/IndSet";
import { Clause } from "../../../src/core/Clause";
import { Literal } from "../../../src/core/Literal";

describe("IndSet test suite", () => {

    describe("IndependentSet instantiation should be correct", () => {

        it("Input clauses with complimentary pair of literals should cause exception", () => {
            expect(() => new IndSet(
                new Set<Clause>([
                    new Clause([new Literal("x"), new Literal("y")]),
                    new Clause([new Literal("x", true), new Literal("z")])
                ]))).toThrowError();
        });

        it("Input clauses with non-complimentary pair of literals should not cause exception", () => {
            expect(() => new IndSet(
                new Set<Clause>([
                    new Clause([new Literal("x"), new Literal("y")]),
                    new Clause([new Literal("x"), new Literal("z", true)])
                ]))).toBeDefined();
        });

        it("Valid input should initialize the properties correctly", () => {
            const indSet = new IndSet(
                new Set<Clause>([
                    new Clause([new Literal("x"), new Literal("y")]),
                    new Clause([new Literal("x"), new Literal("z", true)])
                ]));
            expect(indSet).toBeDefined();
            expect(indSet.size).toBe(2);
            expect(indSet.SIZE(3)).toBe(1);
            expect(indSet.SIZE(4)).toBe(2);
        });
    });
});