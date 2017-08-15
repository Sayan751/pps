import { Quantifiers } from "./Constants";

export class QuantifiedVariable {
    constructor(readonly variable: string, readonly isUniversal = false) {
        if (!variable) throw new Error("Invalid input, variable is needed.");
    }

    public toString(): string {
        return `${this.isUniversal ? Quantifiers.universal : Quantifiers.existential}${this.variable}`;
    }
}