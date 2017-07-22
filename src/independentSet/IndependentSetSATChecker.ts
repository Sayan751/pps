import { Clause } from "../../src/core/Clause";
import { CNF } from "../../src/core/CNF";
import { Utility } from "../../src/core/Utility";
import { IND } from "./IND";
import { IndependentSet } from "./IndependentSet";
export class IndependentSetSATChecker {
    /**
     * Returns true if the input cnf is satisfiable, else it returns false.
     *
     * @static
     * @param {CNF} cnf input cnf formula
     * @returns {boolean} rue if the input cnf is satisfiable, else false.
     * @memberof IndependentSetSATChecker
     */
    public static isSat(cnf: CNF): boolean {
        const cnfNumVar = cnf.numVariables;
        return Math.pow(2, cnfNumVar) !== IndependentSetSATChecker.constructINDs(cnf).reduce((acc, ind) => acc + ind.SIZE(cnfNumVar), 0);
    }

    /**
     * Creates the collection of IND(1),IND(2),... etc.
     * The maximum length of the returned value is the number of clauses present in the cnf.
     * @static
     * @param {CNF} cnf input cnf formula
     * @returns {IND[]} the collection of IND(1),IND(2),... etc.
     * @memberof IndependentSetSATChecker
     */
    public static constructINDs(cnf: CNF): IND[] {
        // create IND(1)
        const inds: IND[] = [
            new IND(1, new Set<IndependentSet>(
                cnf.clauses.map((clause: Clause) => new IndependentSet(new Set<Clause>([clause])))
            ))
        ];
        const cnfNumVar = cnf.numVariables;
        let indIndex = 2; // IND(1) is already generated
        let toContinue = true;

        while (indIndex <= cnfNumVar && toContinue) {
            let INDi: Set<IndependentSet>;
            // create IND(2)
            if (indIndex === 2) {
                const pairs = Utility.generateAllPairs(Array.from(inds[0].independentSets));
                INDi = pairs.reduce(IndependentSetSATChecker.reducePairAsIndSet, new Set<IndependentSet>());
            } else {
                INDi = Array.from(inds[indIndex - 2].independentSets)
                    .reduce((acc: Set<IndependentSet>, indSet: IndependentSet, index: number, array: IndependentSet[]) => {
                        const pairs = [indSet].concat(array
                            .slice(index + 1)
                            .filter((item: IndependentSet) => item.clauses.has(indSet.clauses.values().next().value)));
                        return Utility.generateAllPairs(pairs).reduce(IndependentSetSATChecker.reducePairAsIndSet, acc);
                    }, new Set<IndependentSet>());
            }
            toContinue = INDi && INDi.size > 0;
            if (toContinue) {
                inds.push(new IND(indIndex, INDi));
                indIndex++;
            }
        }
        return inds;
    }

    private static reducePairAsIndSet(acc: Set<IndependentSet>, pair: IndependentSet[]) {
        const newSet = pair[0].union(pair[1]);
        if (newSet)
            acc.add(newSet);
        return acc;
    }
}