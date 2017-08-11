import { Clause } from "../core/Clause";
import { CNF } from "../core/CNF";
import { Formula } from "../core/Formula";
import { Literal } from "../core/Literal";
import { NNF } from "../core/NNF";
import { Utility } from "../core/Utility";

export class TruthTable {
    /**
     * Returns true if alpha ≈ beta.
     * @param {(NNF | string)} alpha
     * @param {(NNF | string)} beta
     * @returns {boolean} true if alpha ≈ beta, else false.
     * @memberof TruthTable
     */
    public static isEquivalent(alpha: Formula, beta: Formula): boolean {
        return this.processForEquivalenceAndEntailment(alpha, beta, (alphaSat: boolean, betaSat: boolean) => alphaSat !== betaSat);
    }

    /**
     * Returns true if alpha entails beta (alpha ⊨ beta).
     * @param {Formula} alpha
     * @param {Formula} beta
     * @returns {boolean} true if alpha entails beta (alpha ⊨ beta), else false.
     * @memberof TruthTable
     */
    public static entails(alpha: Formula, beta: Formula): boolean {
        return this.processForEquivalenceAndEntailment(alpha, beta, (alphaSat: boolean, betaSat: boolean) => alphaSat && !betaSat);
    }

    /**
     * Returns true if the input cnf is satisfiable, else it returns false.
     *
     * @static
     * @param {CNF} cnf input cnf formula
     * @returns {boolean} true if the input cnf is satisfiable, else false.
     * @memberof TruthTable
     */
    public static isSat(cnf: CNF | string): boolean {
        return TruthTable.process(cnf) as boolean;
    }

    public static getModel(cnf: CNF | string): Array<Map<string, boolean>> {
        return TruthTable.process(cnf, true) as Array<Map<string, boolean>>;
    }

    private static process(cnf: CNF | string, returnModel = false): boolean | Array<Map<string, boolean>> {
        if (typeof cnf === "string")
            cnf = CNF.parse(cnf);
        const retVal: boolean | Array<Map<string, boolean>> = returnModel ? [] : false;
        const variables = cnf.variableSet;
        const binaryCombinations = Utility.binaryCombinationGenerator(cnf.numVariables);
        let combination: boolean[] = binaryCombinations.next().value;
        while (combination) {
            const truthAssignment: Map<string, boolean> = TruthTable.generateTruthAssignment(variables, combination);
            if (cnf.isSatForTruthAssignment(truthAssignment)) {
                if (!returnModel)
                    return true;
                (retVal as Array<Map<string, boolean>>).push(truthAssignment);
            }
            combination = binaryCombinations.next().value;
        }
        return retVal;
    }

    private static processForEquivalenceAndEntailment(alpha: Formula, beta: Formula, falsifyingCondition: (alphaSat: boolean, betaSat: boolean) => boolean): boolean {
        const variableSet = new Set<string>([...this.getVariables(alpha), ...this.getVariables(beta)]);
        const binaryCombinations = Utility.binaryCombinationGenerator(variableSet.size);
        let combination: boolean[] = binaryCombinations.next().value;
        while (combination) {
            const truthAssignment: Map<string, boolean> = TruthTable.generateTruthAssignment(variableSet, combination);
            const alphaSat = alpha.isSatForTruthAssignment(truthAssignment);
            const betaSat = beta.isSatForTruthAssignment(truthAssignment);
            if (falsifyingCondition(alphaSat, betaSat)) { return false; }
            combination = binaryCombinations.next().value;
        }
        return true;
    }

    private static generateTruthAssignment(variables: Set<string>, truthValues: boolean[]): Map<string, boolean> {
        return Array
            .from(variables)
            .reduce((acc: Map<string, boolean>, variable: string, index: number) => acc.set(variable, truthValues[index]), new Map<string, boolean>());
    }

    private static getVariables(formula: Formula) {
        return this.isLiteral(formula) ? [formula.variable] : Array.from(formula.variableSet);
    }
    private static isLiteral(formula: Formula): formula is Literal {
        return (formula as any) instanceof Literal;
    }
}