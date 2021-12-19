const functions =  require("./functions/index");

// loop on all functions exported from the functions folder to use those
Object.keys(functions).forEach((key) => {
    exports[key] = functions[key];
});