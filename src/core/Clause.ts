import { andRegex, Connectives, orRegex, Symbols } from "./Constants";
import { Literal } from "./Literal";

export class Clause {
    /**
     * Parses string representation to Clause object.
     *
     * @static
     * @param {string} str string representation of Clause in NNF.
     * @returns {Clause} a equivalent Clause object.
     * @memberof Clause
     */
    public static parse(str: string): Clause {
        if (andRegex.test(str)) throw new Error(`'${str}' is not a Clause`);
        return new Clause(str.trim().replace(/(\(|\))/g, "").trim().split(orRegex).map((litStr: string) => Literal.parse(litStr)));
    }
    /**
     * Returns the set of variables used in the clause.
     *
     * @type {Set<string>}
     * @memberof Clause
     */
    public readonly variableSet: Set<string>;

    constructor(readonly literals: Literal[]) {
        if (!literals) throw Error("Invalid argument 'literals'");
        this.variableSet = new Set(literals.map((lit) => lit.variable));
    }

    public isEmpty(): boolean {
        return this.literals.length === 0;
    }
    public isUnit(): boolean {
        return this.literals.length === 1;
    }

    public isPositiveUnit(): boolean {
        return this.isUnit() && !this.literals[0].isNegative;
    }

    /**
     * Returns true if clause contains at-most 1 positive literal.
     *
     * @returns {boolean}
     * @memberof Clause
     */
    public isHorn(): boolean {
        return this.literals.filter((lit: Literal) => !lit.isNegative).length <= 1;
    }

    /**
     * Returns the number of variables used in the clause.
     *
     * @readonly
     * @memberof Clause
     */
    get numVariables() {
        return this.variableSet.size;
    }

    public isSatForTruthAssignment(truthAssignment: Map<string, boolean>) {
        return this.literals.some((lit: Literal) => lit.isSatForTruthAssignment(truthAssignment));
    }

    public toString() {
        return this.isEmpty()
            ? Symbols.empty
            : `(${
            this.literals
                .map((lit: Literal) => lit.toString())
                .join(` ${Connectives.or} `)
            })`;
    }
}