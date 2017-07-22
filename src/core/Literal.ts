import { Connectives } from "./Constants";
export class Literal {
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