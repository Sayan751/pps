import { Literal } from "../../src/core/Literal";
import "jasmine";

describe("Literal test suite", () => {

    describe("Class properties are defined", () => {
        it("Empty variable should cause error", () => {
            expect(() => new Literal("", undefined)).toThrowError();
        })

        it("Undefined isNegative should be treated as false", () => {
            const lit = new Literal("x", undefined);
            expect(lit.isNegative).toBe(false);
        })

        it("Variable should be valid", () => {
            const lit = new Literal("x", true);
            expect(lit.variable).toBeDefined();
            expect(lit.variable.length).toBeDefined();
            expect(lit.variable.length).toBe(1);
            expect(lit.variable).toBe("x");
            expect(lit.isNegative).toBe(true);
        })
    })

    describe("Literals must return proper string representation", () => {
        it("Negative literals must be prefixed with negation symbol", () => {
            const negLit = new Literal("x", true);
            const str = negLit.toString();
            expect(str).toBe('\u00ACx');
        })

        it("Positive literals should be same as the variable", () => {
            const negLit = new Literal("x", false);
            const str = negLit.toString();
            expect(str).toBe('x');
        })
    })
});