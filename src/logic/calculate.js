import isNumber from "./isNumber";

const RESET_OBJ = { total: null, operations: null, };

export default function calculate(obj, buttonName) {

  if (buttonName === "AC") {
    return RESET_OBJ;
  } else if (buttonName === "=") {
    return operate(obj.operations);
  } else {
    return { operations: (obj.operations || "") + buttonName }
  }
}

function operationFromButtonName(buttonName) {

  if (buttonName === "+") {
    return "+";
  } else if (buttonName === "-") {
    return "-";
  } else if (buttonName === "x") {
    return "*";
  } else if (buttonName === "÷") {
    return "/";
  } else if (buttonName === ".") {
    return ".";
  } else if (buttonName === "(") {
    return "(";
  } else if (buttonName === ")") {
    return ")";
  } else if (isNumber(buttonName)) {
    return buttonName;
  } else {
    return "";
  }
}

function operate(operations) {
  if (operations == null) {
    return;
  }
  let sanitisedOperations = operations.split("").map(operationFromButtonName).join("");
  let total;
  try {
    total = eval(sanitisedOperations);
  } catch (err) {
    total = "Math error";
  }
  return { total: total, operations: null, }
}
