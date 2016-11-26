module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    var path = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        pkgMeta: grunt.file.readJSON('config/meta.json'),
        dest: grunt.option('target') || 'dist',
        basePath: path.join('<%= dest %>', 'App_Plugins', '<%= pkgMeta.directory %>'),

        clean: ['tmp'],

        copy: {
            plugin: {
                cwd: 'src/',
                src: ['**/*'],
                dest: '<%= basePath %>',
                expand: true
            },
            nuget: {
                files: [{
                    cwd: '<%= dest %>',
                    src: ['**/*', '!bin', '!bin/*'],
                    dest: 'tmp/nuget/content',
                    expand: true
                }]
            },
            umbraco: {
                cwd: '<%= dest %>',
                src: '**/*',
                dest: 'tmp/umbraco',
                expand: true
            }
        },

        nugetpack: {
            dist: {
                src: 'tmp/nuget/package.nuspec',
                dest: 'pkg'
            }
        },

        template: {
            'nuspec': {
                'options': {
                    'data': {
                        name: '<%= pkgMeta.name %>',
                        version: '<%= pkgMeta.version %>',
                        url: '<%= pkgMeta.url %>',
                        license: '<%= pkgMeta.license %>',
                        licenseUrl: '<%= pkgMeta.licenseUrl %>',
                        author: '<%= pkgMeta.author %>',
                        authorUrl: '<%= pkgMeta.authorUrl %>'
                    }
                },
                'files': {
                    'tmp/nuget/package.nuspec': ['config/package.nuspec']
                }
            }
        },

        umbracoPackage: {
            dist: {
                src: 'tmp/umbraco',
                dest: 'pkg',
                options: {
                    name: "<%= pkgMeta.name %>",
                    version: '<%= pkgMeta.version %>',
                    url: '<%= pkgMeta.url %>',
                    license: '<%= pkgMeta.license %>',
                    licenseUrl: '<%= pkgMeta.licenseUrl %>',
                    author: '<%= pkgMeta.author %>',
                    authorUrl: '<%= pkgMeta.authorUrl %>',
                    readme: '<%= grunt.file.read("config/readme.txt") %>',
                    manifest: 'config/package.template.xml'
                }
            }
        }
    });

    grunt.registerTask('nuget', ['copy:plugin', 'copy:nuget', 'template:nuspec', 'nugetpack']);
    grunt.registerTask('package', ['clean', 'nuget', 'copy:umbraco', 'umbracoPackage', 'clean']);
};
