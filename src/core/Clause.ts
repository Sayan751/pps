import { CNF } from "./CNF";
import { andRegex, ClausalConnectives, Connectives, orRegex, Symbols } from "./Constants";
import { Implication } from "./Implication";
import { Literal } from "./Literal";
import { NNF } from "./NNF";

export class Clause {
    /**
     * Parses string representation to Clause object.
     *
     * @static
     * @param {string} str string representation of Clause in NNF.
     * @returns {Clause} a equivalent Clause object.
     * @memberof Clause
     */
    public static parse(str: string, isDisjunctiveByDefault: boolean = true): Clause {
        const parenStartIndex = str.indexOf("(");
        const parenEndIndex = str.indexOf(")");
        if ((parenStartIndex > -1 && parenEndIndex === -1) ||
            (parenStartIndex === -1 && parenEndIndex > -1) ||
            (parenEndIndex < parenStartIndex)) {
            throw new Error(`'${str}' is not a Clause`);
        }
        let isConjunctive = andRegex.test(str);
        let isDisjunctive = orRegex.test(str);
        if (isConjunctive && isDisjunctive) {
            throw new Error(`'${str}' is not a Clause`);
        }
        if (!isConjunctive && !isDisjunctive) {
            if (isDisjunctiveByDefault) {
                isDisjunctive = true;
            } else {
                isConjunctive = true;
            }
        }
        return new Clause(
            str.trim()
                .replace(/(\(|\))/g, "")
                .trim()
                .split(isDisjunctive ? orRegex : andRegex)
                .map((litStr: string) => Literal.parse(litStr)),
            isDisjunctive ? Connectives.or : Connectives.and);
    }
    /**
     * Returns the set of variables used in the clause.
     *
     * @type {Set<string>}
     * @memberof Clause
     */
    public readonly variableSet: Set<string>;
    /**
     * true if the clause is a disjunctive clause (default);
     * false if the clause is a conjunctive clause.
     *
     * @type {boolean}
     * @memberof Clause
     */
    public readonly isDisjunctive: boolean = true;

    constructor(readonly literals: Literal[], readonly connective: ClausalConnectives = Connectives.or) {
        if (!literals || !(connective === Connectives.and || connective === Connectives.or)) {
            throw Error("Invalid argument 'literals'");
        }
        this.isDisjunctive = connective === Connectives.or;
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
        return this.isDisjunctive && this.literals.filter((lit: Literal) => !lit.isNegative).length <= 1;
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
        return this.isDisjunctive
            ? this.literals.some((lit: Literal) => lit.isSatForTruthAssignment(truthAssignment))
            : this.literals.every((lit: Literal) => lit.isSatForTruthAssignment(truthAssignment));
    }

    /**
     * Converts this clause to an implication.
     * @returns {Implication} An equivalent implication object.
     * @memberof Clause
     * @throws If this clauses is not a 2-Clause (only 2-clauses are supported at this moment).
     */
    public toImplication() {
        if (!this.isDisjunctive) { throw new Error("Conversion from a non-disjunctive clause to implication is not supported."); }
        if (this.literals.length >= 3) { throw new Error("Conversion from a k-clause, with k>=3, to implication is not supported at this moment."); }
        const [left, consequence] = this.literals;
        return new Implication(left.negated(), consequence || left);
    }

    /**
     * Returns a negated literal. This literal stays unchanged.
     * @memberof Clause
     */
    public negated(): CNF | Clause {
        return this.isDisjunctive
            ? new CNF(this.literals.map((lit: Literal) => new Clause([lit.negated()])))
            : new Clause(this.literals.map((lit: Literal) => lit.negated()));
    }
    public toString() {
        return this.isEmpty()
            ? Symbols.empty
            : `(${
            this.literals
                .map((lit: Literal) => lit.toString())
                .join(` ${this.connective} `)
            })`;
    }
    public toNNF(): NNF {
        return new NNF(this.literals, this.connective);
    }
}