/* Men of Courage Character Database
 *
 * JavaScript object for Episodes
 * 
 *   File name: ui.3-episodes.js
 *   Date Created: 2024-10-01
 *   Date Modified: 2024-10-01
 * 
 */
$(document).ready(function () {
    /* initialize the object */
    Episodes = function () {
        /* properties */
        /* public */
        this.list = {};

        /* private */
        var accordionTpl = `<div class="accordion-item">
    <h2 class="accordion-header" id="episode_%id%">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_%id%">
            %id% &ndash; %title%
        </button>
    </h2>
    <div id="collapse_%id%" class="accordion-collapse collapse">
        <div class="accordion-body">
            <div class="float-end mt-3 me-3">
                <button type="button" class="btn btn-outline-secondary edit-episode" data-episode="%id%"><i class="bi bi-pencil"></i> %edit%</button></button>
            </div>
            <p><strong>%ep_rec_date%:</strong> %rec_date%</p>
            <p class="mb-0"><strong>%ep_characters%:</strong></p>
            <ul>
                %charlist%
            </ul>
        </div>
    </div>            
</div>\n`;
        var optionTpl = '<option value="%option%">%item%</option>\n';
        var listItemTpl = '<li><a href="#/character/%id%">%full_name%</a></li>\n';

        /* self-reference */
        var self = this


        /* methods */
        /* private */
        /**
         * Connects the events to the buttons
         * 
         * @param {boolean} rewrite : only reconnect the .relationship-open class 
         */
        var connectEvents = function (rewrite) {
            if (!rewrite) {
                $("#add_ep_btn button").click(function() { self.addEdit(0); });
                $("#addEditEpisodeModal_save").click(self.update);
            }
            $(".edit-episode").click(function() { self.addEdit(this.data("episode")); });
            $(".delete-episode").click(function() { self.delete(this.data("episode"), false); });
        }

        /**
         * Verifies the data passed
         * 
         * @param {object} data : data to be verified
         * @returns {boolean}
         */
        var verifyData = function(data) {}


        /* public */
        /**
         * open modal to add or edit item
         * 
         * @param {number} id : id of episode to edit or 0 for new episode
         */
        this.addEdit = function(id) {
            
        }

        /**
         * Deletes an episode
         * 
         * @param {number} id       : id of episode to delete
         * @param {boolean} confirm : execute the deletion
         */
        this.delete = function(id, confirm) {
            if (typeof(id) != "number") { return false; }
            if (typeof(confirm) != "boolean") { confirm = false; } 
        }

        /**
         * displays the Episodes layer
         */
        this.display = function() {
            if (Object.keys(self.list).length < 1) {
                $("#eplist_no_chars").show();
                $("#ep_list_accordion").hide();
            } else {
                $("#eplist_no_chars").hide();
                $("#ep_list_accordion").show();
            }
            $("#episode_list").fadeIn();
            $("#add_ep_btn").fadeIn();
            $("#nav_episodes").addClass("active");
        }

        /**
         * load episodes from database
         */
        this.load = function() {
            $.get("/api/fetch/episodes", null, function (r) {
                if (r.error) {
                    window.flash.display(window.JS_STRINGS['es_read_failure'].replace("%item%", window.JS_STRINGS['episodes']), 'danger');
                    console.log(r.error);
                } else {
                    self.list = r.episodes;
                    self.write();
                }
            }).fail(function () { window.flash.display(window.JS_STRINGS['general_failure'].replace("%item%", window.JS_STRINGS['episodes']), 'danger'); });
        }
        
        /**
         * update contents in database 
         */
        this.update = function() {}

        /**
         * add a given character to an episode (reciprocal data)
         * This is usually called by characterObj
         * 
         * @param {number} id : episode id to add
         * @param {number} character_id : id of character to update
         * @param {string} character_name : full name of character to add
         */
        this.updateCharacter = function (id, chracter_id, character_name) {}

        /**
         * write episode data to interface
         */
        this.write = function() {
            var accordion = "";
            var select = "";
            
            if (Object.keys(self.list).length > 0) {
                select = optionTpl.replace("%option%", "0").replace("%item%", window.JS_STRINGS.select_episode_here);
                $.each(self.list, function (k, i) {
                    var accItem = accordionTpl.replace(/%id%/g, i.id).replace("%title%", i.name).replace("%edit%", window.JS_STRINGS.edit).replace("%ep_rec_date%", window.JS_STRINGS.ep_rec_date).replace("%rec_date%", i.recorded).replace("%ep_characters%", window.JS_STRINGS);

                    var charItem = "";
                    for (var i=0; i<i.characters.length; i++) {
                        charItem += listItemTpl.replace("%id%", charItem[i].character_id).replace("%full_name%", charItem[i].character_name);
                    }

                    accordion += accItem.replace("%charlist%", charItem);
                    select += optionTpl.replace("%option%", i.id).replace("%item%", i.id + " &ndash; " + i.name);
                });
            } 
            if (select == "") {
                dselectRemove("#append_selected_episode");
                $("#append_selected_episode").html(optionTpl.replace("%option%", "0").replace("%item%", window.JS_STRINGS.episode_none));
                $("#append_selected_episode").prop("disabled", true);
            } else {
                $("#append_selected_episode").html(select);
                $("#append_selected_episode").prop("disabled", false);
                dselect(document.querySelector("#append_selected_episode"), { search: true, maxHeight: "300px" });
            }

            $("#ep_list_accordion").html(accordion);
            connectEvents(true);
        } 

        connectEvents();
    }

    episodesObj = new Episodes();
});
