// config-overrides.js
module.exports = function override(config, env) {
    // New config, e.g. config.plugins.push...
    
    config.resolve = {
        ...config.resolve,
        fallback: { crypto: false }
    }
    return config
}