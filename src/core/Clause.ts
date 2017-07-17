import { Literal } from "./Literal"
export class Clause {
    private _variableSet: Set<string>;

    constructor(readonly literals: Literal[]) {
        this._variableSet = new Set<string>(literals.map(lit => lit.variable));
    }

    isUnitClause(): boolean {
        return this.literals.length == 1;
    }

    isPositiveUnitClause(): boolean {
        return this.isUnitClause() && !this.literals[0].isNegative;
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
        return `(${
            this.literals
                .map((lit: Literal) => lit.toString())
                .join(' \u2228 ')
            })`;
    }
}

// console.log(new Clause([new Literal("x"), new Literal("x", true)]).toString());