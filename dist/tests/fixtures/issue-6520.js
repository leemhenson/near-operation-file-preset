"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuery = exports.userFields = void 0;
const tslib_1 = require("tslib");
const graphql_tag_1 = (0, tslib_1.__importDefault)(require("graphql-tag"));
exports.userFields = (0, graphql_tag_1.default) `
  fragment userFields on User {
    email
    username
  }
`;
exports.userQuery = (0, graphql_tag_1.default) `
  query UserQuery {
    user(id: "123") {
      id
      ...userFields
    }
  }
`;
//# sourceMappingURL=issue-6520.js.map