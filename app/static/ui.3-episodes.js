/* Men of Courage Character Database
 *
 * JavaScript object for Episodes
 * 
 *   File name: ui.3-episodes.js
 *   Date Created: 2024-10-01
 *   Date Modified: 2024-11-04
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
            <div class="float-end">
                <button type="button" class="btn btn-outline-secondary edit-episode" data-episode="%id%"><i class="bi bi-pencil"></i> %edit%</button></button>
                <button type="button" class="btn btn-outline-danger delete-episode" data-episode="%id%" title="%delete%"><i class="bi-trash3-fill"></i></button></button>
            </div>
            <p><strong>%ep_rec_date%:</strong> %rec_date%</p>
            <p class="mb-0"><strong>%ep_characters%:</strong></p>
            <ul>
                %charlist%
            </ul>
        </div>
    </div>            
</div>\n`;
        var csrfToken = $("#csrf_token").val();
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
        var connectEvents = function(rewrite) {
            if (!rewrite) {
                $("#add_ep_btn button").click(function() { self.addEdit(0); });
                $("#addEditEpisodeModal_save").click(self.update);
            }
            $(".edit-episode").click(function() { self.addEdit($(this).data("episode")); });
            $(".delete-episode").click(function() { self.delete($(this).data("episode"), false); });
        }

        /** 
         * Configures whether to show the data or no data message
         */ 
        var showData = function () {
                        
            if (Object.keys(self.list).length < 1 && $("#eplist_no_chars").css("display") == "none") {
                $("#eplist_no_chars").show();
                $("#ep_list_accordion").hide();
            } else if ($("#ep_list_accordion").css("display") == "none") {
                $("#eplist_no_chars").hide();
                $("#ep_list_accordion").show();
            }

        }

        /**
         * Validate passed data
         * 
         * @param {object} data : the data to validate
         * @returns {boolean}   : denoting validity
         */
        var validateData = function (data) {
            var skeleton = (Object.keys(data).length > 2) ? { "id": "number", "name": "string", "recorded": "string" } :  { "id": "number", "name": "string" }
            var valid = true;

            if (Object.keys(data).length == Object.keys(skeleton).length) {
                $.each(data, function (k,i) {
                    if ((Object.keys(skeleton).indexOf(k) < 0) || (typeof(i) != skeleton[k])) { 
                        valid = false;
                    } 
                });
            } else {
                valid = false;
            }

            return valid;
        }


        /* public */
        /**
         * open modal to add or edit item
         * 
         * @param {number} id : id of episode to edit or 0 for new episode
         */
        this.addEdit = function(id) {
            if (typeof(id) != "number") {
                id = parseInt(id);
                if (typeof(id) != "number") { return false; }
            }

            $("#addEditEpisodeModal_txt_add").hide();
            $("#addEditEpisodeModal_txt_edit").hide();
            if (id == 0) {
                $("#addEditEpisodeModal_txt_add").show();
            } else {
                $("#addEditEpisodeModal_txt_edit").show();
            }
            $(".form-validate").removeClass("is-invalid");
            $("#addEditEpisodeModal_ep_num").val((id == 0) ? "" : id);
            $("#addEditEpisodeModal_ep_title").val((id == 0) ? "" : self.list[id].name);
            $("#addEditEpisodeModal_ep_date").val((id == 0) ? "" : self.list[id].recorded);
            $("#addEditEpisodeModal").modal("show");
            setTimeout(function () { $("#addEditEpisodeModal_ep_num").focus(); }, 600);
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

            var delModal = $("#deleteItemModal")
            var delYesButton = $("#deleteItemModal_yes")
            delYesButton.off("click"); /* disable clicking the Yes button */

            if (confirm === true) {
                delModal.modal("hide");
                delete self.list[id];
                data = {"csrf_token": csrfToken, "what": "episodes", "id":id}
                $.post("/api/deleteItem", data, function (r) {
                    if (r.error) {
                        window.flash.display(window.JS_STRINGS["del_error"].replace("%item%", window.JS_STRINGS["episode"]).replace("%id%", id), "warning")
                    } else {
                        window.flash.display(window.JS_STRINGS["del_success"].replace("%item%", window.JS_STRINGS["ep_num"] + " " + id), "success");
                        window.charListObj.load(); /* to clear changes of deleted episodes */
                    }
                }).fail(function () { window.flash.display(window.JS_STRINGS['general_failure'].replace("%item%", window.JS_STRINGS['episode']), 'danger'); });
                self.write();
                self.display();
            } else {
                $("#deleteItemModal_title_item").html(capitalizeFirst(window.JS_STRINGS["del_title"]).replace("%item%", window.JS_STRINGS["Episode"]));
                $("#deleteItemModal_msg").html(capitalizeFirst(window.JS_STRINGS["del_modal_text"].replace("%item%", window.JS_STRINGS["ep_num"] + " " + id)));
                delYesButton.click(function() { self.delete(id, true); });
                delModal.modal("show");
             }
        }

        /**
         * displays the Episodes layer
         * 
         * @param {number} epNum : episode number to display
         */
        this.display = function(epNum) {
            if (typeof(epNum) == "undefined") { epNum = ""; }
            if (typeof(epNum) != "number") { epNum = parseInt(epNum); }

            showData();
            $(".accordion-collapse").removeClass("show");
            $.each($(".accordion-button"), function () {
                if (!$(this).hasClass("collapsed")) { $(this).addClass("collapsed"); }
            })
            $("#episode_list").fadeIn();
            $("#add_ep_btn").fadeIn();
            $("#nav_episodes").addClass("active");

            /* scroll to episode, if we happen to have one defined */
            if (epNum != NaN) {
                if ($(`#episode_${epNum}`).length > 0) {
                    $(`#episode_${epNum} button`).trigger("click");
                    $.scrollTo(`#episode_${epNum}`); 
                }
            }
        }

        /**
         * Checks to see if an episode id exists
         * 
         * @param {number} id : id to check against list
         * @returns           : boolean denoting existence
         */
        this.epIdExists = function(id) {
            var exists = false;

            $.each(self.list, function (k,i) {
                if (i.id == id) { exists = true; }
            });

            return exists;
        }


        /**
         * load episodes from database
         */
        this.load = function() {
            $.get("/api/fetch", {"what":"episodes"}, function (r) {
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
         * 
         * @param {object} args : a list of objects to add
         */
        this.update = function(args) {
            var data = {"id": 0, "name": "", "recorded": "", "characters": [] };
            var fields = {};
            var go = true;

            /* validate object */
            if (typeof(args) == "object" && !args.originalEvent) {
                if(validateData(args)) {
                    $.each(args, function (k,i) {
                        data[k] = i;
                    })
                } else {
                    go = false;
                }
            } else {
                /* validate entries */
                fields = { "id": $("#addEditEpisodeModal_ep_num"), "name": $("#addEditEpisodeModal_ep_title"), "recorded": $("#addEditEpisodeModal_ep_date")}
                
                if (parseInt(fields["id"].val()) < 1) {
                    fields["id"].addClass("is-invalid");
                    go = false;
                }
                if (fields["name"].val().length < 1) {
                    fields["name"].addClass("is-invalid")
                    go = false;
                }
                data = { "id": fields["id"].val(), "name": fields["name"].val(), "recorded": fields["recorded"].val(), "characters": [] };
            }
            /* add or edit an episode */
            if (go) {
                self.list[data["id"]] = data;
                self.write();

                /* write new episode to database */
                data["csrf_token"] = csrfToken;
                data["what"] = "episodes";
                data["characters"] = JSON.stringify(data["characters"]); // we stringify this so that it can be passed without goofing up the send
                
                $.post('/api/write', data, function (r) {
                    if (r.error) {
                        window.flash.display(window.JS_STRINGS["es_write_failure"].replace("%item%", "<i>" + data.id + " &ndash; " + data.name + "</i>"), "warning");
                        console.log(r.error);
                    } else {
                        window.flash.display(window.JS_STRINGS["es_write_success"].replace("%item%", "<i>" + data.id + " &ndash; " + data.name + "</i>"), "success");
                    }
                }).fail(function () { window.flash.display(window.JS_STRINGS["general_failure"].replace("%action%", window.JS_STRINGS["episode"]), "danger"); });
    
                data["characters"] = JSON.parse(data["characters"]); // this is so that the characters object _remains_ an object in normal usage

                /* hide modal */
                $("#addEditEpisodeModal").modal("hide");
            }
        }

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
                    var recDate = (i.recorded != "") ? i.recorded : window.JS_STRINGS.ep_not_recorded;

                    var accItem = accordionTpl.replace(/%id%/g, i.id).replace("%title%", i.name).replace("%edit%", window.JS_STRINGS.edit).replace("%ep_rec_date%", window.JS_STRINGS.ep_rec_date).replace("%rec_date%", recDate).replace("%ep_characters%", window.JS_STRINGS.ep_characters).replace("%delete%", window.JS_STRINGS.delete);

                    var charItem = "";
                    if (i.characters.length > 0){
                        for (var j=0; j<i.characters.length; j++) {
                            charItem += listItemTpl.replace("%id%", i.characters[j].character_id).replace("%full_name%", i.characters[j].character_name);
                        }
                    } else {
                        charItem = window.JS_STRINGS.ep_no_characters;
                    }

                    accordion += accItem.replace("%charlist%", charItem);
                    select += optionTpl.replace("%option%", i.id).replace("%item%", i.id + " &ndash; " + i.name);
                });
                if ($("#ep_list_accordion").css("display") == "none") { showData(); }

            } 
             /* this is moved to ui.5-character.js 
            if (select == "") {
                dselectRemove("#append_selected_episode");
                $("#append_selected_episode").html(optionTpl.replace("%option%", "0").replace("%item%", window.JS_STRINGS.episode_none));
                $("#append_selected_episode").prop("disabled", true);
            } else {
                $("#append_selected_episode").html(select);
                $("#append_selected_episode").prop("disabled", false);
                dselect(document.querySelector("#append_selected_episode"), { search: true, maxHeight: "300px" });
            }
            */

            $("#ep_list_accordion").html(accordion);
            connectEvents(true);
        } 

        connectEvents();
    }

    episodesObj = new Episodes();
    episodesObj.load();
});
