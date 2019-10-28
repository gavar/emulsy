import { KeySet } from "..";

describe("KeySet", () => {
  const keys = ["a", "b"];
  const object = {a: true, b: false};
  function test(keySet: KeySet, expected: Array<any>) {
    expect(Object.keys(keySet)).toEqual(expected);
  }

  describe("new", () => {
    it("empty", () => test(new KeySet(), []));
    it("array", () => test(new KeySet(keys), keys));
    it("rest", () => test(new KeySet(...keys), keys));
    it("object", () => test(new KeySet(object), keys));
  });

  describe("construct", () => {
    it("empty", () => test(KeySet(), []));
    it("array", () => test(KeySet(keys), keys));
    it("rest", () => test(KeySet(...keys), keys));
    it("object", () => test(KeySet(object), keys));
  });
});

