import { CNF } from "./CNF";
/**
 * General interface for the SAT checker algorithms.
 * Note that the SAT checker algorithms do not necessarily implement this interface.
 * This is more like to provide the duck typing.
 * @export
 * @interface SATChecker
 */
export interface SATChecker {
    /**
     * Returns true if the input cnf is satisfiable, else it returns false.
     *
     * @static
     * @param {CNF} cnf input cnf formula
     * @returns {boolean} true if the input cnf is satisfiable, else false.
     * @memberof SATChecker
     */
    isSat(cnf: CNF | string): boolean;
}