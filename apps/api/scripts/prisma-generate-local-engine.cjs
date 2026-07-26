const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { dirname, join } = require('node:path');

const prismaDir = dirname(require.resolve('prisma/package.json'));
const enginesDir = dirname(require.resolve('@prisma/engines/package.json', { paths: [prismaDir] }));
const engineTarget = `${process.platform}-${process.arch}`;

const enginesByTarget = {
  'darwin-arm64': {
    query: 'libquery_engine-darwin-arm64.dylib.node',
    schema: 'schema-engine-darwin-arm64'
  },
  'darwin-x64': {
    query: 'libquery_engine-darwin.dylib.node',
    schema: 'schema-engine-darwin'
  },
  'linux-x64': {
    query: 'libquery_engine-debian-openssl-3.0.x.so.node',
    schema: 'schema-engine-debian-openssl-3.0.x'
  },
  'linux-arm64': {
    query: 'libquery_engine-linux-arm64-openssl-3.0.x.so.node',
    schema: 'schema-engine-linux-arm64-openssl-3.0.x'
  }
};

const engines = enginesByTarget[engineTarget];

if (engines) {
  const queryEngine = join(enginesDir, engines.query);
  const schemaEngine = join(enginesDir, engines.schema);

  if (existsSync(queryEngine)) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = queryEngine;
  }

  if (existsSync(schemaEngine)) {
    process.env.PRISMA_SCHEMA_ENGINE_BINARY = schemaEngine;
  }
}

const result = spawnSync('prisma', ['generate'], {
  env: process.env,
  shell: true,
  stdio: 'inherit'
});

process.exit(result.status ?? 1);
