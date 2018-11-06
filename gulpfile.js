/* jshint node:true */
'use strict'

var gulp = require('gulp');
var child = require('child_process');
var c = require('ansi-colors');
var l = require('fancy-log');
var Q = require('q');
var plgconf = require('./plgconfig');

gulp.task('develop:build', function(callback)
{
    var deferred = Q.defer();
    l.info(c.blue('Copying "linked" libraries'));
    gulp.src('lib/*.plg')
        .pipe(gulp.dest('build/'));

    var build = child.exec('buildPlg', function(err, stdout, stderr)
    {
        if (err)
        {
            l.error(c.red("Build failed with error code: " + err.code));
        }
        l.info(c.blue('Output: ') + '\n' + stdout);
    });

    var buildTest = child.exec('buildPlg test', function(err, stdout, stderr)
    {
        if (err)
        {
            l.error(c.red("Test Build failed with error code: " + err.code));
        }
        l.info(c.blue('Output: ') + '\n' + stdout);
        deferred.resolve();
    });

    l.info(c.blue('Copying test data'));
    gulp.src('test/sibmeiTestSibs')
        .pipe(gulp.dest(plgconf.plgPath + '/' + plgconf.plgCategory));

    return deferred.promise;
});

gulp.task('develop:deploy', ['develop:build'], function()
{
    var deploy = child.exec('deployPlg', function(err, stdout, stderr)
    {
        if (err)
        {
            l.error(c.red("Deploy failed with error code: " + err.code));
        }
        l.info(c.blue('Output: ') + '\n' + stdout);
    });
});

gulp.task('develop', function()
{
    gulp.watch(['src/**/*', 'test/**/*', 'lib/**/*.plg'], ['develop:build', 'develop:deploy'])
});

gulp.task('default', function()
{
    gulp.start('develop')
});