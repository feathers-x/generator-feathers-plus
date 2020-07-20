
// Define the combined GraphQL schema. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

let moduleExports = `
# Nedb1 database.
type Nedb1 {
  # Description 1 generic cumulative
  id: ID
  # Description 1 generic cumulative
  _id: ID
  # Description 1 generic cumulative
  nedb2Id: ID
  # Description 1 generic cumulative object
  testObject: Testobject
  testArray: [JSON]
  # TestArray2 Desc
  testArray2: [Testobject]
  # Description 1 generic cumulative string
  testString: String
  multiType: Float
  # Description 1 generic cumulative add
  nedb2: Nedb2!
}
 
# Nedb2 database.
type Nedb2 {
  id: ID
  _id: ID
  nedb1Id: ID
  nedb1: Nedb1!
}
 
# Description 1 generic cumulative object
type Testobject {
  # This is nested Object
  name: String
}

type Query {
  getNedb1(key: JSON, query: JSON, params: JSON): Nedb1
  findNedb1(query: JSON, params: JSON): [Nedb1]!
  getNedb2(key: JSON, query: JSON, params: JSON): Nedb2
  findNedb2(query: JSON, params: JSON): [Nedb2]!
}
`;

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
