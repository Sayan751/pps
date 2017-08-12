import { Clause } from "../core/Clause";
import { CNF } from "../core/CNF";
import { Formula, isClause, isCNF } from "../core/Formula";
import { Literal } from "../core/Literal";
import { SATChecker } from "../core/SATChecker";

export abstract class AbstractCNFBasedAlgo {
    public static isSat(cnf: string | CNF): boolean {
        throw new Error("Method not implemented.");
    }

    public static entails(alpha: Formula, beta: Formula): boolean {
        if (!isCNF(alpha)) { throw new Error("alpha needs to be a CNF when TwoSAT is used to determine entailment"); }
        return !this.isSat(alpha.union(this.negateFormulaToCNFClause(beta)));
    }

    private static negateFormulaToCNFClause = (formula: Formula) => {
        let retVal: Formula;
        if (formula instanceof Literal) {
            retVal = new Clause([formula.negated()]);
        } else if (isClause(formula)) {
            retVal = formula.negated();
            if (isClause(retVal)) { throw new Error("It seems that beta is a conjunctive clause. Try to use CNF directly."); }
        } else if (isCNF(formula)) {
            if (formula.clauses.every((clause: Clause) => clause.isUnit())) {
                retVal = new Clause(formula.clauses.map((clause: Clause) => clause.literals[0].negated()));
            } else {
                throw new Error("beta is a CNF such that all clauses are not unit clause; thus, it can't be converted to a disjunctive clause." +
                    "Consider using a different entailment checker.");
            }
        } else {
            throw new Error("beta is a NNF. Consider using a different entailment checker.");
        }
        return retVal;
    }
}