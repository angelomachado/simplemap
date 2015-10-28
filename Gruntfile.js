'use strict';

module.exports = function(grunt) {

// 1 - Configuring external plugin specific targets
grunt.initConfig({
  DEST_FOLDER: 'dist',
  pkg: grunt.file.readJSON('package.json'),
  jshint: {
    options: {
      jshintrc: true
      },
      files: [ 'src/**/*.js' ]
      },
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %>\n' +
          '<%= pkg.license %> license. <%= grunt.template.today("yyyy-mm-dd") %> */\n'
          },
          my_target: {
            files: [{
              'dist/simple_map.min.js': ['src/simple_map.js']
              }]
            }
          }
          });

require('load-grunt-tasks')(grunt);

grunt.registerTask('default', [
  'jshint',
  'uglify'
  ]);
};
