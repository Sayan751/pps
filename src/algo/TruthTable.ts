import { CNF } from "../core/CNF";
import { Utility } from "../core/Utility";

export class TruthTable {
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

    private static generateTruthAssignment(variables: Set<string>, truthValues: boolean[]): Map<string, boolean> {
        return Array
            .from(variables)
            .reduce((acc: Map<string, boolean>, variable: string, index: number) => acc.set(variable, truthValues[index]), new Map<string, boolean>());
    }
}