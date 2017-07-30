import { Connectives } from "../../src/core/Constants";
import { Implication } from "../../src/core/Implication";
import { Literal } from "../../src/core/Literal";

describe("Implication test suite", () => {
    describe("Instantiation should be correct", () => {
        it("Invalid argument should cause error", () => {
            expect(() => new Implication(undefined, undefined)).toThrowError();
            expect(() => new Implication(null, null)).toThrowError();
        });
        it("Invalid consequence should cause error", () => {
            expect(() => new Implication(new Literal("x"), undefined)).toThrowError();
            expect(() => new Implication(new Literal("x"), null)).toThrowError();
        });
        it("Invalid premise should cause error", () => {
            expect(() => new Implication(undefined, new Literal("x"))).toThrowError();
            expect(() => new Implication(null, new Literal("x"))).toThrowError();
        });
        it("Valid premise should not cause error", () => {
            const implication = new Implication(new Literal("x"), new Literal("x"));
            expect(implication).toBeDefined();
            expect(implication.toString()).toBe(`(x ${Connectives.implication} x)`);
        });
    });
    describe("Implication reversal should be correct", () => {
        it("x -> y should be reversed to NOTy -> NOTx", () => {
            const implication = new Implication(new Literal("x"), new Literal("y"));
            const reverseImplication = implication.reverse();
            expect(reverseImplication).toBeDefined();
            expect(reverseImplication.toString()).toBe(`(${Connectives.not}y ${Connectives.implication} ${Connectives.not}x)`);
        });
        it("NOTy -> NOTx should be reversed to x -> y", () => {
            const implication = new Implication(new Literal("y", true), new Literal("x", true));
            const reverseImplication = implication.reverse();
            expect(reverseImplication).toBeDefined();
            expect(reverseImplication.toString()).toBe(`(x ${Connectives.implication} y)`);
        });
        it("NOTx -> y should be reversed to NOTy -> x", () => {
            const implication = new Implication(new Literal("x", true), new Literal("y"));
            const reverseImplication = implication.reverse();
            expect(reverseImplication).toBeDefined();
            expect(reverseImplication.toString()).toBe(`(${Connectives.not}y ${Connectives.implication} x)`);
        });
        it("x -> NOTy should be reversed to y -> NOTx", () => {
            const implication = new Implication(new Literal("x"), new Literal("y", true));
            const reverseImplication = implication.reverse();
            expect(reverseImplication).toBeDefined();
            expect(reverseImplication.toString()).toBe(`(y ${Connectives.implication} ${Connectives.not}x)`);
        });
    });
    describe("Implication should be converted to clause correctly", () => {
        it(`x -> x should be converted to (${Connectives.not}x ${Connectives.or} x)`, () => {
            expect(new Implication(new Literal("x"), new Literal("x")).toClause().toString()).toBe(`(${Connectives.not}x ${Connectives.or} x)`);
        });
        it(`NOTx -> x should be converted to (x ${Connectives.or} x)`, () => {
            expect(new Implication(new Literal("x", true), new Literal("x")).toClause().toString()).toBe(`(x ${Connectives.or} x)`);
        });
    });
});