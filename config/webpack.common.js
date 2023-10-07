const path = require("path");

module.exports = function (env) {
    return {
        entry: "./src/main.js",
        output: {
            path: path.resolve(__dirname, "../build")
        }

    }
}