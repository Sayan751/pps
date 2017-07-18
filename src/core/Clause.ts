import { Connectives, Symbols } from "./Constants";
import { Literal } from "./Literal";
export class Clause {
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