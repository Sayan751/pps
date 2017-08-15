import { AbstractCNFBasedAlgo } from "../../src/algo/AbstractCNFBasedAlgo";
describe("AbstractCNFBasedAlgo test suite", () => {
    class MockAbstractCNFBasedAlgo extends AbstractCNFBasedAlgo { }
    it("A call to isSat should cause exception", () => {
        expect(() => MockAbstractCNFBasedAlgo.isSat("a AND b")).toThrowError();
    });
});