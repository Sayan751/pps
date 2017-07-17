import { Literal } from "./Literal"
export class Clause {
    private _variableSet: Set<string>;

    constructor(readonly literals: Literal[]) {
        if (!literals) throw Error("Invalid argument 'literals'");
        this._variableSet = new Set(literals.map(lit => lit.variable));
    }

    isEmpty(): boolean {
        return this.literals.length === 0;
    }
    isUnit(): boolean {
        return this.literals.length === 1;
    }

    isPositiveUnit(): boolean {
        return this.isUnit() && !this.literals[0].isNegative;
    }

    /**
     * Returns true if clause contains at-most 1 positive literal.
     * 
     * @returns {boolean} 
     * @memberof Clause
     */
    isHorn(): boolean {
        return this.literals.filter((lit: Literal) => !lit.isNegative).length <= 1;
    }

    /**
     * Returns the set of variables used in the clause.
     * 
     * @readonly
     * @memberof Clause
     */
    get variableSet() {
        return this._variableSet;
    }

    /**
     * Returns the number of variables used in the clause.
     * 
     * @readonly
     * @memberof Clause
     */
    get numVariables() {
        return this._variableSet.size;
    }

    toString() {
        return this.isEmpty()
            ? '\u2294'
            : `(${
            this.literals
                .map((lit: Literal) => lit.toString())
                .join(' \u2228 ')
            })`;
    }
}