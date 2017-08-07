import { Formula } from "./Formula";
/**
 * General interface for the equivalence checker algorithms.
 * Note that the equivalence checker algorithms do not necessarily implement this interface.
 * This is more like to provide the duck typing.
 * @export
 * @interface EquivalenceChecker
 */
export interface EquivalenceChecker {
    /**
     * Returns true if alpha ≈ beta.
     * @param {(Formula)} alpha
     * @param {(Formula)} beta
     * @returns {boolean} true if alpha ≈ beta, else false.
     * @memberof EntailmentChecker
     */
    isEquivalent(alpha: Formula, beta: Formula): boolean;
}