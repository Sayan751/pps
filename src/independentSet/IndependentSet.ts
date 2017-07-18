import { Clause } from "../core/Clause"
import { CNF } from "../core/CNF"

export class IndependentSet {

    private numVar: number;

    constructor(private readonly clauses: Set<Clause>) {
        const vars = new Set<string>();
        Array.from(clauses).map((clause: Clause) => clause.variableSet)
            .forEach((variableSet: Set<string>) => variableSet.forEach(variable => vars.add(variable)));
        this.numVar = vars.size;
    }

    /**
     * Returns number of clauses in the set.
     * 
     * @readonly
     * @memberof IndependentSet
     */
    get size() { return this.clauses.size; }

    /**
     * Returns SIZE = 2^(numVarInCNF - number of vars in independent set)
     * 
     * @param {number} numVarInCNF 
     * @returns SIZE = 2^(numVarInCNF - number of vars in independent set)
     * @memberof IndependentSet
     */
    SIZE(numVarInCNF: number) { return Math.pow(2, numVarInCNF - this.numVar); }
}