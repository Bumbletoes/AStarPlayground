/// <reference path="../../typings/globals/jasmine/index.d.ts" />

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    let test : String = "hi";
    console.log(test);
    expect(true).toBe(true);
  });
});