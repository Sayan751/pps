import { Clause } from "../core/Clause";
import { CNF } from "../core/CNF";
import { Literal } from "../core/Literal";

export class IndependentSet {

    private numVar: number;

    constructor(private readonly clauses: Set<Clause>) {
        const checkForComplimentaryPairOfLit = (clause: Clause) => {
            clause.literals.forEach((lit: Literal) => {
                const existingSign = lits.get(lit.variable);
                if (existingSign !== undefined && existingSign !== lit.isNegative)
                    throw new Error("Invalid argument; independent set can't have complimentary pair of literals.");
                if (existingSign === undefined) lits.set(lit.variable, lit.isNegative);
            });
        };

        const vars = new Set<string>();
        // map: variable name is key, and value is true if the lit is negative
        const lits = new Map<string, boolean>();

        Array.from(clauses)
            .map((clause: Clause) => {
                checkForComplimentaryPairOfLit(clause);
                return clause.variableSet;
            })
            .forEach((variableSet: Set<string>) => variableSet.forEach((variable) => vars.add(variable)));
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
    public SIZE(numVarInCNF: number) { return Math.pow(2, numVarInCNF - this.numVar); }
}