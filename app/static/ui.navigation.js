/* Men of Courage Character Database
 *
 * JavaScript engine for the site
 * 
 *   File name: ui.navigation.js
 *   Date Created: 2024-09-17
 *   Date Modified: 2024-09-17
 * 
 */

/**
 * Hash manager class, which gives the ability to track when the hash
 * changes and displays a layer accordingly
 */
var hashMgr = function () {

    this.update = false;

    this.tracker = function() {
        console.log("Current location: " + window.location.hash);
        $(".md-load.lion").fadeIn(); /* replace with spinner activation code */
        $(".md-layer").fadeOut();
        
        /* parse hash */
        var h = window.location.hash.split('/');
        console.log(h);
        if (h[1] == 'character' && h.length == 2) {
            /* replace with load character detail code */
            $("#char_detail").fadeIn();
        } else if (h[1] == 'episodes') {
            $("#episode_list").fadeIn();
        } else {
            $("#char_list").fadeIn();
        }
        /* replace with spinner deactivation code */
        $(".md-load").fadeOut();
    }
}


$("document").ready(function() {
    window.navObj = new hashMgr();
    window.onhashchange = navObj.tracker;
    navObj.tracker();
})