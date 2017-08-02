import { IND } from "../../../src/algo/independentSet/IND";
import { IndependentSet } from "../../../src/algo/independentSet/IndependentSet";
import { Clause } from "../../../src/core/Clause";
import { Literal } from "../../../src/core/Literal";

describe("IND test suite", () => {
    describe("IND instantiation should be correct", () => {
        it("Invalid input should cause exception", () => {
            const sets = new Set<IndependentSet>([
                new IndependentSet(
                    new Set<Clause>([
                        new Clause([new Literal("x"), new Literal("y")]),
                        new Clause([new Literal("x"), new Literal("z", true)])
                    ])
                ),
                new IndependentSet(
                    new Set<Clause>([
                        new Clause([new Literal("x"), new Literal("y")]),
                        new Clause([new Literal("x"), new Literal("z")]),
                        new Clause([new Literal("w", true), new Literal("z")])
                    ])
                ),
            ]);

            expect(() => new IND(2, sets)).toThrowError();
        });
    });
});