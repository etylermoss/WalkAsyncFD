# WalkAsyncFD
Modern (A)synchronous walk implementation using TypeScript.

[![npm version](https://badge.fury.io/js/walk-async-fd.svg)](https://badge.fury.io/js/walk-async-fd)

Simple directory / file walker, written using modern TypeScript. I found the implementation [npm/walk](https://www.npmjs.com/package/walk) to be 
unsuited for my purposes, as well as having a very messy codebase, being written before Node.js had
async/await.

## Installation:
```sh
$> npm install walk-async-fd
```

## Example:

```sh
$> npm run example # runs `node example/index.js .`

# Prints size of all files in this directory
File: README.md is 106 bytes.
File: LICENSE is 1072 bytes.
File: package.json is 813 bytes.
File: package-lock.json is 664 bytes.
File: tsconfig.json is 258 bytes.
File: src/index.js is 7547 bytes.
File: src/index.ts is 4088 bytes.
File: example/index.js is 3886 bytes.
File: example/index.ts is 621 bytes.
```

## Async/Sync:
Comes with both an Aynchronous and Synchronous version, syntax is virtually identical.
```ts
import { walkAsync, walk } from "walk-async-fd";

walkAsync(process.argv[2], async (path) => {
    const file = await fs.promises.open(path, 'r'); // make sure to catch, see example/index.ts
    const size = (await file.stat()).size;
    ...
});

walk(process.argv[2], (path) => {
    const size = fs.statSync(path).size;
    ...
});
```

## License:
`walk-async-fd` is available under the MIT License, see LICENSE.

Copyright (c) 2021 Eden Tyler-Moss.