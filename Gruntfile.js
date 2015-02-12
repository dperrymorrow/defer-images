module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jslint: {
      library: {
        src: [
          'lib/*.js'
        ],
        directives: {
          browser: true,
          predef: ['window', 'console', 'MutationObserver', 'defer'],
          indent: 2,
          regexp: true
        }
      }
    },

    uglify: {
      options: {
        banner: "/*\n<%= pkg.name %>\nversion: <%= pkg.version %>\ncompiled: <%= grunt.template.today('yyyy-mm-dd') %>\n<%= pkg.author %>\n<%= pkg.repository.url %>\n*/",
        mangle: false,
        sourceMap: true,
        wrap: false,
      },
      my_target: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['lib/defer.js', 'lib/defer-images.js', 'lib/defer-bg.js'],
        }
      }
    },
    
    concat: {
      dist: {
        src: [
          'lib/defer.js',
          'lib/defer-bg.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jslint'); // load the task
  // Default task(s).
  grunt.registerTask('build', ['jslint', 'uglify', 'concat']);
  grunt.registerTask('default', 'jslint');
};
