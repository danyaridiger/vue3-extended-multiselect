module.exports = {
  "presets": [
    ["@vue/cli-plugin-babel/preset", 
      {
      "useBuiltIns": false
      }
    ]
  ],
  plugins: ['@babel/transform-runtime', 'babel-plugin-transform-import-meta'],
}