"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A = exports.B = exports.C = void 0;
const graphql_request_1 = require("graphql-request");
exports.C = (0, graphql_request_1.gql) `
  query A {
    a
  }
`;
exports.B = (0, graphql_request_1.gql) `
  query B {
    a
  }
`;
exports.A = (0, graphql_request_1.gql) `
  query C {
    a
  }
`;
//# sourceMappingURL=issue-6439.js.map