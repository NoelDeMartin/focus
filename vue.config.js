module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.graphql/,
                    use: 'raw-loader',
                },
            ],
        },
    },
};
