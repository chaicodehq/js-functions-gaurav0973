/**
 * 🍛 Highway Dhaba Rating System - Higher-Order Functions
 *
 * Highway pe dhabas ki rating system bana raha hai. Higher-order functions
 * (HOF) use karne hain — aise functions jo doosre functions ko parameter
 * mein lete hain YA return karte hain.
 *
 * Functions:
 *
 *   1. createFilter(field, operator, value)
 *      - Returns a FUNCTION that filters objects
 *      - Operators: ">", "<", ">=", "<=", "==="
 *      - e.g., createFilter("rating", ">=", 4) returns a function that
 *        takes an object and returns true if object.rating >= 4
 *      - Unknown operator => return function that always returns false
 *
 *   2. createSorter(field, order = "asc")
 *      - Returns a COMPARATOR function for Array.sort()
 *      - order "asc" => ascending, "desc" => descending
 *      - Works with both numbers and strings
 *
 *   3. createMapper(fields)
 *      - fields: array of field names, e.g., ["name", "rating"]
 *      - Returns a function that takes an object and returns a new object
 *        with ONLY the specified fields
 *      - e.g., createMapper(["name"])({name: "Dhaba", rating: 4}) => {name: "Dhaba"}
 *
 *   4. applyOperations(data, ...operations)
 *      - data: array of objects
 *      - operations: any number of functions to apply SEQUENTIALLY
 *      - Each operation takes an array and returns an array
 *      - Apply first operation to data, then second to result, etc.
 *      - Return final result
 *      - Agar data not array, return []
 *
 * Hint: HOF = functions that take functions as arguments or return functions.
 *   createFilter returns a function. applyOperations takes functions as args.
 *
 * @example
 *   const highRated = createFilter("rating", ">=", 4);
 *   highRated({ name: "Punjab Dhaba", rating: 4.5 }) // => true
 *
 *   const byRating = createSorter("rating", "desc");
 *   [{ rating: 3 }, { rating: 5 }].sort(byRating)
 *   // => [{ rating: 5 }, { rating: 3 }]
 */
export function createFilter(field, operator, value) {
  const ops = {
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
    "===": (a, b) => a === b
  };

  if (!ops[operator]) {
    return () => false;
  }

  return function (obj) {
    if (!obj || typeof obj !== "object") return false;
    return ops[operator](obj[field], value);
  };
}

export function createSorter(field, order = "asc") {
  const multiplier = order === "desc" ? -1 : 1;

  return function (a, b) {
    const valA = a?.[field];
    const valB = b?.[field];

    if (valA === valB) return 0;

    if (typeof valA === "string" && typeof valB === "string") {
      return valA.localeCompare(valB) * multiplier;
    }

    return (valA > valB ? 1 : -1) * multiplier;
  };
}

export function createMapper(fields) {
  if (!Array.isArray(fields)) {
    return () => ({});
  }

  return function (obj) {
    const result = {};
    if (!obj || typeof obj !== "object") return result;

    for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      if (key in obj) {
        result[key] = obj[key];
      }
    }

    return result;
  };
}

export function applyOperations(data, ...operations) {
  if (!Array.isArray(data)) return [];

  let result = data;

  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    if (typeof op === "function") {
      result = op(result);
      if (!Array.isArray(result)) return [];
    }
  }

  return result;
}

