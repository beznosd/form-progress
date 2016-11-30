module.exports = {
  paths: {
    watched: ['src'],
    public: 'dist'
  },

  files: {
    javascripts: {
      joinTo: 'form-progress.js'
    },
  },

  plugins: {
    babel: {presets: ['es2015']}
  },

  modules: {
    wrapper: false,
    definition: false
  },

  npm: {
    enabled: false
  }
};
