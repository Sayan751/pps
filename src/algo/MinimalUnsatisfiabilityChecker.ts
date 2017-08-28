import { Clause } from "../core/Clause";
import { CNF } from "../core/CNF";
import { SATChecker } from "../core/SATChecker";
import { TwoSAT } from "./TwoSAT";
/**
 * Provides implementation for minimal satisfiability checker.
 * @export
 * @class MinimalUnsatisfiabilityChecker
 */
export class MinimalUnsatisfiabilityChecker {
    /**
     * Returns true if the input cnf is in MU.
     * A CNF is in MU, iff:
     *  1. the cnf is not in SAT, and
     *  2. every subset of clauses, excluding a different one each time are in SAT.
     * @static
     * @param {CNF} cnf
     * @param {SATChecker} [satChecker=TwoSAT]
     * @returns Returns true if the input cnf is in MU, else false.
     * @memberof MinimalUnsatisfiabilityChecker
     */
    public static isMinimallyUnsatisfiable(cnf: CNF, satChecker: SATChecker = TwoSAT) {
        if (!cnf) throw new Error("Input cnf is required");

        // check for trivial cases with deficiency
        const deficiency = cnf.clauses.length - cnf.variableSet.size;
        if (deficiency < 1) return false;
        if (cnf.isHorn() && deficiency !== 1) return false;

        // step 1: check if cnf is in SAT or not.
        if (satChecker.isSat(cnf)) return false;

        // step 2: every group of clauses excluding a different clause every time should be in SAT.
        return cnf.clauses.every(
            (clause: Clause, i: number, clauses: Clause[]) =>
                satChecker.isSat(new CNF([...clauses.slice(0, i), ...clauses.slice(i + 1)]))
        );
    }
}