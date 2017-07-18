import "babel-polyfill"
import { Literal } from "../../src/core/Literal";
import { Clause } from "../../src/core/Clause";

describe("Clause test suite", () => {

    describe("Properties should be initialized properly", () => {

        it("Empty clause is possible", () => {
            const emptyClause = new Clause([]);
            expect(emptyClause).toBeDefined();
        });

        it("Valid values should not cause exception", () => {
            const clause = new Clause([new Literal("x"), new Literal("x", true)]);
            expect(clause).toBeDefined();
            expect(clause.literals).toBeDefined();
            expect(clause.literals.length).toBe(2);
            expect(clause.variableSet).toBeDefined();
            expect(clause.numVariables).toBeDefined();
        });

        it("Set of variable contains right number of variables", () => {
            expect(new Clause([new Literal("x")]).numVariables).toBe(1);
            expect(new Clause([new Literal("x"), new Literal("x", true)]).numVariables).toBe(1);
            expect(new Clause([new Literal("x"), new Literal("y", true)]).numVariables).toBe(2);
            expect(new Clause([new Literal("x"), new Literal("y"), new Literal("z")]).numVariables).toBe(3);
        })
    });

    describe("Aspects of the clause should be correctly projected", () => {
        it("isUnitClause should return true for unit clause", () => {
            expect(new Clause([new Literal("x")]).isUnit()).toBe(true);
            expect(new Clause([new Literal("x", true)]).isUnit()).toBe(true);
        });
        it("isUnitClause should return false for non-unit clause", () => {
            expect(new Clause([new Literal("x"), new Literal("x", true)]).isUnit()).toBe(false);
        });

        it("isPositiveUnitClause should return true for positive unit clause", () => {
            expect(new Clause([new Literal("x")]).isPositiveUnit()).toBe(true);
        });
        it("isPositiveUnitClause should return false for negative unit clause", () => {
            expect(new Clause([new Literal("x", true)]).isPositiveUnit()).toBe(false);
        });
        it("isPositiveUnitClause should return false for non-unit clause", () => {
            expect(new Clause([new Literal("x"), new Literal("x", true)]).isPositiveUnit()).toBe(false);
        });

        it("isHornClause should return true for Horn clause", () => {
            //fact
            expect(new Clause([new Literal("x")]).isHorn()).toBe(true);

            //implication
            expect(new Clause([new Literal("x"), new Literal("x", true)]).isHorn()).toBe(true);

            //negative clause
            expect(new Clause([new Literal("x", true)]).isHorn()).toBe(true);
            expect(new Clause([new Literal("x", true), new Literal("y", true)]).isHorn()).toBe(true);
        });
        it("isHornClause should return false for non-Horn clause", () => {
            expect(new Clause([new Literal("x"), new Literal("y")]).isHorn()).toBe(false);
        });

        it("isEmptyClause should return true for empty clause", () => {
            expect(new Clause([]).isEmpty()).toBe(true);
        });
        it("isEmptyClause should return false for non-empty clause", () => {
            expect(new Clause([new Literal("x")]).isEmpty()).toBe(false);
        });
    });

    describe("Clauses must have proper string representation", () => {
        it("empty clause should represented as \u2294", () => {
            expect(new Clause([]).toString()).toBe('\u2294');
        });

        it("(x OR y) should be represented as (x \u2228 y)", () => {
            expect(new Clause([new Literal("x"), new Literal("y")]).toString()).toBe('(x \u2228 y)');
        });

        it("(NOT x OR NOT y) should be represented as (\u00ACx \u2228 \u00ACy)", () => {
            expect(new Clause([new Literal("x", true), new Literal("y", true)]).toString()).toBe('(\u00ACx \u2228 \u00ACy)');
        });
    });
});