/* Men of Courage Character Database
 *
 * JavaScript engine for the site navigation
 * 
 *   File name: ui.navigation.js
 *   Date Created: 2024-09-17
 *   Date Modified: 2024-09-27
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
    var self = this;

    /* methods */
    this.tracker = function() {
        /* only trigger if we haven't manually updated the thingy */
        if (typeof(self.goNav) == 'boolean' && self.goNav === true) {
            console.log("Current location: " + window.location.hash);
            $(".md-load.lion").fadeIn(); /* replace with spinner activation code */
            $(".md-layer").fadeOut();
            $(".md-add-button").fadeOut();
            $(".nav-link").removeClass('active');

            /* parse hash */
            var h = window.location.hash.split('/');
 
            if (h[1] == 'character' && h.length > 2) {
                characterObj.load(h[2]); 
            } else if (h[1] == 'episodes') {
                episodeObj.display();
            } else if (h[1] == 'relationships') {
                relationshipObj.display();
            } else {
            /* NOTE: All of this code below is temporary until the various objects that handle the display of the views is written!
                    It is just here so that I can easily navigate between views. */
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
    self = this;
    
    /* methods */
    /**
     * check to see if there are unsaved changes
     */
    this.check = function() {
        if (self.dirty) {
            $("#navFromUnsavedModal").modal("show");
            $("#navFromUnsavedModal_yes").click(function () {
                self.clearUnsaved();
                window.dispatchEvent(new HashChangeEvent("hashchange"));
            });
            $("#navFromUnsavedModal_no").click(function () {
                if (self.oldHash != "" && self.oldHash != window.location.has) {
                    window.navObj.goNav = false;
                    window.location.hash = self.oldHash;
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