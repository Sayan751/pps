import { CNF } from "./CNF";
import { QuantifiedVariable } from "./QuantifiedVariable";
export class QCNF {
    constructor(readonly cnf: CNF, readonly quantifiedVariables: QuantifiedVariable[] = []) {
        if (!cnf) throw new Error("Invalid input, cnf is required.");
    }

    public toString() {
        return `${
            this.quantifiedVariables.length > 0
                ? this.quantifiedVariables.map((v) => v.toString()).join(", ") + ": "
                : ""}${this.cnf.toString()}`;
    }
}