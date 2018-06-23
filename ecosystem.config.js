module.exports = {
    apps: [{
        name: "zed",
        script: "./main.js",
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        },
        exec_mode: "cluster"
    }]
}