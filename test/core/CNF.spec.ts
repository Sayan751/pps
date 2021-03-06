import "babel-polyfill";
import { Clause } from "../../src/core/Clause";
import { CNF } from "../../src/core/CNF";
import { Connectives, Symbols } from "../../src/core/Constants";
import { Literal } from "../../src/core/Literal";

describe("CNF test suite", () => {

    describe("Properties must be initialized on instantiation", () => {
        it("Empty CNF is possible", () => {
            const emptyCnf = new CNF([]);
            expect(emptyCnf).toBeDefined();
            expect(emptyCnf.clauses).toBeDefined();
            expect(emptyCnf.isEmpty()).toBe(true);

            const emptyCnf1 = new CNF([new Clause([]), new Clause([])]);
            expect(emptyCnf1).toBeDefined();
            expect(emptyCnf1.clauses).toBeDefined();
            expect(emptyCnf1.isEmpty()).toBe(true);
        });

        it("Instantiation with non-empty set of clauses sets up other properties correctly", () => {
            const cnf = new CNF([
                new Clause([new Literal("z", true), new Literal("y")]),
                new Clause([new Literal("x"), new Literal("x", true)]),
                new Clause([new Literal("z"), new Literal("x")])
            ]);
            expect(cnf).toBeDefined();
            expect(cnf.clauses).toBeDefined();
            expect(cnf.variableSet).toBeDefined();
            expect(cnf.numVariables).toBe(3);
            expect(cnf.isEmpty()).toBe(false);
        });

        it("Conjunctive clause in CNF is not possible", () => {
            expect(() => new CNF([
                new Clause([new Literal("z", true), new Literal("y")], Connectives.and),
                new Clause([new Literal("x"), new Literal("x", true)])
            ])).toThrowError();
        });
    });

    describe("Aspects of the clause should be correctly projected", () => {
        it("isHorn should return true for a horn formula", () => {
            expect(new CNF([
                new Clause([new Literal("a")]),
                new Clause([new Literal("z", true), new Literal("y")]),
                new Clause([new Literal("x"), new Literal("x", true)]),
                new Clause([new Literal("z", true), new Literal("x", true)])
            ]).isHorn()).toBe(true);
        });
        it("isHorn should return false for a non-horn formula", () => {
            expect(new CNF([
                new Clause([new Literal("a")]),
                new Clause([new Literal("z"), new Literal("y")]),
                new Clause([new Literal("x"), new Literal("x", true)]),
                new Clause([new Literal("z", true), new Literal("x", true)])
            ]).isHorn()).toBe(false);
        });
    });

    describe("CNF must have proper string representation", () => {
        it(`empty CNF should represented as ${Symbols.empty}`, () => {
            expect(new CNF([]).toString()).toBe(Symbols.empty);
        });

        it(`(z OR y) AND (z OR NOT x) should be represented as (z ${Connectives.or} y) ${Connectives.and} (z ${Connectives.or} ${Connectives.not}x)`, () => {
            expect(
                new CNF([
                    new Clause([new Literal("z"), new Literal("y")]),
                    new Clause([new Literal("z"), new Literal("x", true)])
                ]).toString())
                .toBe(`(z ${Connectives.or} y) ${Connectives.and} (z ${Connectives.or} ${Connectives.not}x)`);
        });
    });

    describe("cnf strings should be correctly parsed", () => {

        it(`The string '(a or b not) and (b or c)' should not be parsed to a CNF object`, () => {
            expect(() => CNF.parse(`(a or b not) and (b or c)`)).toThrowError();
        });

        it(`The string '(a and b) or (c and d)' should not be parsed to a CNF object`, () => {
            expect(() => CNF.parse(`(a and b) or (c and d)`)).toThrowError();
        });

        it(`The string '(a or b) and    (b or c)  AND  (c or d) ${Connectives.and}  (d or e)' should be correctly parsed to a CNF object`, () => {
            const cnf = CNF.parse(`(a or b) and    (b or c)  AND  (c or d) ${Connectives.and}  (d or e)`);
            expect(cnf).toBeDefined();
            expect(cnf.toString()).toBe(`(a ${Connectives.or} b) ${Connectives.and} (b ${Connectives.or} c) ${Connectives.and} (c ${Connectives.or} d) ${Connectives.and} (d ${Connectives.or} e)`);
        });

        it(`The string 'a && b' should be correctly parsed to a CNF object`, () => {
            const cnf = CNF.parse("a && b");
            expect(cnf).toBeDefined();
            expect(cnf.toString()).toBe(`(a) ${Connectives.and} (b)`);
        });

        it(`The string '(a || b) and    (b or c)  &&  (c or d) ${Connectives.and}  (!d or e)' should be correctly parsed to a CNF object`, () => {
            const cnf = CNF.parse(`(a || b) and    (b or c)  &&  (c or d) ${Connectives.and}  (!d or e)`);
            expect(cnf).toBeDefined();
            const expected = `(a ${Connectives.or} b) ${Connectives.and} (b ${Connectives.or} c) ${Connectives.and} ` +
                `(c ${Connectives.or} d) ${Connectives.and} (${Connectives.not}d ${Connectives.or} e)`;
            expect(cnf.toString()).toBe(expected);
        });
    });

    describe("CNF can be converted to NNF", () => {
        it("(x) AND (x OR y) can be converted to NNF", () => {
            const cnf = CNF.parse("(x) AND (x OR y)");
            const nnf = cnf.toNNF();
            expect(nnf).toBeDefined();
            expect(nnf.connective).toBe(Connectives.and);
            expect(nnf.group.length).toBe(cnf.clauses.length);
            expect(nnf.variableSet.size).toBe(cnf.variableSet.size);
        });
    });
});