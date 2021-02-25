/* 3rd party imports */
import { join } from 'path';

/* 1st party imports */
import { walkAsync, WalkOptions } from '../src/index';

const walkOpts: WalkOptions = {
    write: false,
    filters: [/node_modules/],
    skipHidden: true,
    errCb: (err) => console.error(err),
};

/* Print the path and size of all files from the directory given at argv[2] */
const main = async () =>
{
    await walkAsync(process.argv[2], async (fh, root, name) => {
        const stats = await fh.stat();
        const size = stats.size;
        console.log(`File: ${join(root, name)} is ${size} bytes.`);
    }, walkOpts);
};

main();