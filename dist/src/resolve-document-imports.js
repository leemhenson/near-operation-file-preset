"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDocumentImports = void 0;
const tslib_1 = require("tslib");
const plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const fragment_resolver_1 = (0, tslib_1.__importDefault)(require("./fragment-resolver"));
/**
 * Transform the preset's provided documents into single-file generator sources, while resolving fragment and user-defined imports
 *
 * Resolves user provided imports and fragment imports using the `DocumentImportResolverOptions`.
 * Does not define specific plugins, but rather returns a string[] of `importStatements` for the calling plugin to make use of
 */
function resolveDocumentImports(presetOptions, schemaObject, importResolverOptions, operationNameFilter, dedupeFragments = false) {
    const resolveFragments = (0, fragment_resolver_1.default)(importResolverOptions, presetOptions, schemaObject, dedupeFragments);
    const { baseOutputDir, documents } = presetOptions;
    const { generateFilePath, schemaTypesSource, baseDir, typesImport } = importResolverOptions;
    return documents.map(documentFile => {
        try {
            const generatedFilePath = generateFilePath(documentFile.location);
            const importStatements = [];
            const { externalFragments, fragmentImports } = resolveFragments(generatedFilePath, documentFile.document);
            if ((0, plugin_helpers_1.isUsingTypes)(documentFile.document, externalFragments.map(m => m.name), schemaObject)) {
                const schemaTypesImportStatement = (0, visitor_plugin_common_1.generateImportStatement)({
                    baseDir,
                    importSource: (0, visitor_plugin_common_1.resolveImportSource)(schemaTypesSource),
                    baseOutputDir,
                    outputPath: generatedFilePath,
                    typesImport,
                });
                importStatements.unshift(schemaTypesImportStatement);
            }
            const filteredDefinitions = documentFile.document.definitions.reduce((accumulator, definition) => {
                var _a;
                if (definition.kind !== 'OperationDefinition') {
                    return [...accumulator, definition];
                }
                const operationName = ((_a = definition.name) === null || _a === void 0 ? void 0 : _a.value) || '';
                return operationNameFilter.test(operationName) ? [...accumulator, definition] : accumulator;
            }, []);
            const filteredDocumentFile = {
                ...documentFile,
                document: {
                    ...documentFile.document,
                    definitions: filteredDefinitions,
                },
            };
            return {
                filename: generatedFilePath,
                documents: [filteredDocumentFile],
                importStatements,
                fragmentImports,
                externalFragments,
            };
        }
        catch (e) {
            throw new plugin_helpers_1.DetailedError(`Unable to validate GraphQL document!`, `
  File ${documentFile.location} caused error:
    ${e.message || e.toString()}
        `, documentFile.location);
        }
    });
}
exports.resolveDocumentImports = resolveDocumentImports;
//# sourceMappingURL=resolve-document-imports.js.map