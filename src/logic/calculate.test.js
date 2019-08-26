import calculate from "./calculate";
import chai from "chai";

// https://github.com/chaijs/chai/issues/469
chai.config.truncateThreshold = 0;

const expect = chai.expect;

function pressButtons(buttons) {
  const value = {};
  buttons.forEach(button => {
    Object.assign(value, calculate(value, button));
  });
  // no need to distinguish between null and undefined values
  Object.keys(value).forEach(key => {
    if (value[key] === null) {
      delete value[key];
    }
  });
  return value;
}

function expectButtons(buttons, expectation) {
  expect(pressButtons(buttons)).to.deep.equal(expectation);
}

function test(buttons, expectation, only = false) {
  const func = only ? it.only : it;
  func(`buttons ${buttons.join(",")} -> ${JSON.stringify(expectation)}`, () => {
    expectButtons(buttons, expectation);
  });
}

describe("calculate", function() {
  test(["6"], { operations: "6" });

  test(["6", "6"], { operations: "66" });

  test(["6", "+", "6"], {
    operations: "6+6",
  });

  test(["6", "+", "6", "="], {
    total: 12,
  });

  test(["6", "+", "6", "=", "9"], {
    operations: "9",
    total: 12,
  });

  test(["3", "+", "6", "=", "+"], {
    total: 9,
    operations: "+",
  });

  test(["3", "+", "6", "=", "+", "9"], {
    total: 9,
    operations: "+9",
  });

  test(["3", "+", "6", "=", "+", "9", "="], {
    total: 9,
  });

  // When '=' is pressed and there is not enough information to complete
  // an operation, the '=' should be disregarded.
  test(["3", "+", "=", "3", "="], {
    total: 3,
  });

  test(["+"], {
    operations: "+",
  });

  test(["+", "2"], {
    operations: "+2",
  });

  test(["+", "2", "+"], {
    operations: "+2+",
  });

  test(["+", "2", "+", "+"], {
    operations: "+2++",
  });

  test(["+", "2", "+", "5"], {
    operations: "+2+5",
  });

  test(["+", "2", "5"], {
    operations: "+25",
  });

  test(["+", "6", "+", "5", "="], {
    total: 11,
  });

  test(["0", ".", "4"], {
    operations: "0.4",
  });

  test([".", "4"], {
    operations: ".4",
  });

  test([".", "4", "-", ".", "2"], {
    operations: ".4-.2",
  });

  test([".", "4", "-", ".", "2", "="], {
    total: 0.2,
  });

  // should clear the operator when AC is pressed
  test(["1", "+", "2", "AC"], {});
  test(["+", "2", "AC"], {});

  //Test that pressing the multiplication or division sign multiple times should not affect the current computation
  test(["2", "x", "x"], {
    operations: "2xx"
  });

  test(["2", "÷", "÷"], {
    operations: "2÷÷"
  });

  test(["2", "÷", "x", "+", "-", "x"], {
    operations: '2÷x+-x'
  });
});
