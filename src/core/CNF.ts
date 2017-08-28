import { Clause } from "./Clause";
import { andRegex, Connectives, Symbols } from "./Constants";
import { isCNF } from "./Formula";
import { Literal } from "./Literal";
import { NNF } from "./NNF";
import { SATChecker } from "./SATChecker";

export class CNF {
    /**
     * Parses string representation to CNF object.
     *
     * @static
     * @param {string} str string representation of CNF (thus in NNF).
     * @returns {CNF} a equivalent CNF object.
     * @memberof CNF
     */
    public static parse(str: string): CNF {
        return new CNF(str.trim().split(andRegex).map((clauseStr: string) => Clause.parse(clauseStr, true)));
    }

    /**
     * Returns the set of variables used in the CNF.
     *
     * @type {Set<string>}
     * @memberof CNF
     */
    public readonly variableSet: Set<string>;

    constructor(readonly clauses: Clause[]) {
        if (this.clauses.some((clause: Clause) => !clause.isDisjunctive)) {
            throw new Error("Not all of the clauses are disjunctive. All clauses needs to be disjunctive in a CNF.");
        }
        this.clauses = this.clauses.filter((clause: Clause) => !clause.isEmpty());
        this.clauses = Array
            .from(new Set(this.clauses.map((clause: Clause) => clause.toString())))
            .map((str: string) => Clause.parse(str, true));
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

    /**
     * Returns true if the input cnf is satisfiable, else it returns false.
     * @param {SATChecker} satChecker Satisfiability checker algorithm.
     * @returns {boolean} true if this cnf is satisfiable, else false.
     * @memberof CNF
     */
    public isSat(satChecker: SATChecker): boolean {
        return satChecker.isSat(this);
    }

    public union(that: CNF | Clause): CNF {
        const clauses = isCNF(that) ? that.clauses : [that];
        return new CNF([...this.clauses, ...clauses]);
    }

    public toString() {
        return this.isEmpty()
            ? Symbols.empty
            : this.clauses
                .map((clause: Clause) => clause.toString())
                .join(` ${Connectives.and} `);
    }
    public toNNF(): NNF {
        return new NNF(this.clauses.map((clause: Clause) => clause.toNNF()), Connectives.and);
    }
}