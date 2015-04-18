module.exports = {
  description: 'Add bower dependencies: uri-templates',
  normalizeEntityName: function() { },

  afterInstall: function(options) {
    return this.addBowerPackageToProject('uri-templates');
  }
};
