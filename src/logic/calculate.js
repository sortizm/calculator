import Big from "big.js";

import operate from "./operate";
import isNumber from "./isNumber";

const RESET_OBJ = { total: null, next: null, operation: null, };

/**
 * Given a button name and a calculator data object, return an updated
 * calculator data object.
 *
 * Calculator data object contains:
 *   total:String      the running total
 *   next:String       the next number to be operated on with the total
 *   operation:String  +, -, etc.
 */
export default function calculate(obj, buttonName) {

  if (buttonName === "AC") {
    return RESET_OBJ;

  } else if (isNumber(buttonName)) {
    return calculateNumber(obj, buttonName);

  } else if (buttonName === ".") {
    return calculateDecimal(obj);

  } else if (buttonName === "=") {
    return calculateResult(obj);

  } else if (buttonName === "%") {
    return calculatePercentage(obj);

  } else if (buttonName === "+/-") {
    return calculateFlipSign(obj);

  } else {
    return calculateOperation(obj, buttonName);
  }

}

function calculateNumber(obj, buttonName) {

  if (buttonName === "0" && obj.next === "0") {
    return {};
  }
// If there is an operation, update next
  if (obj.operation) {
    if (obj.next) {
      return { next: obj.next + buttonName };
    }
    return { next: buttonName };
  }
// If there is no operation, update next and clear the value
  if (obj.next) {
    const next = obj.next === "0" ? buttonName : obj.next + buttonName;
    return {
      next,
      total: null,
    };
  }
  return {
    next: buttonName,
    total: null,
  };
}

function calculateDecimal(obj) {

  if (obj.next) {
    // ignore a . if the next number already has one
    if (obj.next.includes(".")) {
      return {};
    }
    return { next: obj.next + "." };
  }
  return { next: "0." };
}

function calculateResult(obj) {

  if (obj.next && obj.operation) {
    return {
      total: operate(obj.total, obj.next, obj.operation),
      next: null,
      operation: null,
    };
  } else {
    // '=' with no operation, nothing to do
    return {};
  }
}

function calculateOperation(obj, buttonName) {

  // User pressed an operation button and there is an existing operation
  if (obj.operation) {
    return {
      total: operate(obj.total, obj.next, obj.operation),
      next: null,
      operation: buttonName,
    };
  }

  // no operation yet, but the user typed one

  // The user hasn't typed a number yet, just save the operation
  if (!obj.next) {
    return { operation: buttonName };
  }

  // save the operation and shift 'next' into 'total'
  return {
    total: obj.next,
    next: null,
    operation: buttonName,
  };
}

function calculateFlipSign(obj) {

  if (obj.next) {
    return { next: (-1 * parseFloat(obj.next)).toString() };
  }
  if (obj.total) {
    return { total: (-1 * parseFloat(obj.total)).toString() };
  }
  return {};
}

function calculatePercentage(obj) {

  if (obj.operation && obj.next) {
    const result = operate(obj.total, obj.next, obj.operation);
    return {
      total: Big(result)
        .div(Big("100"))
        .toString(),
      next: null,
      operation: null,
    };
  }
  if (obj.next) {
    return {
      next: Big(obj.next)
        .div(Big("100"))
        .toString(),
    };
  }
  return {};
}
