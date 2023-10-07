module.exports = {
    "presets": [
        ["@babel/preset-env", {
            // false usage entry
            // core-js/stable regenerator-runtime/runtime
            useBuiltIns: "usage",
            corejs: 3.8
        }],
        ["@babel/preset-react"],
        ["@babel/preset-typescript"]
    ],
    plugins: [
        ["react-refresh/babel"]
    ]
}