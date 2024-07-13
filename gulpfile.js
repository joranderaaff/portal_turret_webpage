/*

ESP8266 file system builder

Copyright (C) 2016-2017 by Xose Pérez <xose dot perez at gmail dot com>;

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

// -----------------------------------------------------------------------------
// File system builder
// -----------------------------------------------------------------------------

const fs = require('fs');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const gzip = require('gulp-gzip');
const inline = require('gulp-inline');
const cssBase64 = require('gulp-css-base64');
const favicon = require('gulp-base64-favicon');

const srcFolder = 'dist/';
const dataFolder = 'dist_compiled/';
const desinationFolder = 'dist_c/';

function buildfs_embeded() {
    return new Promise(function (resolve, reject) {
        let page = "index";
        var source = dataFolder + page + '.html.gz';
        var destination = desinationFolder + page + '.html.gz.h';

        var wstream = fs.createWriteStream(destination);
        wstream.on('error', function (err) {
            console.log(err);
        });

        var data = fs.readFileSync(source);

        wstream.write(`#define ${page}_html_gz_len ${data.length}\n`);
        wstream.write(`const uint8_t ${page}_html_gz[] PROGMEM = {`);

        for (let i = 0; i < data.length; i++) {
            if (i % 100 == 0) wstream.write("\n");
            wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
            if (i < data.length - 1) wstream.write(',');
        }

        wstream.write('\n};')
        wstream.end();
        resolve();
    });
}

function buildfs_inline() {
    return gulp.src(srcFolder + '*.html')
        //.pipe(favicon())
        .pipe(inline({
            base: srcFolder,
            js: uglify,
            //css: [inlineImages, cleancss],
            css: [cssBase64({ baseDir: "../", verbose: true })],
            //disabledTypes: ['svg', 'img']
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removecomments: true,
            aside: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gzip())
        .pipe(gulp.dest(dataFolder));
}

exports.default = gulp.series(buildfs_inline, buildfs_embeded);