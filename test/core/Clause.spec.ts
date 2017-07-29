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
        it("Valid disjunctive clause should be created", () => {
            const clause = new Clause([new Literal("x"), new Literal("x", true)]);
            expect(clause).toBeDefined();
            expect(clause.literals).toBeDefined();
            expect(clause.literals.length).toBe(2);
            expect(clause.variableSet).toBeDefined();
            expect(clause.numVariables).toBeDefined();
            expect(clause.connective).toBe(Connectives.or);
            expect(clause.isDisjunctive).toBe(true);
        });
        it("Valid conjunctive clause should be created", () => {
            const clause = new Clause([new Literal("x"), new Literal("x", true)], Connectives.and);
            expect(clause).toBeDefined();
            expect(clause.literals).toBeDefined();
            expect(clause.literals.length).toBe(2);
            expect(clause.variableSet).toBeDefined();
            expect(clause.numVariables).toBeDefined();
            expect(clause.connective).toBe(Connectives.and);
            expect(clause.isDisjunctive).toBe(false);
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
        it("isHornClause should return false for conjunctive clause", () => {
            expect(new Clause([new Literal("x"), new Literal("y", true)], Connectives.and).isHorn()).toBe(false);
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

        it(`(x AND y) should be represented as (x ${Connectives.and} y)`, () => {
            expect(new Clause([new Literal("x"), new Literal("y")], Connectives.and).toString()).toBe(`(x ${Connectives.and} y)`);
        });

        it(`(NOT x OR NOT y) should be represented as (${Connectives.not}x ${Connectives.or} ${Connectives.not}y)`, () => {
            expect(new Clause([new Literal("x", true), new Literal("y", true)]).toString())
                .toBe(`(${Connectives.not}x ${Connectives.or} ${Connectives.not}y)`);
        });
    });

    describe("clause strings should be correctly parsed", () => {

        it("The string 'a and b' should be parsed to a conjunctive Clause object", () => {
            const conjctClause = Clause.parse("a and b");
            expect(conjctClause).toBeDefined();
            expect(conjctClause.isDisjunctive).toBe(false);
        });
        it("The string 'a AND b' should be parsed to a conjunctive Clause object", () => {
            const conjctClause = Clause.parse("a AND b");
            expect(conjctClause).toBeDefined();
            expect(conjctClause.isDisjunctive).toBe(false);
        });
        it(`The string 'a ${Connectives.and} b' be parsed to a conjunctive Clause object`, () => {
            const conjctClause = Clause.parse(`a ${Connectives.and} b`);
            expect(conjctClause).toBeDefined();
            expect(conjctClause.isDisjunctive).toBe(false);
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

    describe("Satisfiability of clause should be correctly determined for a given truth assignment", () => {
        it("x should be satisfiable for x=true", () => {
            const clause = new Clause([new Literal("x")]);
            expect(clause.isSatForTruthAssignment(new Map<string, boolean>([["x", true]]))).toBe(true);
        });
        it("x should not be satisfiable for x=false", () => {
            const clause = new Clause([new Literal("x")]);
            expect(clause.isSatForTruthAssignment(new Map<string, boolean>([["x", false]]))).toBe(false);
        });
        it("x or notx should be satisfiable for x=true", () => {
            const clause = new Clause([new Literal("x"), new Literal("x", true)]);
            expect(clause.isSatForTruthAssignment(new Map<string, boolean>([["x", true]]))).toBe(true);
        });
        it("x or notx should be satisfiable for x=false", () => {
            const clause = new Clause([new Literal("x"), new Literal("x", true)]);
            expect(clause.isSatForTruthAssignment(new Map<string, boolean>([["x", false]]))).toBe(true);
        });
        it("x and notx should not be satisfiable for x=true", () => {
            const clause = new Clause([new Literal("x"), new Literal("x", true)], Connectives.and);
            expect(clause.isSatForTruthAssignment(new Map<string, boolean>([["x", true]]))).toBe(false);
        });
        it("x and notx should not be satisfiable for x=false", () => {
            const clause = new Clause([new Literal("x"), new Literal("x", true)], Connectives.and);
            expect(clause.isSatForTruthAssignment(new Map<string, boolean>([["x", false]]))).toBe(false);
        });
    });
});