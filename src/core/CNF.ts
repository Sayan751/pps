import { Clause } from "./Clause";
import { Literal } from "./Literal";

export class CNF {
    private _variableSet: Set<string>;

    constructor(readonly clauses: Clause[]) {
        this._variableSet = clauses
            .map(clause => clause.variableSet)
            .reduce((acc: Set<string>, currentSet: Set<string>) => {
                currentSet.forEach(variable => acc.add(variable));
                return acc;
            }, new Set<string>())
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
        return this.clauses
            .map((clause: Clause) => clause.toString())
            .join(' \u2227 ');
    }
}

// console.log(
//     new CNF([
//         new Clause([new Literal("z", true), new Literal("y")]),
//         new Clause([new Literal("x"), new Literal("x", true)]),
//         new Clause([new Literal("z"), new Literal("x")])
//     ]).toString());