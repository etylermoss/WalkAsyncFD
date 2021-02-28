/* 3rd party imports */
import * as fs from "fs";
import { join } from "path";

export type WalkCallback = (path: string, root: string, name: string) => any;
export type WalkAsyncCallback = (path: string, root: string, name: string) => Promise<any>;

export interface WalkOptions {
    /** If any of the filters occur in the file/dir name, item is not walked. */
    filters?: RegExp[];
    /** Skip hidden files & directories. (Default: false) */
    skipHidden?: boolean;
    /** Called on the result of an error, with said error, e.g. cannot access directory. */
    errCb?: (err: any) => any;
}

/**
 * Test if any of the filter patterns exist in the given string.
 * @param str String to test.
 * @param filters RegExp array to test the string against.
 */
const filtered = (str: string, filters: RegExp[]): boolean => {
    for (const filter of filters) 
        if (filter.test(str))
            return true;

    return false;
};

/**
 * Walk recursively through a directory asynchronously, calling the
 * callback (cb) function for each file. Order is not guaranteed, and
 * likely will be very random.
 * @param path Path to starting point, will throw if not a directory.
 * @param cb Function to call on each file.
 * @param options Options.
 */
export const walkAsync = async (
    path: string,
    cb: WalkAsyncCallback,
    options?: WalkOptions,
): Promise<void> => {
    /* open current directory */
    const dir = await fs.promises.opendir(path);
    let dirent: fs.Dirent | null;

    /* for each dirent */
    while ((dirent = await dir.read()) !== null)
    {
        const isFiltered = options?.filters && filtered(dirent.name, options.filters);
        const isHidden = options?.skipHidden && dirent.name[0] == ".";
        const filePath = join(path, dirent.name);

        /* if the dirent name is filtered or hidden, skip it */
        if (isFiltered || isHidden)
            continue;

        /* catch exception, close dir handle, and re-throw */
        try
        {
            /* run callback if file */
            if (dirent.isFile())
                await cb(filePath, path, dirent.name);
            /* recurse if directory */
            else if (dirent.isDirectory())
                await walkAsync(filePath, cb, options);
        }
        catch (err)
        {
            if (options?.errCb)
                options.errCb(err);

            await dir.close();
            throw err;
        }
    }

    await dir.close();
};

/**
 * Walk recursively through a directory, calling the callback (cb) function
 * for each file. Order is not guaranteed, and likely will be very random.
 * @param path Path to starting point, will throw if not a directory.
 * @param cb Function to call on each file.
 * @param options Options.
 */
export const walk = (
    path: string,
    cb: WalkCallback,
    options?: WalkOptions,
): void => {
    const dir = fs.opendirSync(path);
    let dirent: fs.Dirent | null;

    while ((dirent = dir.readSync()) !== null)
    {
        const isFiltered = options?.filters && filtered(dirent.name, options.filters);
        const isHidden = options?.skipHidden && dirent.name[0] == ".";
        const filePath = join(path, dirent.name);

        if (isFiltered || isHidden)
            continue;
        
        try
        {
            if (dirent.isFile())
                cb(filePath, path, dirent.name);
            else if (dirent.isDirectory())
                walk(filePath, cb, options);
        }
        catch (err)
        {
            if (options?.errCb)
                options.errCb(err);

            dir.closeSync();
            throw err;
        }
    }

    dir.closeSync();
};