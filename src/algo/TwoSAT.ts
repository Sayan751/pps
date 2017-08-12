import { alg, Graph } from "graphlib";
import { Clause } from "../core/Clause";
import { CNF } from "../core/CNF";
import { Formula, isClause, isCNF } from "../core/Formula";
import { Implication } from "../core/Implication";
import { Literal } from "../core/Literal";
import { Utility } from "../core/Utility";
import { AbstractCNFBasedAlgo } from "./AbstractCNFBasedAlgo";
/**
 * Provides implementation of 2-SAT algorithm.
 * @export
 * @class TwoSAT
 */
export class TwoSAT extends AbstractCNFBasedAlgo {
    /**
     * Returns true if the input cnf is satisfiable, else it returns false.
     *
     * @static
     * @param {CNF} cnf input cnf formula
     * @returns {boolean} true if the input cnf is satisfiable, else false.
     * @memberof TwoSAT
     */
    public static isSat(cnf: CNF | string): boolean {
        if (typeof cnf === "string") {
            cnf = CNF.parse(cnf);
        }
        const twoClauses: Clause[] = this.convertToTwoClauses(cnf);
        const implications = this.convertTwoClausesToImplication(twoClauses);
        const assocGraph = this.convertImplicationsToAssociativeGraph(implications);
        return !this.sccWithComplimentaryLitPairExists(assocGraph);
    }
    private static convertToTwoClauses(cnf: CNF): Clause[] {
        return cnf.clauses.reduce((acc: Clause[], clause: Clause) => {
            if (clause.literals.length <= 2) {
                acc.push(clause);
            } else {
                Utility.generateAllPairs(clause.literals)
                    .forEach((twoLits: Literal[]) => acc.push(new Clause(twoLits)));
            }
            return acc;
        }, []);
    }

    private static convertTwoClausesToImplication(twoClauses: Clause[]): Implication[] {
        const implications = twoClauses.map((clause: Clause) => clause.toImplication());
        return implications.concat(implications.map((implication: Implication) => implication.reverse()));
    }

    private static convertImplicationsToAssociativeGraph(implications: Implication[]): Graph {
        const assocGraph = new Graph();
        implications.forEach((impl: Implication) => {
            assocGraph.setEdge(impl.premise.toString(), impl.consequence.toString());
        });
        return assocGraph;
    }

    private static sccWithComplimentaryLitPairExists(graph: Graph) {
        return alg.tarjan(graph)
            .filter((scc: string[]) => scc.length > 1)
            .some((scc: string[]) =>
                scc.map((lit: string) => Literal.parse(lit))
                    .some((lit: Literal) => scc.includes(lit.negated().toString())));
    }
}