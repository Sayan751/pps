import "babel-polyfill";
import { Clause } from "../../src/core/Clause";
import { Connectives, Symbols } from "../../src/core/Constants";
import { Literal } from "../../src/core/Literal";

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
        });
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
            // fact
            expect(new Clause([new Literal("x")]).isHorn()).toBe(true);

            // implication
            expect(new Clause([new Literal("x"), new Literal("x", true)]).isHorn()).toBe(true);

            // negative clause
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
        it(`empty clause should represented as ${Symbols.empty}`, () => {
            expect(new Clause([]).toString()).toBe(Symbols.empty);
        });

        it(`(x OR y) should be represented as (x ${Connectives.or} y)`, () => {
            expect(new Clause([new Literal("x"), new Literal("y")]).toString()).toBe(`(x ${Connectives.or} y)`);
        });

        it(`(NOT x OR NOT y) should be represented as (${Connectives.not}x ${Connectives.or} ${Connectives.not}y)`, () => {
            expect(new Clause([new Literal("x", true), new Literal("y", true)]).toString())
                .toBe(`(${Connectives.not}x ${Connectives.or} ${Connectives.not}y)`);
        });
    });

    describe("clause strings should be correctly parsed", () => {

        it("The string 'a and b' should not be parsed to a Clause object", () => {
            expect(() => Clause.parse("a and b")).toThrowError(/clause/i);
        });
        it("The string 'a AND b' should not be parsed to a Clause object", () => {
            expect(() => Clause.parse("a AND b")).toThrowError(/clause/i);
        });
        it(`The string 'a ${Connectives.and} b' should not be parsed to a Clause object`, () => {
            expect(() => Clause.parse(`a ${Connectives.and} b`)).toThrowError(/clause/i);
        });
        it("The string 'a or b' should be correctly parsed to a Clause object", () => {
            const clause = Clause.parse("a or b");
            expect(clause).toBeDefined();
            expect(clause.toString()).toBe(`(a ${Connectives.or} b)`);
        });
        it("The string 'a OR b' should be correctly parsed to a Clause object", () => {
            const clause = Clause.parse("a OR b");
            expect(clause).toBeDefined();
            expect(clause.toString()).toBe(`(a ${Connectives.or} b)`);
        });
        it(`The string a ${Connectives.or} b should be correctly parsed to a Clause object`, () => {
            const clause = Clause.parse(`a ${Connectives.or} b`);
            expect(clause).toBeDefined();
            expect(clause.toString()).toBe(`(a ${Connectives.or} b)`);
        });
        it("The string '( a or b)' should be correctly parsed to a Clause object", () => {
            const clause = Clause.parse("( a or b)");
            expect(clause).toBeDefined();
            expect(clause.toString()).toBe(`(a ${Connectives.or} b)`);
        });
        it("The string '(a OR  b)' should be correctly parsed to a Clause object", () => {
            const clause = Clause.parse("(a OR  b)");
            expect(clause).toBeDefined();
            expect(clause.toString()).toBe(`(a ${Connectives.or} b)`);
        });
        it(`The string ( a  ${Connectives.or}  b ) should be correctly parsed to a Clause object`, () => {
            const clause = Clause.parse(`( a  ${Connectives.or}  b )`);
            expect(clause).toBeDefined();
            expect(clause.toString()).toBe(`(a ${Connectives.or} b)`);
        });
        it("The string 'a || b' should be correctly parsed to a Clause object", () => {
            const clause = Clause.parse("a || b");
            expect(clause).toBeDefined();
            expect(clause.toString()).toBe(`(a ${Connectives.or} b)`);
        });
    });
});