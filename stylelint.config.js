// 英文官网 https://stylelint.io/user-guide/rules/list/property-no-unknown/
// 中文解释 https://ask.dcloud.net.cn/article/36067
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-prettier/recommended'
  ],
  plugins: ['stylelint-scss', 'stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'property-no-unknown': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export']
      }
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ]
  }
}
