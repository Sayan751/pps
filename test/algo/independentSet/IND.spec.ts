import { IND } from "../../../src/algo/independentSet/IND";
import { IndSet } from "../../../src/algo/independentSet/IndSet";
import { Clause } from "../../../src/core/Clause";
import { Literal } from "../../../src/core/Literal";

describe("IND test suite", () => {
    describe("IND instantiation should be correct", () => {
        it("Invalid input should cause exception", () => {
            const sets = new Set<IndSet>([
                new IndSet(
                    new Set<Clause>([
                        new Clause([new Literal("x"), new Literal("y")]),
                        new Clause([new Literal("x"), new Literal("z", true)])
                    ])
                ),
                new IndSet(
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