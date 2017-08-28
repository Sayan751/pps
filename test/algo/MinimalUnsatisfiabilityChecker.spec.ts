import { IndependentSet } from "../../src/algo/independentSet/IndependentSet";
import { MinimalUnsatisfiabilityChecker } from "../../src/algo/MinimalUnsatisfiabilityChecker";
import { TruthTable } from "../../src/algo/TruthTable";
import { CNF } from "../../src/core/CNF";

describe("MinimalUnsatisfiabilityChecker test suite", () => {
    it("cnf input is required for isMinimallyUnsatisfiable", () => {
        expect(() => MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable()).toThrowError();
    });
    it("(x) is not in MU (using default SAT checker)", () => {
        const x = CNF.parse("x");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(x)).toBe(false);
    });
    it("(x OR y) AND (NOTx OR y) AND (x OR NOTy) is not in MU (using default SAT checker)", () => {
        const cnf = CNF.parse("(x OR y) AND (NOTx OR y) AND (x OR NOTy)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf)).toBe(false);
    });
    it("(x) AND (NOTx) AND (y) is not in MU (using default SAT checker)", () => {
        const cnf = CNF.parse("(x) AND (NOTx) AND (y)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf)).toBe(false);
    });
    it("(x OR NOTy) AND (NOTx OR NOTy) AND (y) is in MU (using default SAT checker)", () => {
        const cnf = CNF.parse("(x OR NOTy) AND (NOTx OR NOTy) AND (y)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf)).toBe(true);
    });
    it("(NOTa OR b) AND (NOTa OR NOTb or c) AND (NOTc or NOTa) AND (a) AND (b) is not in MU (using default SAT checker)", () => {
        const cnf = CNF.parse("(NOTa OR b) AND (NOTa OR NOTb or c) AND (NOTc OR NOTa) AND (a) AND (b)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf)).toBe(false);
    });
    it("(x OR y) AND (a OR NOTb) AND (a OR NOTy) is not in MU (using default SAT checker)", () => {
        const cnf = CNF.parse("(x OR y) AND (a OR NOTb) AND (a OR NOTy)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf)).toBe(false);
    });
    it("(x) is not in MU (using independent set)", () => {
        const x = CNF.parse("x");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(x, IndependentSet)).toBe(false);
    });
    it("(x) AND (NOTx) AND (y) is not in MU (using independent set)", () => {
        const cnf = CNF.parse("(x) AND (NOTx) AND (y)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf, IndependentSet)).toBe(false);
    });
    it("(x OR NOTy) AND (NOTx OR NOTy) AND (y) is in MU (using independent set)", () => {
        const cnf = CNF.parse("(x OR NOTy) AND (NOTx OR NOTy) AND (y)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf, IndependentSet)).toBe(true);
    });
    it("(NOTa OR b) AND (NOTa OR NOTb or c) AND (NOTc or NOTa) AND (a) AND (b) is not in MU (using independent set)", () => {
        const cnf = CNF.parse("(NOTa OR b) AND (NOTa OR NOTb or c) AND (NOTc OR NOTa) AND (a) AND (b)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf, IndependentSet)).toBe(false);
    });
    it("(x OR y) AND (a OR NOTb) AND (a OR NOTy) is not in MU (using independent set)", () => {
        const cnf = CNF.parse("(x OR y) AND (a OR NOTb) AND (a OR NOTy)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf, IndependentSet)).toBe(false);
    });
    it("(x) is not in MU (using truth table)", () => {
        const x = CNF.parse("x");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(x, TruthTable)).toBe(false);
    });
    it("(x) AND (NOTx) AND (y) is not in MU (using truth table)", () => {
        const cnf = CNF.parse("(x) AND (NOTx) AND (y)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf, TruthTable)).toBe(false);
    });
    it("(x OR NOTy) AND (NOTx OR NOTy) AND (y) is in MU (using truth table)", () => {
        const cnf = CNF.parse("(x OR NOTy) AND (NOTx OR NOTy) AND (y)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf, TruthTable)).toBe(true);
    });
    it("(NOTa OR b) AND (NOTa OR NOTb or c) AND (NOTc or NOTa) AND (a) AND (b) is not in MU (using independent set)", () => {
        const cnf = CNF.parse("(NOTa OR b) AND (NOTa OR NOTb or c) AND (NOTc OR NOTa) AND (a) AND (b)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf, TruthTable)).toBe(false);
    });
    it("(x OR y) AND (a OR NOTb) AND (a OR NOTy) is not in MU (using truth table)", () => {
        const cnf = CNF.parse("(x OR y) AND (a OR NOTb) AND (a OR NOTy)");
        expect(MinimalUnsatisfiabilityChecker.isMinimallyUnsatisfiable(cnf, TruthTable)).toBe(false);
    });
});