"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = exports.usernameFragment = void 0;
const tslib_1 = require("tslib");
const graphql_tag_1 = (0, tslib_1.__importDefault)(require("graphql-tag"));
exports.usernameFragment = (0, graphql_tag_1.default) `
  fragment usernameFragment on User {
    username
  }
`;
exports.userFields = (0, graphql_tag_1.default) `
  fragment userFields on User {
    ...usernameFragment
    email
  }

  ${exports.usernameFragment}
`;
//# sourceMappingURL=issue-6546-fragments.js.map