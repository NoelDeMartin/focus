module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.graphql/,
                    use: 'raw-loader',
                },
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto',
                },
            ],
        },
    },
};
