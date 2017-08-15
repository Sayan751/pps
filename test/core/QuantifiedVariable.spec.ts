import { Quantifiers } from "../../src/core/Constants";
import { QuantifiedVariable } from "../../src/core/QuantifiedVariable";

describe("QuantifiedVariable test suite", () => {
    const ex = new QuantifiedVariable("x");
    const ux = new QuantifiedVariable("x", true);

    describe("Properties must be initialized on instantiation", () => {
        it("no variable should cause error", () => {
            expect(() => new QuantifiedVariable("")).toThrowError();
            expect(() => new QuantifiedVariable(undefined)).toThrowError();
            expect(() => new QuantifiedVariable(null)).toThrowError();
        });
        it("valid input should not cause error", () => {
            expect(ex.variable).toBe("x");
            expect(ex.isUniversal).toBe(false);
            expect(ux.variable).toBe("x");
            expect(ux.isUniversal).toBe(true);
        });
    });
    describe("string representation should be correct", () => {
        it("universal variable should be correctly translated to string", () => {
            expect(ux.toString()).toBe(`${Quantifiers.universal}x`);
        });
        it("existential variable should be correctly translated to string", () => {
            expect(ex.toString()).toBe(`${Quantifiers.existential}x`);
        });
    });
});