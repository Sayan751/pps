import { Clause } from "./Clause";
import { Connectives, Symbols } from "./Constants";
import { Literal } from "./Literal";

export class CNF {
    /**
     * Returns the set of variables used in the CNF.
     *
     * @type {Set<string>}
     * @memberof CNF
     */
    public readonly variableSet: Set<string>;

    constructor(readonly clauses: Clause[]) {
        this.clauses = this.clauses.filter((clause: Clause) => !clause.isEmpty());
        this.variableSet = this.clauses
            .map((clause) => clause.variableSet)
            .reduce((acc: Set<string>, currentSet: Set<string>) => {
                currentSet.forEach((variable) => acc.add(variable));
                return acc;
            }, new Set<string>());
    }

    public isHorn(): boolean {
        return this.clauses.every((clause: Clause) => clause.isHorn());
    }
    public isEmpty(): boolean {
        return this.clauses.length === 0;
    }

    /**
     * Returns the number of variables used in the CNF.
     *
     * @readonly
     * @memberof CNF
     */
    get numVariables() {
        return this.variableSet.size;
    }

    public isSatForTruthAssignment(truthAssignment: Map<string, boolean>) {
        return this.clauses.every((clause: Clause) => clause.isSatForTruthAssignment(truthAssignment));
    }

    public toString() {
        return this.isEmpty()
            ? Symbols.empty
            : this.clauses
                .map((clause: Clause) => clause.toString())
                .join(` ${Connectives.and} `);
    }
}