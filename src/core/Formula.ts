import { Clause } from "./Clause";
import { CNF } from "./CNF";
import { Literal } from "./Literal";
import { NNF } from "./NNF";

export type Formula = NNF | CNF | Clause | Literal;