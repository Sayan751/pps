import { IndSet } from "./IndSet";
export class IND {

    constructor(private readonly i: number, public independentSets: Set<IndSet>) {
        // Sanity check
        const isValid = Array.from(independentSets).every((indSet: IndSet) => indSet.size === i);
        if (!isValid) throw new Error("Invalid arguments; i does not match with the size of all independent sets provided");
    }

    public SIZE(numVarInCNF: number) {
        return Math.pow(-1, this.i - 1) *
            Array.from(this.independentSets)
                .map((set) => set.SIZE(numVarInCNF))
                .reduce((acc, item) => acc + item, 0);
    }
}