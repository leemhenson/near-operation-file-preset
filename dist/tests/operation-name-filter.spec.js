"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const index_1 = require("../src/index");
describe('near-operation-file preset', () => {
    const schemaDocumentNode = (0, graphql_1.parse)(/* GraphQL */ `
    type Query {
      user(id: String): User!
    }

    type User {
      id: ID!
      profile: Profile!
      email: String!
      username: String!
    }

    type Profile {
      name: String!
      age: Int!
    }
  `);
    const schemaNode = (0, graphql_1.buildASTSchema)(schemaDocumentNode);
    const anonymousOperationAst = (0, graphql_1.parse)(/* GraphQL */ `
    query {
      user {
        id
        ...UserFields
      }
    }
  `);
    const getUserPrivateOperationAst = (0, graphql_1.parse)(/* GraphQL */ `
    query GetUserPrivate {
      user {
        id
        email
        ...UserFields
      }
    }
  `);
    const getUserPublicOperationAst = (0, graphql_1.parse)(/* GraphQL */ `
    query GetUserPublic {
      user {
        id
        ...UserFields
      }
    }
  `);
    const fragmentAst = (0, graphql_1.parse)(/* GraphQL */ `
    fragment UserFields on User {
      id
      username
    }
  `);
    const testDocuments = [
        {
            location: '/some/deep/path/src/graphql/me-query.graphql',
            document: getUserPrivateOperationAst,
        },
        {
            location: '/some/deep/path/src/graphql/user-fragment.graphql',
            document: fragmentAst,
        },
        {
            location: '/some/deep/path/src/graphql/me.query.graphql',
            document: getUserPrivateOperationAst,
        },
        {
            location: '/some/deep/path/src/graphql/something-query.graphql',
            document: getUserPublicOperationAst,
        },
        {
            location: '/some/deep/path/src/graphql/nested/somethingElse.graphql',
            document: getUserPublicOperationAst,
        },
        {
            location: '/some/deep/path/src/graphql/nested/from-js.js',
            document: anonymousOperationAst,
        },
        {
            location: '/some/deep/path/src/graphql/component.ts',
            document: anonymousOperationAst,
        },
    ];
    it('Should build operation file paths for all files when the default filter is in use', async () => {
        const result = await index_1.preset.buildGeneratesSection({
            baseOutputDir: './src/',
            config: {},
            presetConfig: {
                baseTypesPath: 'types.ts',
            },
            schemaAst: schemaNode,
            schema: schemaDocumentNode,
            documents: testDocuments,
            plugins: [],
            pluginMap: {},
        });
        expect(result.map(a => a.filename)).toEqual([
            '/some/deep/path/src/graphql/me-query.generated.ts',
            '/some/deep/path/src/graphql/user-fragment.generated.ts',
            '/some/deep/path/src/graphql/me.query.generated.ts',
            '/some/deep/path/src/graphql/something-query.generated.ts',
            '/some/deep/path/src/graphql/nested/somethingElse.generated.ts',
            '/some/deep/path/src/graphql/nested/from-js.generated.ts',
            '/some/deep/path/src/graphql/component.generated.ts',
        ]);
    });
    it('Should build operation file paths only for those operations that match the Private filter', async () => {
        const result = await index_1.preset.buildGeneratesSection({
            baseOutputDir: './src/',
            config: {},
            presetConfig: {
                baseTypesPath: 'types.ts',
                operationNameFilter: 'Private$',
            },
            schemaAst: schemaNode,
            schema: schemaDocumentNode,
            documents: testDocuments,
            plugins: [],
            pluginMap: {},
        });
        expect(result.map(a => a.filename)).toEqual([
            '/some/deep/path/src/graphql/me-query.generated.ts',
            '/some/deep/path/src/graphql/user-fragment.generated.ts',
            '/some/deep/path/src/graphql/me.query.generated.ts',
        ]);
    });
    it('Should build operation file paths only for those operations that match the Public filter', async () => {
        const result = await index_1.preset.buildGeneratesSection({
            baseOutputDir: './src/',
            config: {},
            presetConfig: {
                baseTypesPath: 'types.ts',
                operationNameFilter: 'Public$',
            },
            schemaAst: schemaNode,
            schema: schemaDocumentNode,
            documents: testDocuments,
            plugins: [],
            pluginMap: {},
        });
        expect(result.map(a => a.filename)).toEqual([
            '/some/deep/path/src/graphql/user-fragment.generated.ts',
            '/some/deep/path/src/graphql/something-query.generated.ts',
            '/some/deep/path/src/graphql/nested/somethingElse.generated.ts',
        ]);
    });
});
//# sourceMappingURL=operation-name-filter.spec.js.map