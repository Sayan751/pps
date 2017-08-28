import { MinimalUnsatisfiabilityChecker } from "../../src/algo/MinimalUnsatisfiabilityChecker";
import { CNF } from "../../src/core/CNF";

describe("MinimalUnsatisfiabilityChecker test suite", () => {
    it("cnf input is required for isMinimallyUnsatisfiable", () => {
        expect(() => MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable()).toThrowError();
    });
    it("(x) is not in MU", () => {
        const x = CNF.parse("x");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(x)).toBe(false);
    });
    it("(x) AND (NOTx) AND (y) is not in MU", () => {
        const cnf = CNF.parse("(x) AND (NOTx) AND (y)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf)).toBe(false);
    });
    it("(x OR NOTy) AND (NOTx OR NOTy) AND (y) is in MU", () => {
        const cnf = CNF.parse("(x OR NOTy) AND (NOTx OR NOTy) AND (y)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf)).toBe(true);
    });
    it("(NOTa OR b) AND (NOTa OR NOTb or c) AND (NOTc or NOTa) AND (a) AND (b) is not in MU", () => {
        const cnf = CNF.parse("(NOTa OR b) AND (NOTa OR NOTb or c) AND (NOTc OR NOTa) AND (a) AND (b)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf)).toBe(false);
    });
    it("(x OR y) AND (a OR NOTb) AND (a OR NOTy) is not in MU", () => {
        const cnf = CNF.parse("(x OR y) AND (a OR NOTb) AND (a OR NOTy)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf)).toBe(false);
    });
});