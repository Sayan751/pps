import { NNF } from "./NNF";
/**
 * General interface for the entailment (logical consequence) checker algorithms.
 * Note that the entailment checker algorithms do not necessarily implement this interface.
 * This is more like to provide the duck typing.
 * @export
 * @interface EntailmentChecker
 */
export interface EntailmentChecker {
    /**
     * Returns true if alpha entails beta (alpha ⊨ beta).
     * @param {(NNF | string)} alpha
     * @param {(NNF | string)} beta
     * @returns {boolean} true if alpha entails beta (alpha ⊨ beta), else false.
     * @memberof EntailmentChecker
     */
    entails(alpha: NNF | string, beta: NNF | string): boolean;
}