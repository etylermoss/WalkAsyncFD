/* 3rd party imports */
import { join } from "path";
import { open } from 'fs/promises';

/* 1st party imports */
import { walkAsync, WalkOptions } from "../src/index";

const walkOpts: WalkOptions = {
    filters: [/node_modules/],
    skipHidden: true,
    errCb: (err) => console.error(err),
};

/* Print the path and size of all files from the directory given at argv[2] */
const main = async () =>
{
    await walkAsync(process.argv[2], async (path, root, name) => {
        try {
            const file = await open(path, 'r');
            const size = (await file.stat()).size;
    
            console.log(`File: ${join(root, name)} is ${size} bytes.`);
        } catch {
            console.error(`Error reading file in walk callback: ${path}`);
        }
    }, walkOpts).catch(err => console.error("Could not open root file: ", err));
};

main();