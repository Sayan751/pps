// import "babel-polyfill"
// import { Literal } from "../../src/core/Literal";
// import { Clause } from "../../src/core/Clause";
// import { CNF } from "../../src/core/CNF";
// import { IndependentSetSATChecker } from "../../src/independentSet/IndependentSetSATChecker";

// describe("IndependentSetSATChecker test suite", () => {
//     it("inconsistent cnf should not be satisfiable", () => {
//         const cnf = new CNF([
//             new Clause([new Literal("x")]),
//             new Clause([new Literal("x", true)]),
//         ]);

//         expect(IndependentSetSATChecker.isSat(cnf)).toBe(false);
//     });

//     it("consistent cnf should be satisfiable", () => {
//         const cnf = new CNF([
//             new Clause([new Literal("x"), new Literal("y")]),
//             new Clause([new Literal("x", true), new Literal("y", true)]),
//         ]);

//         expect(IndependentSetSATChecker.isSat(cnf)).toBe(true);
//     });
// });