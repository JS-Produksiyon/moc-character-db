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
window.HashMgr = function () {
    /* parameters */
    this.goNav = true;

    /* self-reference */
    _me = this;

    /* methods */
    this.tracker = function() {
        /* only trigger if we haven't manually updated the thingy */
        if (typeof(_me.goNav) == 'boolean' && _me.goNav === true) {
            console.log("Current location: " + window.location.hash);
            $(".md-load.lion").fadeIn(); /* replace with spinner activation code */
            $(".md-layer").fadeOut();
            $(".md-add-button").fadeOut();
            $(".nav-link").removeClass('active');

            /* parse hash */
            var h = window.location.hash.split('/');
 
            if (h[1] == 'character' && h.length > 2) {
                characterObj.load(h[2]);
 
            /* NOTE: All of this code below is temporary until the various objects that handle the display of the views is written!
                    It is just here so that I can easily navigate between views. */
            } else if (h[1] == 'episodes') {
                $("#episode_list").fadeIn();
                $("#add_ep_btn").fadeIn();
                $("#nav_episodes").addClass("active");
            } else if (h[1] == 'relationships') {
                $("#relation_list").fadeIn();
                $("#add_rel_btn").fadeIn();
                $("#nav_relations").addClass("active");
            } else {
                $("#char_list").fadeIn();
                $("#add_char_btn").fadeIn();
                $("#nav_characters").addClass("active");
            }
            /* replace with spinner deactivation code */
            $(".md-load").fadeOut();
        } else {
            this.goNav = true;
        }
    }
}

window.UnsavedChanges = function() {
    /* properties */
    this.dirty = false;
    this.oldHash = "";
    
    /* self-reference */
    _me = this;
    
    /* methods */
    /**
     * check to see if there are unsaved changes
     */
    this.check = function() {
        if (_me.dirty) {
            $("#navFromUnsavedModal").modal("show");
            $("#navFromUnsavedModal_yes").click(function () {
                _me.clearUnsaved();
                window.dispatchEvent(new HashChangeEvent("hashchange"));
            });
            $("#navFromUnsavedModal_no").click(function () {
                if (_me.oldHash != "" && _me.oldHash != window.location.has) {
                    window.navObj.goNav = false;
                    window.location.hash = _me.oldHash;
                }
                $("#navFromUnsavedModal").modal("hide");
            });
        } 
    }

    /**
     * clear the unsaved flag
     */
    this.clearUnsaved = function() {
        this.dirty = false;
    }

    /**
     * set the unsaved flag
     */
    this.setUnsaved = function() {
        this.dirty = true;
    }
}

$("document").ready(function() {
    window.saveState = new UnsavedChanges();
    window.navObj = new HashMgr();
    window.onhashchange = navObj.tracker;
    navObj.tracker();
})