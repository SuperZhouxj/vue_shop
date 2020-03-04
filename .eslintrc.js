module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    "space-before-function-paren": 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "quotes": [1, "single"],
    // "semi": [2, "always"],
    "semi": 0,
    'arrow-parens': 0,                    //允许less箭头功能
    'generator-star-spacing': 0,          
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  }
}
