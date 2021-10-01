"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAndFriendQuery = exports.limitedUserFieldsQuery = void 0;
const tslib_1 = require("tslib");
const graphql_tag_1 = (0, tslib_1.__importDefault)(require("graphql-tag"));
const issue_6546_fragments_1 = require("./issue-6546-fragments");
exports.limitedUserFieldsQuery = (0, graphql_tag_1.default) `
  query user {
    user(id: "1") {
      ...usernameFragment
    }
  }

  ${issue_6546_fragments_1.usernameFragment}
`;
exports.userAndFriendQuery = (0, graphql_tag_1.default) `
  query allUserFields {
    user(id: "1") {
      ...userFields
    }

    friend: user(id: "2") {
      ...usernameFragment
    }
  }

  ${issue_6546_fragments_1.userFields}
  ${issue_6546_fragments_1.usernameFragment}
`;
//# sourceMappingURL=issue-6546-queries.js.map