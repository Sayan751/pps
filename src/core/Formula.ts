import { Clause } from "./Clause";
import { CNF } from "./CNF";
import { Literal } from "./Literal";
import { NNF } from "./NNF";

export type Formula = NNF | CNF | Clause | Literal;

export const isCNF = (formula: Formula): formula is CNF => (formula instanceof CNF);
export const isClause = (formula: Formula): formula is Clause => (formula instanceof Clause);