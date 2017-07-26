import { Connectives } from "./Constants";

const notRegex = new RegExp(`(not|${Connectives.not})`, "ig");
const validLitRegex = new RegExp(`^(not|${Connectives.not})?\\s*[a-z]+[0-9]*$`, "i");
export class Literal {

    /**
     * Parses string representation to Literal object.
     *
     * @static
     * @param {string} str string representation of Literal.
     * @returns {Literal} a equivalent Literal object.
     * @memberof Literal
     */
    public static parse(str: string): Literal {
        str = str.trim();
        if (!validLitRegex.test(str)) throw new Error("Invalid string representation of literal: '" + str + "'");
        return new Literal(str.replace(notRegex, "").trim(), notRegex.test(str));
    }

    constructor(public readonly variable: string, public readonly isNegative: boolean = false) {
        if (!variable || variable.length < 1) throw new Error("Invalid variable name");
    }

    public isSatForTruthAssignment(truthAssignment: Map<string, boolean>) {
        const truthValue = truthAssignment.get(this.variable);
        return truthValue !== undefined ? (this.isNegative ? !truthValue : truthValue) : false;
    }

    public toString() {
        return `${this.isNegative ? Connectives.not : ""}${this.variable}`;
    }
}