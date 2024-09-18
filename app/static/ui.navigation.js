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
        $(".md-add-button").fadeOut();
        $(".nav-link").removeClass('active');

        /* parse hash */
        var h = window.location.hash.split('/');
        console.log(h);
        /* NOTE: All of this code below is temporary until the various objects that handle the display of the views is written!
                 It is just here so that I can easily navigate between views. */
        if (h[1] == 'character' && h.length > 2) {
            /* replace with load character detail code */
            $("#char_detail").fadeIn();
            $("#add_char_btn").fadeIn();
            $("#nav_characters").addClass("active");
        } else if (h[1] == 'episodes') {
            $("#episode_list").fadeIn();
            $("#add_ep_btn").fadeIn();
            $("#nav_episodes").addClass("active");
        } else if (h[1] == 'relationships') {
            $("#relations_list").fadeIn();
            $("#add_rel_btn").fadeIn();
            $("#nav_relations").addClass("active");
        } else {
            $("#char_list").fadeIn();
            $("#add_char_btn").fadeIn();
            $("#nav_characters").addClass("active");
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