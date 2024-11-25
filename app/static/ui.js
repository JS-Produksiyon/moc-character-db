/* Men of Courage Character Database
 *
 * JavaScript engine for the site
 * 
 *   File name: ui.js
 *   Date Created: 2024-09-12
 *   Date Modified: 2024-11-25
 * 
 */

/* major error modal control */
window.ErrorModal = function() {
    /* properties */
    /* private */
    var domObjMain = "#majorErrorModal";
    var domObjMsg = "#majorErrorModal_text";

    /* self-reference */
    var self = this;

    /* methods */
    /**
     * Displays the major error modal
     * 
     * @param {string} msg : message to display in HTML
     */
    this.show = function(msg) {
        $(domObjMsg).html(msg);
        $(domObjMain).modal("show");
    }
}

/* flash item object */
window.Flash = function () {
    /* properties */
    /* private */
    var domObjButton = "#flash_dismiss";
    var domObjMain = "#flash";
    var domObjMsg = "#flash_msg"
    var flashClasses = ["danger", "info", "success", "warning"];
    var hideTime = 3000; // 3 seconds
    
    /* self-reference */
    var self = this;

    /* methods */
    /* private */
    connectButton = function() {
        $("#flash_dismiss").click(self.hide);
    }

    /* public */
    /**
     * hide the flash message
     */
    this.hide = function() {
        clearTimeout(self.timeoutObj);
        $(domObjMain).fadeOut().promise()
            .done(function () { 
                $(domObjMain).removeClass(flashClasses); 
                $(domObjMsg).html("");
            });
    }

    /**
     * display the flash message
     * 
     * @param {string} msg : message to display
     * @param {string} cls : class for background
     */
    this.display = function(msg, cls) {
        if (flashClasses.indexOf(cls) > -1) {
            $(domObjMain).addClass(cls);
        }
        $(domObjMsg).html(msg);
        $(domObjMain).fadeIn();
        setTimeout(this.hide, hideTime); // this function refuses to accept the self referent for an odd reason.
    }

    connectButton();
}

/* spinner item object */
window.LoadingIcon = function() {
    /* properties */
    /* public */
    this.active = false;
    
    /* private */
    var domObj = ".md-load";

    /* self-reference */
    var self = this;

    /* methods */
    /**
     * show the loading icon
     */
    this.start = function() {
        if (!self.active) {
            $(domObj).fadeIn();
            self.active = true;
        }
    }

    /**
     * hide the loading icon
     */
    this.stop = function() {
        if (self.active) {
            $(domObj).fadeOut();
            self.active = false;
        }
    }
}

/**
 * Capitalize the first letter of the string
 * 
 * @param {string} s : string to capitalize
 * @returns          : string with first letter capitalized
 */
function capitalizeFirst(s) {
    return s.substring(0,1).toLocaleUpperCase() + s.substring(1);
}

/**
 * Localize the dselect element
 * 
 * @param {string} selectObjId  : id of select object dselect is attached to
 * @param {object} localStrings : strings to translate {search: '', noresults: ''}
 */
function dselectLocalize(selectObjId, localStrings) {
    if (typeof selectObjId != "string") { return false; }
    if (selectObjId.substring(0,1) != "#") { selectObjId = `#${selectObjId}`; }
    if (typeof localStrings != "object") { return false; }
    if (typeof localStrings.select != "string") { localStrings.select = ""; }
    if (typeof localStrings.noresults != "string") { localStrings.noresults = ""; }

    $(`${selectObjId} ~ .dropdown input`).attr("placeholder", localStrings.search);
    $(`${selectObjId} ~ .dropdown .dselect-no-results`).html(localStrings.noresults);
}


/**
 * Remove the dselect enhancement from a select box that has it
 * 
 * @param {string} id : DOM id of select item to which dselect was applied
 * @returns           : false if id not passed
 */
function dselectRemove(id) {
    if (typeof(id) != "string") { return false; }
    if (id.substring(0,1) != "#") { id = "#" + id; }
    if ($(id).length > 0) {
        if ($(id).next("div").hasClass("dropdown")) {
            $(id).next("div").remove();
            $(id).show();
        }
    }
}

/* document load */
$(document).ready(function () {
    /* 
     * example of dselect searchable dropdown boxes code
     * See https://github.com/jarstone/dselect for usage
     
    $.each(["#appendRelationshipModal_character", "#appendRelationshipModal_relation"], 
            function (k, i) { 
                if ($(i).length > 0) { dselect(document.querySelector(i), { search: true }); }
            });

    /* activate messaging interface */
    window.errDialog = new ErrorModal();
    window.flash = new Flash();
    window.loading = new LoadingIcon();
})