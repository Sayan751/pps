import { CNF } from "./CNF";
import { ClausalConnectives, Connectives } from "./Constants";
import { Literal } from "./Literal";
export class NNF {
    /**
     * Returns the set of variables used in the nnf.
     *
     * @type {Set<string>}
     * @memberof Clause
     */
    public readonly variableSet: Set<string>;
    constructor(public group: Literal[] | NNF[], public connective?: ClausalConnectives) {
        if (group.length > 1 && !connective) { throw new Error("Connective is required for multiple items in the group"); }

        if (this.isLiteralGroup(group)) {
            this.variableSet = new Set<string>(group.map((lit) => lit.variable));
        } else if (this.isNNFGroup(group)) {
            this.variableSet = group
                .reduce((acc: Set<string>, nnf: NNF) => {
                    Array.from(nnf.variableSet)
                        .forEach((variable: string) => acc.add(variable));
                    return acc;
                }, new Set<string>());
        }
    }
    public toString(): string {
        return `(` +
            (this.isLiteralGroup(this.group)
                ? this.group.map((item: Literal) => item.toString()).join(` ${this.connective} `)
                : this.isNNFGroup(this.group)
                    ? this.group.map((item: NNF) => item.toString()).join(` ${this.connective} `)
                    : "")
            + `)`;
    }

    private isLiteralGroup(group: Literal[] | NNF[]): group is Literal[] {
        return (group as Literal[])[0].variable !== undefined;
    }
    private isNNFGroup(group: Literal[] | NNF[]): group is NNF[] {
        return (group as NNF[])[0].group !== undefined;
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