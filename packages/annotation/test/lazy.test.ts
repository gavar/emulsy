import { lazy } from "../src/lazy";

describe("lazy", () => {
  it("throw when setter", () => {
    expect(() => {
        class T {
          @lazy
          set v(value: any) { }
        }
      },
    ).toThrow();
  });
  it("throw when getter + setter", () => {
    expect(() => {
      class T {
        @lazy
        get v(): any {return null;}
        set v(value: any) { }
      }
    }).toThrow();
  });
  it("getter", () => {
    class T {
      @lazy
      get v(): number { return Math.random(); }
    }
    const study = new T;
    expect(study.v).toStrictEqual(study.v);
  });

  it("getter accessing this", () => {
    class T {
      @lazy
      get v(): number { return this.random(); }
      random() { return Math.random();}
    }
    const study = new T;
    expect(study.v).toStrictEqual(study.v);
  });
});

describe("lazy.factory", () => {
  it("array property", () => {
    class T {@lazy.factory(Array) v: any[];}
    expectProperty(new T, "v", []);
  });
  it("array of length property", () => {
    class T {@lazy.factory(Array, 2) v: any[];}
    expectProperty(new T, "v", new Array(2));
  });
  it("constant property", () => {
    const awaiting = "test";
    class T {@lazy.factory(() => awaiting) v: string;}
    expectProperty(new T, "v", awaiting);
  });
  it("instance private factory", () => {
    class T {
      @lazy.factory(T.prototype.calculate) v: string;
      private calculate() { return this.constructor.name; }
    }
    expectProperty(new T, "v", "T");
  });
  it("should throw when constructor", () => {
    class T {@lazy.factory(Example as any) v: Example;}
    expect(() => new T().v).toThrow();
  });
});

describe("lazy.ctor", () => {
  it("array property", () => {
    class T {@lazy.ctor(Array) v: any[];}
    expectProperty(new T, "v", []);
  });
  it("array of length property", () => {
    class T {@lazy.ctor(Array, 2) v: any[];}
    expectProperty(new T, "v", new Array(2));
  });
  it("class property", () => {
    class T {@lazy.ctor(Example) v: Example;}
    expectProperty(new T, "v", new Example());
  });
  it("class property with params", () => {
    class T {@lazy.ctor(ExampleParams, 1488) v: ExampleParams;}
    expectProperty(new T, "v", new ExampleParams(1488));
  });
  it("should throw when arrow function", () => {
    class T {@lazy.ctor((() => {}) as any) v: any;}
    expect(() => new T().v).toThrow();
  });
});

class Example {}
class ExampleParams {constructor(readonly num: number) { }}

function expectProperty<T extends object, K extends keyof T, V>(study: T, key: K, value: V) {
  // no value before access
  expect(study.hasOwnProperty(key)).toBe(false);

  // check prototype property definition
  const base = Reflect.getOwnPropertyDescriptor(Object.getPrototypeOf(study), key);
  expect(base.writable).toBeUndefined();
  expect(base.enumerable).toBe(true);
  expect(base.configurable).toBe(true);

  // access + check property value
  expect(study[key]).toStrictEqual(value);
  expect(study.hasOwnProperty(key)).toBe(true);

  // check property definition
  const prop = Reflect.getOwnPropertyDescriptor(study, key);
  expect(prop.writable).toBe(true);
  expect(prop.enumerable).toBe(true);
  expect(prop.configurable).toBe(true);
}
