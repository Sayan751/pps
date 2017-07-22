import { CNF } from "../../src/core/CNF";
import { Utility } from "../../src/core/Utility";

export class TruthTableSATChecker {
    /**
     * Returns true if the input cnf is satisfiable, else it returns false.
     *
     * @static
     * @param {CNF} cnf input cnf formula
     * @returns {boolean} true if the input cnf is satisfiable, else false.
     * @memberof TruthTableSATChecker
     */
    public static isSat(cnf: CNF): boolean {
        const variables = cnf.variableSet;
        const binaryCombinations = Utility.binaryCombinationGenerator(cnf.numVariables);
        let combination: boolean[] = binaryCombinations.next().value;
        while (combination) {
            const truthAssignment: Map<string, boolean> = TruthTableSATChecker.generateTruthAssignment(variables, combination);
            if (cnf.isSatForTruthAssignment(truthAssignment)) { return true; }
            combination = binaryCombinations.next().value;
        }
        return false;
    }

    private static generateTruthAssignment(variables: Set<string>, truthValues: boolean[]): Map<string, boolean> {
        return Array
            .from(variables)
            .reduce((acc: Map<string, boolean>, variable: string, index: number) => acc.set(variable, truthValues[index]), new Map<string, boolean>());
    }
}