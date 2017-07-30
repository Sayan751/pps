import { Clause } from "./Clause";
import { Connectives } from "./Constants";
import { Literal } from "./Literal";
/**
 * This class supports only th implication construct.
 * It does not support parsing formulas in string with implication in it (at-least not yet).
 * This class is meant to be used in 2-SAT algorithm.
 * @export
 * @class Implication
 */

export class Implication {
    constructor(readonly premise: Literal, readonly consequence: Literal) {
        if (!premise || !consequence) throw Error("Invalid argument");
    }
    /**
     * Converts this implication to clausal form.
     * @returns {Clause} equivalent clause.
     * @memberof Implication
     */
    public toClause(): Clause {
        return new Clause([this.premise.negated(), this.consequence]);
    }
    /**
     * Returns the reverse implication.
     * @returns {Implication} Reversed implication
     * @memberof Implication
     */
    public reverse(): Implication {
        return new Implication(this.consequence.negated(), this.premise.negated());
    }
    /**
     * Returns the string representation of this implication.
     * @returns string representation
     * @memberof Implication
     */
    public toString() {
        return `(${this.premise} ${Connectives.implication} ${this.consequence})`;
    }
}