import { PSGraph } from "../../src/algo/PSGraph";
import { Connectives, Quantifiers } from "../../src/core/Constants";
import { Literal } from "../../src/core/Literal";
import { NNF } from "../../src/core/NNF";
import { QuantifiedVariable } from "../../src/core/QuantifiedVariable";

describe("PSGraph test suite", () => {
    describe("NNF to CNF conversion should be correct", () => {
        let nnf: NNF;
        beforeEach(() => {
            // arrange
            const nota = new Literal("a", true);
            const bandnotc = new NNF([new Literal("b"), new Literal("c", true)], Connectives.and);
            const dande = new NNF([new Literal("d"), new Literal("e")], Connectives.and);
            nnf = new NNF([nota, new NNF([bandnotc, dande], Connectives.or)], Connectives.and);
        });
        it(`invalid input should cause error`, () => {
            expect(() => PSGraph.convertNNFToCNF(undefined)).toThrowError();
            expect(() => PSGraph.convertNNFToCNF(null)).toThrowError();
        });
        it(`internal var prefix should not be same as existing variable in qnf`, () => {
            expect(() => PSGraph.convertNNFToCNF(nnf, "a")).toThrowError();
        });
        it(`"a" as the internal var prefix should cause error where the nnf has a variable as "a99999"`, () => {
            expect(() => PSGraph.convertNNFToCNF(new NNF([new Literal("a99999", true)]), "a")).toThrowError();
        });
        it(`"a" as the internal var prefix should not cause error where the nnf has a variable as "a99999asd"`, () => {
            expect(() => PSGraph.convertNNFToCNF(new NNF([new Literal("a99999asd", true)]), "a")).toBeDefined();
        });
        it(`${Connectives.not}a ${Connectives.and} ((b ${Connectives.and} ${Connectives.not}c) ${Connectives.or} (d ${Connectives.and} e)) => ` +
            `${Quantifiers.existential}z1: ${Connectives.not}a ${Connectives.and} (z1 ${Connectives.or} b) ${Connectives.and} (z1 ${Connectives.or} ${Connectives.not}c) ` +
            `${Connectives.and} (${Connectives.not}z1 ${Connectives.or} d) ${Connectives.and} (${Connectives.not}z1 ${Connectives.or} e)`,
            () => {
                // act
                const qcnf = PSGraph.convertNNFToCNF(nnf, "z");

                // assert
                expect(qcnf).toBeDefined();
                expect(qcnf.cnf).toBeDefined();
                expect(qcnf.quantifiedVariables).toBeDefined();
                expect(qcnf.quantifiedVariables.length).toBe(1);
                expect(qcnf.quantifiedVariables[0].isUniversal).toBe(false);
                expect(qcnf.toString()).toBe(
                    `${Quantifiers.existential}z1: (${Connectives.not}a) ${Connectives.and} (b ${Connectives.or} z1) ${Connectives.and} (${Connectives.not}c ${Connectives.or} z1) ` +
                    `${Connectives.and} (${Connectives.not}z1 ${Connectives.or} d) ${Connectives.and} (${Connectives.not}z1 ${Connectives.or} e)`);
            });
        it(`(x AND y) OR (z AND NOTx) OR (NOTy AND NOTx AND NOTz) => ` +
            `${Quantifiers.existential}c1, ${Quantifiers.existential}c2: ` +
            `(x ${Connectives.or} c1) ${Connectives.and} (y ${Connectives.or} c1) ${Connectives.and} ` +
            `(${Connectives.not}c1 ${Connectives.or} z ${Connectives.or} c2) ${Connectives.and} ` +
            `(${Connectives.not}c1 ${Connectives.or} ${Connectives.not}x ${Connectives.or} c2) ${Connectives.and} ` +
            `(${Connectives.not}c2 ${Connectives.or} ${Connectives.not}y) ${Connectives.and} ` +
            `(${Connectives.not}c2 ${Connectives.or} ${Connectives.not}x) ${Connectives.and} ` +
            `(${Connectives.not}c2 ${Connectives.or} ${Connectives.not}z)`,
            () => {
                // arrange
                nnf = new NNF([
                    new NNF([new Literal("x"), new Literal("y")], Connectives.and),
                    new NNF([new Literal("z"), new Literal("x", true)], Connectives.and),
                    new NNF([new Literal("y", true), new Literal("x", true), new Literal("z", true)], Connectives.and),
                ], Connectives.or);

                // act
                const qcnf = PSGraph.convertNNFToCNF(nnf, "c");

                // assert
                expect(qcnf).toBeDefined();
                expect(qcnf.cnf).toBeDefined();
                expect(qcnf.quantifiedVariables).toBeDefined();
                expect(qcnf.quantifiedVariables.length).toBe(2);
                expect(qcnf.quantifiedVariables.some((v: QuantifiedVariable) => v.isUniversal)).toBe(false);
                expect(qcnf.toString()).toBe(
                    `${Quantifiers.existential}c1, ${Quantifiers.existential}c2: ` +
                    `(x ${Connectives.or} c1) ${Connectives.and} (y ${Connectives.or} c1) ${Connectives.and} ` +
                    `(${Connectives.not}c1 ${Connectives.or} z ${Connectives.or} c2) ${Connectives.and} ` +
                    `(${Connectives.not}c1 ${Connectives.or} ${Connectives.not}x ${Connectives.or} c2) ${Connectives.and} ` +
                    `(${Connectives.not}c2 ${Connectives.or} ${Connectives.not}y) ${Connectives.and} ` +
                    `(${Connectives.not}c2 ${Connectives.or} ${Connectives.not}x) ${Connectives.and} ` +
                    `(${Connectives.not}c2 ${Connectives.or} ${Connectives.not}z)`);
            });
        it(`a AND b AND C => (a) AND (b) AND (c)`, () => {
            // arrange
            nnf = new NNF([new Literal("a"), new Literal("b"), new Literal("c")], Connectives.and);

            // act
            const qcnf = PSGraph.convertNNFToCNF(nnf);

            // assert
            expect(qcnf).toBeDefined();
            expect(qcnf.cnf).toBeDefined();
            expect(qcnf.quantifiedVariables).toBeDefined();
            expect(qcnf.quantifiedVariables.length).toBe(0);
            expect(qcnf.quantifiedVariables.some((v: QuantifiedVariable) => v.isUniversal)).toBe(false);
            expect(qcnf.toString()).toBe(`(a) ${Connectives.and} (b) ${Connectives.and} (c)`);
        });
        it(`a OR b OR C => ` +
            `${Quantifiers.existential}z1, ${Quantifiers.existential}z2: (a ${Connectives.or} z1) ${Connectives.and} ` +
            `(${Connectives.not}z1 ${Connectives.or} b ${Connectives.or} z2) ${Connectives.and} (${Connectives.not}z2 ${Connectives.or} c)`, () => {
                // arrange
                nnf = new NNF([new Literal("a"), new Literal("b"), new Literal("c")], Connectives.or);

                // act
                const qcnf = PSGraph.convertNNFToCNF(nnf, "z");

                // assert
                expect(qcnf).toBeDefined();
                expect(qcnf.cnf).toBeDefined();
                expect(qcnf.quantifiedVariables).toBeDefined();
                expect(qcnf.quantifiedVariables.length).toBe(2);
                expect(qcnf.quantifiedVariables.some((v: QuantifiedVariable) => v.isUniversal)).toBe(false);
                expect(qcnf.toString()).toBe(`${Quantifiers.existential}z1, ${Quantifiers.existential}z2: (a ${Connectives.or} z1) ${Connectives.and} ` +
                    `(${Connectives.not}z1 ${Connectives.or} b ${Connectives.or} z2) ${Connectives.and} (${Connectives.not}z2 ${Connectives.or} c)`);
            });
        it(`a => (a)`, () => {
            // arrange
            nnf = new NNF([new Literal("a")]);

            // act
            const qcnf = PSGraph.convertNNFToCNF(nnf);

            // assert
            expect(qcnf).toBeDefined();
            expect(qcnf.cnf).toBeDefined();
            expect(qcnf.quantifiedVariables).toBeDefined();
            expect(qcnf.quantifiedVariables.length).toBe(0);
            expect(qcnf.quantifiedVariables.some((v: QuantifiedVariable) => v.isUniversal)).toBe(false);
            expect(qcnf.toString()).toBe(`(a)`);
        });
        it(`a (with connective AND) => (a)`, () => {
            // arrange
            nnf = new NNF([new Literal("a")], Connectives.and);

            // act
            const qcnf = PSGraph.convertNNFToCNF(nnf);

            // assert
            expect(qcnf).toBeDefined();
            expect(qcnf.cnf).toBeDefined();
            expect(qcnf.quantifiedVariables).toBeDefined();
            expect(qcnf.quantifiedVariables.length).toBe(0);
            expect(qcnf.quantifiedVariables.some((v: QuantifiedVariable) => v.isUniversal)).toBe(false);
            expect(qcnf.toString()).toBe(`(a)`);
        });
        it(`a (with connective OR) => (a)`, () => {
            // arrange
            nnf = new NNF([new Literal("a")], Connectives.or);

            // act
            const qcnf = PSGraph.convertNNFToCNF(nnf);

            // assert
            expect(qcnf).toBeDefined();
            expect(qcnf.cnf).toBeDefined();
            expect(qcnf.quantifiedVariables).toBeDefined();
            expect(qcnf.quantifiedVariables.length).toBe(0);
            expect(qcnf.quantifiedVariables.some((v: QuantifiedVariable) => v.isUniversal)).toBe(false);
            expect(qcnf.toString()).toBe(`(a)`);
        });
    });
});