import { buildASTSchema, parse } from 'graphql';
import { preset } from '../src/index';

describe('near-operation-file preset', () => {
  const schemaDocumentNode = parse(/* GraphQL */ `
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
  const schemaNode = buildASTSchema(schemaDocumentNode);
  const anonymousOperationAst = parse(/* GraphQL */ `
    query {
      user {
        id
        ...UserFields
      }
    }
  `);
  const getUserPrivateOperationAst = parse(/* GraphQL */ `
    query GetUserPrivate {
      user {
        id
        email
        ...UserFields
      }
    }
  `);
  const getUserPublicOperationAst = parse(/* GraphQL */ `
    query GetUserPublic {
      user {
        id
        ...UserFields
      }
    }
  `);
  const fragmentAst = parse(/* GraphQL */ `
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
    const result = await preset.buildGeneratesSection({
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
    const result = await preset.buildGeneratesSection({
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
    const result = await preset.buildGeneratesSection({
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
