import "babel-polyfill"
import { Literal } from "../../src/core/Literal";
import { Clause } from "../../src/core/Clause";
import { CNF } from "../../src/core/CNF";

describe("CNF test suite", () => {

    describe("Properties must be initialized on instantiation", () => {
        it("Empty CNF is possible", () => {
            const emptyCnf = new CNF([]);
            expect(emptyCnf).toBeDefined();
            expect(emptyCnf.clauses).toBeDefined();
            expect(emptyCnf.isEmpty()).toBe(true);

            const emptyCnf1 = new CNF([new Clause([]), new Clause([])]);
            expect(emptyCnf1).toBeDefined();
            expect(emptyCnf1.clauses).toBeDefined();
            expect(emptyCnf1.isEmpty()).toBe(true);
        });

        it("Instantiation with non-empty set of clauses sets up other properties correctly", () => {
            const cnf = new CNF([
                new Clause([new Literal("z", true), new Literal("y")]),
                new Clause([new Literal("x"), new Literal("x", true)]),
                new Clause([new Literal("z"), new Literal("x")])
            ]);
            expect(cnf).toBeDefined();
            expect(cnf.clauses).toBeDefined();
            expect(cnf.variableSet).toBeDefined();
            expect(cnf.numVariables).toBe(3);
            expect(cnf.isEmpty()).toBe(false);
        });
    });

    describe("CNF must have proper string representation", () => {
        it("empty CNF should represented as \u2294", () => {
            expect(new CNF([]).toString()).toBe('\u2294');
        });

        it("(z OR y) AND (z OR NOT x) should be represented as (z \u2228 y) \u2227 (z \u2228 \u00ACx)", () => {
            expect(
                new CNF([
                    new Clause([new Literal("z"), new Literal("y")]),
                    new Clause([new Literal("z"), new Literal("x", true)])
                ]).toString())
                .toBe('(z \u2228 y) \u2227 (z \u2228 \u00ACx)');
        });
    });
});