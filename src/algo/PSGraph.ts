import { Edge, Graph } from "graphlib";
import { Clause } from "../core/Clause";
import { CNF } from "../core/CNF";
import { Connectives } from "../core/Constants";
import { Formula, isLiteral } from "../core/Formula";
import { Literal } from "../core/Literal";
import { NNF } from "../core/NNF";
import { QCNF } from "../core/QCNF";
import { QuantifiedVariable } from "../core/QuantifiedVariable";
/**
 * Provides implementation of Parallel-Serial graph algorithm to convert boolean formula in NNF to equivalent CNF.
 * @export
 * @class PSGraph
 */
export class PSGraph {
    public static convertNNFToCNF(nnf: NNF, intVarPrefix: string = "internal"): QCNF {
        if (!nnf) { throw new Error("Invalid input, nnf input is required."); }

        const regex = new RegExp(`^${intVarPrefix}\\d*$`);
        if (Array.from(nnf.variableSet).some((variable: string) => regex.test(variable))) {
            throw new Error("The prefix for internal nodes can't be a part of variable names already used in the nnf");
        }
        let cnf: CNF;
        if (nnf.group.length === 1 && isLiteral(nnf.group[0])) {
            return new QCNF(new CNF([new Clause([(nnf.group[0] as Literal)])]));
        }
        const source = Math.random().toString();
        const sink = Math.random().toString();

        const graph = new Graph({ multigraph: true });
        graph.setEdge(source, sink, nnf, nnf.toString());
        const internalNodeCount = this.growGraph(graph, intVarPrefix);

        cnf = new CNF(
            graph.edges().map((edge: Edge) => {
                const lits: Literal[] = [];
                if (edge.v !== source) { lits.push(Literal.parse(edge.v).negated()); }
                lits.push(graph.edge(edge));
                if (edge.w !== sink) { lits.push(Literal.parse(edge.w)); }
                return new Clause(lits, Connectives.or);
            }));
        const quantifiedVariables: QuantifiedVariable[] = [];
        for (let index = 1; index <= internalNodeCount; index++) {
            quantifiedVariables.push(new QuantifiedVariable(`${intVarPrefix}${index}`));
        }

        return new QCNF(cnf, quantifiedVariables);
    }

    private static growGraph(graph: Graph, intVarPrefix: string) {
        let internalNodeCount = 0;
        let toContinue = true;
        while (toContinue) {
            const prevEdgeCount = graph.edgeCount();

            graph.edges()
                .filter((edge: Edge) => !(graph.edge(edge) instanceof Literal))
                .forEach((edge: Edge) => {
                    const formula = graph.edge(edge) as NNF;
                    switch (formula.connective) {
                        case Connectives.and:
                            formula.group.forEach((item: Literal | NNF) => graph.setEdge(edge.v, edge.w, item, item.toString()));
                            graph.removeEdge(edge);
                            break;
                        case Connectives.or:
                            const lastIndex = formula.group.length - 1;
                            formula.group.forEach((item: Literal | NNF, index: number) => {
                                let src, dst;
                                if (index === 0) {
                                    src = edge.v;
                                    dst = `${intVarPrefix}${++internalNodeCount}`;
                                } else if (index === lastIndex) {
                                    src = `${intVarPrefix}${internalNodeCount}`;
                                    dst = edge.w;
                                } else {
                                    src = `${intVarPrefix}${internalNodeCount}`;
                                    dst = `${intVarPrefix}${++internalNodeCount}`;
                                }
                                graph.setEdge(src, dst, item, item.toString());
                            });
                            graph.removeEdge(edge);
                            break;
                    }
                });
            toContinue = graph.edgeCount() > prevEdgeCount;
        }
        return internalNodeCount;
    }
}