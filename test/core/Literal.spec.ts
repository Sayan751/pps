import "jasmine";
import { Connectives } from "../../src/core/Constants";
import { Literal } from "../../src/core/Literal";

describe("Literal test suite", () => {

    describe("Class properties are defined", () => {
        it("Empty variable should cause error", () => {
            expect(() => new Literal("", undefined)).toThrowError();
        });

        it("Undefined isNegative should be treated as false", () => {
            const lit = new Literal("x", undefined);
            expect(lit.isNegative).toBe(false);
        });

        it("Variable should be valid", () => {
            const lit = new Literal("x", true);
            expect(lit.variable).toBeDefined();
            expect(lit.variable.length).toBeDefined();
            expect(lit.variable.length).toBe(1);
            expect(lit.variable).toBe("x");
            expect(lit.isNegative).toBe(true);
        });
    });

    describe("Literals must return proper string representation", () => {
        it("Negative literals must be prefixed with negation symbol", () => {
            const negLit = new Literal("x", true);
            const str = negLit.toString();
            expect(str).toBe(`${Connectives.not}x`);
        });

        it("Positive literals should be same as the variable", () => {
            const negLit = new Literal("x", false);
            const str = negLit.toString();
            expect(str).toBe("x");
        });
    });

    describe("literal strings should be correctly parsed", () => {
        it("The string 'x or y' should not be parsed to a Literal object", () => {
            expect(() => Literal.parse("x or y")).toThrowError(/literal/i);
        });
        it("The string 'x and y' should not be parsed to a Literal object", () => {
            expect(() => Literal.parse("x and y")).toThrowError(/literal/i);
        });
        it("The string 'x not' should not be parsed to a Literal object", () => {
            expect(() => Literal.parse("x not")).toThrowError(/literal/i);
        });
        it("The string 'x' should be correctly parsed to a Literal object", () => {
            const lit = Literal.parse("x");
            expect(lit).toBeDefined();
            expect(lit.isNegative).toBe(false);
            expect(lit.toString()).toBe("x");
        });
        it("The string 'notx' should be correctly parsed to a Literal object", () => {
            const lit = Literal.parse("notx");
            expect(lit).toBeDefined();
            expect(lit.isNegative).toBe(true);
            expect(lit.toString()).toBe(`${Connectives.not}x`);
        });
        it("The string 'NOTx' should be correctly parsed to a Literal object", () => {
            const lit = Literal.parse("NOTx");
            expect(lit).toBeDefined();
            expect(lit.isNegative).toBe(true);
            expect(lit.toString()).toBe(`${Connectives.not}x`);
        });
        it(`The string '${Connectives.not}x' should be correctly parsed to a Literal object`, () => {
            const lit = Literal.parse(`${Connectives.not}x`);
            expect(lit).toBeDefined();
            expect(lit.isNegative).toBe(true);
            expect(lit.toString()).toBe(`${Connectives.not}x`);
        });
        it("The string 'not x' should be correctly parsed to a Literal object", () => {
            const lit = Literal.parse("not x");
            expect(lit).toBeDefined();
            expect(lit.isNegative).toBe(true);
            expect(lit.toString()).toBe(`${Connectives.not}x`);
        });
        it("The string 'NOT x' should be correctly parsed to a Literal object", () => {
            const lit = Literal.parse("NOT x");
            expect(lit).toBeDefined();
            expect(lit.isNegative).toBe(true);
            expect(lit.toString()).toBe(`${Connectives.not}x`);
        });
        it(`The string '${Connectives.not} x' should be correctly parsed to a Literal object`, () => {
            const lit = Literal.parse(`${Connectives.not} x`);
            expect(lit).toBeDefined();
            expect(lit.isNegative).toBe(true);
            expect(lit.toString()).toBe(`${Connectives.not}x`);
        });
        it("The string '!x' should be correctly parsed to a Literal object", () => {
            const lit = Literal.parse("!x");
            expect(lit).toBeDefined();
            expect(lit.isNegative).toBe(true);
            expect(lit.toString()).toBe(`${Connectives.not}x`);
        });
    });

    describe("Satisfiability of Literal should be correctly determined for a given truth assignment", () => {
        it("x should be satisfiable for x=true", () => {
            const lit = new Literal("x");
            expect(lit.isSatForTruthAssignment(new Map<string, boolean>([["x", true]]))).toBe(true);
        });
        it("x should not be satisfiable for x=false", () => {
            const lit = new Literal("x");
            expect(lit.isSatForTruthAssignment(new Map<string, boolean>([["x", false]]))).toBe(false);
        });
        it("x should not be satisfiable if the given truth assignment does not provide a value for x", () => {
            const lit = new Literal("x");
            expect(lit.isSatForTruthAssignment(new Map<string, boolean>([["y", true]]))).toBe(false);
            expect(lit.isSatForTruthAssignment(new Map<string, boolean>())).toBe(false);
        });
        it("x should not be satisfiable if the given truth assignment is falsy", () => {
            const lit = new Literal("x");
            expect(lit.isSatForTruthAssignment(null)).toBe(false);
            expect(lit.isSatForTruthAssignment(undefined)).toBe(false);
        });
    });
});