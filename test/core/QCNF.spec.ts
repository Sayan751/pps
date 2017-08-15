import { CNF } from "../../src/core/CNF";
import { Connectives, Quantifiers } from '../../src/core/Constants';
import { QCNF } from "../../src/core/QCNF";
import { QuantifiedVariable } from "../../src/core/QuantifiedVariable";

describe("QCNF test suite", () => {
    let qcnf: QCNF;
    let cnf: CNF;
    beforeEach(() => {
        cnf = CNF.parse("(x OR y) AND (z OR NOTy)");
        qcnf = new QCNF(cnf, [new QuantifiedVariable("x", true), new QuantifiedVariable("y")]);
    });

    describe("Properties must be initialized on instantiation", () => {
        it("w/o cnf instantiation is not possible", () => {
            expect(() => new QCNF(undefined, [])).toThrowError();
            expect(() => new QCNF(null, [])).toThrowError();
        });
        it("w/o quantifiers instantiation is possible", () => {
            expect(new QCNF(cnf)).toBeDefined();
        });
    });
    describe("String representation of QCNF should be correct", () => {
        it(`${Quantifiers.universal}x, ${Quantifiers.existential}y: (x or y) and (z or NOTy)`, () => {
            expect(qcnf.toString())
                .toBe(`${Quantifiers.universal}x, ${Quantifiers.existential}y: (x ${Connectives.or} y) ${Connectives.and} (z ${Connectives.or} ${Connectives.not}y)`);
        });
        it("w/o quantifiers string representation of qcnf is possible", () => {
            expect(new QCNF(cnf).toString()).toBe(`(x ${Connectives.or} y) ${Connectives.and} (z ${Connectives.or} ${Connectives.not}y)`);
        });
    });
});