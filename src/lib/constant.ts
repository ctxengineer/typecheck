

export const commonTSCodes: string[] = [
  "TS2304", // Cannot find name
  "TS2307", // Cannot find module
  "TS2339", // Property does not exist
  "TS2322", // Type not assignable
  "TS2345", // Argument type mismatch
  "TS2551", // Property does not exist (with suggestion)
  "TS2554", // Wrong number of arguments
  "TS2559", // No property overlap
  "TS2532",  // Object possibly undefined
  "TS2355", // A function whose declared type is neither 'void' nor 'any' must return a value
  "TS2367", // This condition will always return true/false
  "TS2364", // Variable declared but its value is never read
  "TS2415"  // Class incorrectly implements interface
];

export const implicitlyAnyTSCodes: string[] = [
  "TS7031", // Implicit any in binding
  "TS7006", // Parameter 'x' implicitly has an 'any' type
  "TS7015", // Element implicitly has an 'any' type because index expression is not typed
  "TS7022", // 'x' implicitly has type 'any' because no type annotation
  "TS7043", // Variable implicitly has type 'any'
];
