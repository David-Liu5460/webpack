const path = require("path");

module.exports = function (env) {
    const isProd = env.production
    return {
        context: path.resolve(__dirname, '../'),
        // entry 写上相对路径 相对于context的路径
        entry: "./src/main.js",
        output: {
            path: path.resolve(__dirname, "../build")
        }

    }
}