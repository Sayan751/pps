import { Clause } from "./Clause";
import { Literal } from "./Literal";

export class CNF {
    private _variableSet: Set<string>;

    constructor(readonly clauses: Clause[]) {
        this.clauses = this.clauses.filter((clause: Clause) => !clause.isEmpty());
        this._variableSet = this.clauses
            .map(clause => clause.variableSet)
            .reduce((acc: Set<string>, currentSet: Set<string>) => {
                currentSet.forEach(variable => acc.add(variable));
                return acc;
            }, new Set<string>())
    }

    isEmpty(): boolean {
        return this.clauses.length === 0;
    }

    /**
     * Returns the set of variables used in the CNF.
     * 
     * @readonly
     * @memberof CNF
     */
    get variableSet() {
        return this._variableSet;
    }

    /**
     * Returns the number of variables used in the CNF.
     * 
     * @readonly
     * @memberof CNF
     */
    get numVariables() {
        return this._variableSet.size;
    }

    toString() {
        return this.isEmpty()
            ? '\u2294'
            : this.clauses
                .map((clause: Clause) => clause.toString())
                .join(' \u2227 ');
    }
}