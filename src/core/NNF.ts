/*
NNF schema:
    1. Negation symbol in front of variable is only allowed.
    2. A group of literal connected with connectives is in NNF.
        2.1. A clause can be a group (clause can be both disjunctive and conjunctive)
        2.2. A group is a collection of clause and literals.
        2.3. Every group has homogeneous connective.
             Every group needs to be formed as per boolean binding rule.
    3. A literal is in NNF.
    4. A NNF can either be a literal or a group (as describe above).
*/
import { CNF } from "./CNF";
export class NNF {

    /**
     * Parses the given string to equivalent NNF.
     * Throws error if the input string is invalid.
     * @static
     * @param {string} str input string.
     * @returns {(NNF | undefined)} Equivalent NNF.
     * @memberof NNF
     */
    // public static parse(str: string): NNF | undefined {
    //     return undefined;
    // }

    /**
     * Converts this NNF to an equivalent CNF using parallel-serial algorithm.
     * @returns {(NNF | undefined)} an equivalent CNF.
     * @memberof NNF
     */
    // public convertToNNF(): NNF | undefined {
    //     return undefined;
    // }
}