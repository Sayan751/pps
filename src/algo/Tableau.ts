import { Formula, isLiteral } from "../core/Formula";
export class Tableau {

}

class TableauNode {
    constructor(
        public sign: boolean,
        public formula: Formula,
        public isProcessed: boolean = false,
        public isClosed: boolean = false) { }

    public isContradicting(node: TableauNode): boolean {
        return (isLiteral(this.formula) && isLiteral(node.formula) && this.formula.equal(node.formula)) ||
            (!this.sign === node.sign);
    }
}