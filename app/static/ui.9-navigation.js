/* Men of Courage Character Database
 *
 * JavaScript engine for the site navigation
 * 
 *   File name: ui.navigation.js
 *   Date Created: 2024-09-17
 *   Date Modified: 2024-11-14
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
        /* check for unsaved state */
        if (window.saveState) {
            window.saveState.check();
        }

        /* only trigger if we haven't manually updated the thingy */
        if (typeof(self.goNav) == 'boolean' && self.goNav === true) {
            console.log("Current location: " + window.location.hash);
            window.loading.start();
            $(".md-layer").fadeOut();
            $(".md-add-button").fadeOut();
            $(".nav-link").removeClass('active');

            /* parse hash */
            var h = window.location.hash.split('/');
 
            if (h[1] == 'character' && h.length > 2) {
                characterObj.load(h[2]); 
            } else if (h[1] == 'episodes') {
                ep = (h.length > 2) ? h[2] : "";
                console.log(ep)
                episodesObj.display(ep);
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
            window.loading.stop();
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
        var localNavObj  = { goNav: false }; // here we make sure that the check function works, even if the nav object isn't there!

        if (window.navObj) {
            localNavObj = window.navObj;
        } 

        localNavObj.goNav = false;

        if (self.dirty) {
            $("#navFromUnsavedModal").modal("show");
            $("#navFromUnsavedModal_yes").off("click"); // just to make sure we don't get multiple clicks...
            $("#navFromUnsavedModal_yes").click(function () {
                self.clearUnsaved();
                localNavObj.goNav = true;
                window.dispatchEvent(new HashChangeEvent("hashchange"));
                $("#navFromUnsavedModal").modal("hide");
            });
            $("#navFromUnsavedModal_no").click(function () {
                if (self.oldHash != "" && self.oldHash != window.location.has) {
                    window.location.hash = self.oldHash;
                }
                $("#navFromUnsavedModal").modal("hide");
            });
        } else {
            localNavObj.goNav = true; // make sure we navigate if everything is clean
        }
    }

    /**
     * clear the unsaved flag
     */
    this.clearUnsaved = function() {
        self.dirty = false;
    }

    /**
     * set the unsaved flag
     */
    this.setUnsaved = function() {
        self.dirty = true;
    }
}

$("document").ready(function() {
    window.saveState = new UnsavedChanges();
    window.navObj = new HashMgr();
    window.onhashchange = navObj.tracker;
    navObj.tracker();
})