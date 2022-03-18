const path = require('path');

module.exports = (env) => {
  const { mode = 'development' } = env;

  return {
    mode,
    devtool: mode === 'development' ? 'inline-cheap-module-source-map' : 'source-map',
    entry: './src/development/index.tsx',
    output: {
      filename: 'affix.js',
      path: path.resolve(__dirname, 'docs')
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['tailwindcss']
                }
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    stats: "minimal",
    devServer: {
      open: true,
      port: 8080,
      compress: true,
      watchFiles: ['src/**/*'],
      static: {
        directory: path.join(process.cwd(), 'docs'),
        serveIndex: true
      }
    }
  };
};