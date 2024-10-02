/* Men of Courage Character Database
 *
 * JavaScript engine for the site
 * 
 *   File name: ui.js
 *   Date Created: 2024-09-12
 *   Date Modified: 2024-09-27
 * 
 */

window.HTML_TEMPLATES = {
    charlist_row : `<tr>
    <td class="ps-3"><a href="#/character/%id%">%full_name%</a></td>
    <td>%episodes%</td>
    <td><i class="bi-gender-%sex_slug%" title="%sex_word%"></i></td>
    <td class="col-3">%status%</td>
    <td class="text-end pe-3">
        <a href="#/character/%id%"><button class="btn btn-sm btn-outline-dark char-display" title="%display%" type="button">
            <i class="bi-eye"></i>
        </button></a>
    </td>
</tr>\n`,
    char_relation_row : `<tr>
    <td class="ps-3"><a href="#/character/%id%">%full_name%</a></td>
    <td>%relationship%</td>
    <td><i class="bi-gender-%sex_slug%" title="%sex_word%"></i></td>
    <td class="text-end pe-3">
        <button class="btn btn-sm btn-outline-dark char-" title="%display%" type="button">
            <i class="bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" title="%del_rel%" type="button">
            <i class="bi-trash3-fill"></i>
        </button>
    </td>
</tr>\n`,
    char_episode_row : `<tr>
    <td><a href="#/episodes/%id%">%episode%</a></td>
    <td class="text-end pe-3">
        <button class="btn btn-sm btn-outline-danger" title="%del_ep%" type="button">
            <i class="bi-trash3-fill"></i>
    </button>
    </td>
</tr>\n`,
    relationship_row: `<tr>    
    <td class="col-4 ps-3">%main_relation%</td>
    <td class="col-4">%male_reciprocal_relation%</td>
    <td class="col-4">%female_reciprocal_relation%</td>
</tr>\n`,
    episode_data : `<div class="accordion-item">
    <h2 class="accordion-header" id="episode_%id%">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_%id%">
            %id% &ndash; %title%
        </button>
    </h2>
    <div id="collapse_%id%" class="accordion-collapse collapse">
        <div class="accordion-body">
            <div class="float-end mt-3 me-3">
                <button type="button" class="btn btn-outline-secondary edit-episode" data-episode="%id%"><i class="bi bi-pencil"></i> %edit%</button></button>&nbsp;
                <button type="button" class="btn btn-outline-danger delete-episode" data-episode="%id%" title="%delete%"><i class="bi-trash3-fill"></i></button></button>
            </div>
            <p><strong>%ep_rec_date%:</strong> %rec_date%</p>
            <p class="mb-0"><strong>%ep_characters%:</strong></p>
            <ul>
                %charlist%
            </ul>
        </div>
    </div>            
</div>\n`,
    episode_charlist : '<li><a href="#/character/%id%">%full_name%</a></li>\n'
}

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
 * Remove the dselect enhancement from a select box that has it
 * 
 * @param {*} id : DOM id of select item to which dselect was applied
 * @returns      : false if id not passed
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
     * enable dselect searchable dropdown boxes 
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