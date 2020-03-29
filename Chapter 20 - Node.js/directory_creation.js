/*
 
 2 - Directory Creation (29/3/2020)

 Though the DELETE method in our file server is able to delete directories (using `rmdir`), the server currently does not provide any way to create a directory.

 Add support for the MKCOL method (“make collection”), which should create a directory by calling mkdir`` from the `fs`` module. MKCOL is not a widely used HTTP method, but it does exist for this same purpose in the WebDAV standard, which specifies a set of conventions on top of HTTP that make it suitable for creating documents.
*/

import { promises as mkdir} from "fs";

methods.MKCOL = async function(request) {
    let path = urlPath(request.url);
    let stats;

    try {
        stats = await stat(path);
    }
    catch(err) {
        if (err.code != "ENOENT")
            throw err;
        
        await mkdir(path);
        return {
            status: 204
        };
    }

    if (stats.isDirectory())
        return {
            status:204
        };
    else
        return {
            status: 400,
            body: "Not a directory"
        };
};