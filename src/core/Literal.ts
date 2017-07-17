export class Literal {
    constructor(public readonly variable: string, public readonly isNegative: boolean = false) {
        if (!variable || variable.length < 1) throw new Error("Invalid variable name")
    }

    toString() {
        return `${this.isNegative ? '\u00AC' : ''}${this.variable}`;
    }
}