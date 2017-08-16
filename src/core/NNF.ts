import { CNF } from "./CNF";
import { ClausalConnectives, Connectives } from "./Constants";
import { isLiteral } from "./Formula";
import { Literal } from "./Literal";
export class NNF {
    /**
     * Returns the set of variables used in the nnf.
     *
     * @type {Set<string>}
     * @memberof Clause
     */
    public readonly variableSet: Set<string>;
    constructor(readonly group: Array<Literal | NNF>, readonly connective?: ClausalConnectives) {
        if (group.length > 1 && !connective) { throw new Error("Connective is required for multiple items in the group"); }
        this.variableSet = group
            .reduce((acc: Set<string>, item: Literal | NNF) => {
                if (isLiteral(item)) {
                    acc.add(item.variable);
                } else {
                    Array.from(item.variableSet)
                        .forEach((variable: string) => acc.add(variable));
                }
                return acc;
            }, new Set<string>());
    }
    public isSatForTruthAssignment(truthAssignment: Map<string, boolean>): boolean {
        let retVal = false;
        switch (this.connective) {
            case Connectives.and:
                retVal = this.group.every((item: Literal | NNF) => item.isSatForTruthAssignment(truthAssignment));
                break;
            case Connectives.or:
                retVal = this.group.some((item: Literal | NNF) => item.isSatForTruthAssignment(truthAssignment));
                break;
            default:
                retVal = this.group[0].isSatForTruthAssignment(truthAssignment);
        }
        return retVal;
    }

    public toString(): string {
        return `(${this.group.map((item: Literal | NNF) => item.toString()).join(` ${this.connective} `)})`;
    }

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