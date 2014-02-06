module.exports = function(grunt) {


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        from : "/home/peter/ws/raspberry/draw",
        to: "/home/pi/draw",

        scp: {
            options: {
                host: 'raspberry',
                username: 'pi',
                password: "dyst"
            },
            your_target: {
                files: [{
                    cwd: "<%= from %>",
                    src: '*',
                    filter: 'isFile',
                    dest: "<%= to %>"
                },{
                    cwd: "<%= from %>/public",
                    src: '**/*',
                    //filter: 'isFile',
                    // path on the server
                    dest: "<%= to %>/public"
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-scp');

    grunt.registerTask('default', ['scp']);
};