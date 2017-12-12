module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt)
    grunt.loadNpmTasks('grunt-execute')
    
    let browser = grunt.option('browser')
    let buildType = grunt.option('type')
    let buildPath = `build/${browser}/${buildType}`

    let baseFileMap = {
        ui: {
            '<%= dirs.public.js %>/base.js': ['<%= dirs.src.js %>/ui/base/index.es6.js'],
            '<%= dirs.public.js %>/popup.js': ['<%= dirs.src.js %>/ui/pages/popup.es6.js'],
            '<%= dirs.public.js %>/options.js': ['<%= dirs.src.js %>/ui/pages/options.es6.js']
        },
        background: {
            '<%= dirs.src.js %>/abp.js': ['<%= dirs.src.js %>/abp-preprocessed.es6.js'],
            '<%= dirs.src.js %>/tldjs.js': ['<%= dirs.src.js %>/tldjs.es6.js']
        },
        sass: {
            '<%= dirs.public.css %>/noatb.css': ['<%= dirs.src.scss %>/noatb.scss'],
            '<%= dirs.public.css %>/base.css': ['<%= dirs.src.scss %>/base/base.scss'],
            '<%= dirs.public.css %>/popup.css': ['<%= dirs.src.scss %>/popup.scss'],
            '<%= dirs.public.css %>/options.css': ['<%= dirs.src.scss %>/options.scss']
        }
    }

    /* Browser specific files here
     * Ex: safari: { ui: { '<%= dirs.public.js %>/base.js': ['<%= dirs.src.js %>/ui/base/yourfile.es6.js']}}
     */
    let browserMap = {
        firefox: {},
        chrome: {},
        safari: {}
    }

    let fileMap = {
        firefox: {
            ui: Object.assign(baseFileMap.ui, browserMap.firefox.ui || {}),
            background: Object.assign(baseFileMap.background, browserMap.firefox.background || {}),
            sass: Object.assign(baseFileMap.sass, browserMap.firefox.sass || {})
        },
        chrome: {
            ui: Object.assign(baseFileMap.ui, browserMap.chrome.ui || {}),
            background: Object.assign(baseFileMap.background, browserMap.chrome.background || {}),
            sass: Object.assign(baseFileMap.sass, browserMap.chrome.sass || {})
        },
        safari: {
            ui: Object.assign(baseFileMap.ui, browserMap.safari.ui || {}),
            background: Object.assign(baseFileMap.background, browserMap.safari.background || {}),
            sass: Object.assign(baseFileMap.sass, browserMap.safari.sass || {})
        },
    }

    /* watch any base files and browser specific files */
    let watch = {
        sass: [['<%= dirs.src.scss %>/**/*.scss'], Object.values(fileMap[browser].sass || {})].join().split(','),
        ui: [['<%= dirs.src.js %>/ui/**/*.es6.js'], Object.values(fileMap[browser].ui || {})].join().split(','),
        background: [['<%= dirs.src.js %>/*.es6.js'], Object.values(fileMap[browser].background || {})].join().split(',')
    }

    console.log(watch)

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            cache: '.cache',
            src: {
                js: 'shared/js',
                scss: 'shared/scss',
                templates: 'shared/templates'
            },
            public: {
                js: `${buildPath}/public/js`,
                css: `${buildPath}/public/css`
            }
        },

        browserify: {
            ui: {
                options: { transform: ['babelify'] },
                files: fileMap[browser].ui
            },
            background: {
                options: { transform: ['babelify'] },
                files: fileMap[browser].background
            }
        },

        sass: {
            dist: {
                files: fileMap[browser].sass
            }
        },

        execute: {
            preProcessLists: {
                src: ['scripts/buildLists.js', 'scripts/buildEntityMap.js']
            },
            tosdr: {
                src: ['scripts/tosdr.js']
            }
        },

        watch: {
            scss: {
                files: watch.sass,
                tasks: ['sass']
            },
            ui: {
                files: watch.ui, 
                tasks: ['browserify:ui']

            },
            background: {
                files: watch.background,
                tasks: ['browserify:background']
            }
        }
    })

    grunt.registerTask('build', 'Build project(s)css, templates, js', ['sass', 'browserify', 'execute:preProcessLists'])
    grunt.registerTask('dev', 'Build and watch files for development', ['build', 'watch'])
    grunt.registerTask('default', 'build')
}
