import { Clause } from "../../core/Clause";
import { CNF } from "../../core/CNF";
import { Utility } from "../../core/Utility";
import { IND } from "./IND";
import { IndSet } from "./IndSet";
export class IndependentSet {
    /**
     * Returns true if the input cnf is satisfiable, else it returns false.
     *
     * @static
     * @param {CNF} cnf input cnf formula
     * @returns {boolean} true if the input cnf is satisfiable, else false.
     * @memberof IndependentSet
     */
    public static isSat(cnf: CNF | string): boolean {
        if (typeof cnf === "string")
            cnf = CNF.parse(cnf);
        const cnfNumVar = cnf.numVariables;
        return Math.pow(2, cnfNumVar) !== IndependentSet.constructINDs(cnf).reduce((acc, ind) => acc + ind.SIZE(cnfNumVar), 0);
    }

    /**
     * Creates the collection of IND(1),IND(2),... etc.
     * The maximum length of the returned value is the number of clauses present in the cnf.
     * @static
     * @param {CNF} cnf input cnf formula
     * @returns {IND[]} the collection of IND(1),IND(2),... etc.
     * @memberof IndependentSet
     */
    public static constructINDs(cnf: CNF): IND[] {
        // create IND(1)
        const inds: IND[] = [
            new IND(1, new Set<IndSet>(
                cnf.clauses.map((clause: Clause) => new IndSet(new Set<Clause>([clause])))
            ))
        ];
        const cnfNumVar = cnf.numVariables;
        let indIndex = 2; // IND(1) is already generated
        let toContinue = true;

        while (indIndex <= cnfNumVar && toContinue) {
            let INDi: Set<IndSet>;
            // create IND(2)
            if (indIndex === 2) {
                const pairs = Utility.generateAllPairs(Array.from(inds[0].independentSets));
                INDi = pairs.reduce(IndependentSet.reducePairAsIndSet, new Set<IndSet>());
            } else {
                INDi = Array.from(inds[indIndex - 2].independentSets)
                    .reduce((acc: Set<IndSet>, indSet: IndSet, index: number, array: IndSet[]) => {
                        const pairs = [indSet].concat(array
                            .slice(index + 1)
                            .filter((item: IndSet) => item.clauses.has(indSet.clauses.values().next().value)));
                        return Utility.generateAllPairs(pairs).reduce(IndependentSet.reducePairAsIndSet, acc);
                    }, new Set<IndSet>());
            }
            toContinue = INDi && INDi.size > 0;
            if (toContinue) {
                inds.push(new IND(indIndex, INDi));
                indIndex++;
            }
        }
        return inds;
    }

    private static reducePairAsIndSet(acc: Set<IndSet>, pair: IndSet[]) {
        const newSet = pair[0].union(pair[1]);
        if (newSet)
            acc.add(newSet);
        return acc;
    }
}