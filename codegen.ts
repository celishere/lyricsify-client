import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://YOUR_HOST/api/graphql",
  documents: ["src/entities/**/*.ts"],
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    "./src/shared/api/graphql/generated/": {
      preset: "client",
      plugins: [],
      config: {
        avoidOptionals: false,
        dedupeFragments: true
      },
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false
      },
    },
  }
};

export default config;
