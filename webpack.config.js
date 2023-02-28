const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        assetModuleFilename: 'assets/[hash][ext][query]',
    },
    module: {
        rules: [
            {
                test: /\.(mtl|obj|vox)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(png)$/,
                type: 'asset/resource',
                generator: {
                    filename: "assets/[name][ext]"
                }
            }
        ]
    }
};