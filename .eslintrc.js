module.exports = {
	"extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "env": {
  	"jquery": true,
    "browser": true,
		"mocha": true,
    "amd": true
  },
	"rules": {
		"no-unused-vars": "warn",
		"no-undef": "warn",
    "no-shadow": "warn",
    "no-console": "off",
    "no-param-reassign": "off",
    "no-case-declarations": "off",
    "no-use-before-define": "off",
    "comma-dangle": "off",
    "no-plusplus": "off",
    "arrow-parens": 'off',
    "no-tabs": "off",
    "func-names": "off",
    "max-len": "off",
    "no-multiple-empty-lines": "off",
    "no-useless-escape": "off",
    "consistent-return": "off",
    "space-before-function-paren": ["error", "never"],
    "arrow-body-style": "off",
    "no-trailing-spaces": "off",
    "class-methods-use-this": "off",
    "eol-last": "off",
    "no-continue": "off",
	}
};