/* Men of Courage Character Database
 *
 * JavaScript engine for the character object
 * 
 *   File name: ui.5-character.js
 *   Date Created: 2024-09-24
 *   Date Modified: 2024-10-02
 * 
 */
/* initialize the object */
$(document).ready(function (){
    Character = function() {

        /* parameters */
        /* public */
        this.character_data = { id: 0, first_name: "", last_name: "", sex: "", age: 0,
            physical: "", personality: "", employment: "", image_head: "",
            image_body: "", animation_status: "", residence: 0, marital_status: 0,
            acted_by: 0, relationships: [], episodes: []};
      
        /* private */

        /* self-reference */
        var self = this;


        /* methods */
        /* private methods */
        /**
         * connect events to buttons and select boxes
         * 
         * @param {boolean} target What terget to rewrite for
         */
        var connectEvents = function(target) {
            if (typeof(target) != "string") { target = ""; }

            if (target == "") {
                $("#char_btn_add_episode").click(function () { self.episodeAdd(false); });
                $("#appendEpisodeModal_save").click(function () { self.episodeAdd(true); });
            }
            if (target == "episodes" || target == "") {
                $(".char-ep-del").click(function () { self.episodeDel($(this).data("id")); } );
            }
            if (target == "relations" || target == "") {}
        }

        /**
         * verifies data pulled from the form
         * 
         * @param {object} data          JSON object to be checked through
         * @param {string} skeleton_type what skeleton to use: 'base', 'relationships', 'relations'
         */
        var verifyData = function(data, skeleton_type) {
            if (typeof(skeleton_type) != 'string') { skeleton_type = 'base'}

            var item = 0;
            var key = '';
            var skeleton = { id: typeof(0), first_name: typeof(""), last_name: typeof(""), 
                    sex: typeof(""), age: typeof(0), physical: typeof(""), 
                    personality: typeof(""), employment: typeof(""), image_head: typeof(""),
                    image_body: typeof(""), animation_status: typeof(""), residence: typeof(0), 
                    marital_status: typeof(0), acted_by: typeof(0), relationships: typeof([]), 
                    episodes: typeof([])};
            
            var relationships_skeleton = {	id: typeof(0), name: typeof(("")), relation: typeof({})}
            var relationships_relation_skeleton = {id: typeof(0), slug: typeof("")}
            var result = false;
            var test = skeleton;

            /* select alternative skeleton */
            switch (skeleton_type) {
                case 'relationships':
                    test = relationships_skeleton;
                    break;
                case 'relations':
                    test = relationships_relation_skeleton;
                    break;            
            }
            
            if (typeof(data) == typeof(test)) {
                if (data.length == test.length) {
                    while (item > 0 && item < test.length) {
                        key = Object.keys(data)[item];
                        if ((Object.keys(test).indexOf(key) < 0) && (typeof(data[key]) == test[key])) {
                            if ((key.indexOf('relations') > -1) && data[key].length > 0) {
                                item = (validateData(data[key], key)) ? item : -2;
                            } 
                            item++;
                        } else {
                            item = -1;
                        }
                    }
                    result = (item > 0) ? data : false;
                }
            }
            
            return result;
        }

        /**
         * write data to the relationship and episode tables
         * 
         * @param {string} target reference to the table to write to ("episodes" or "relations")
         */
        var writeTable = function(target) {
            if (typeof(target) != "string") { return false; }

            var rowTpl = "";
            var rowData = [];
            var targetDomId = "";

            switch (target) {
                case ("episodes"):
                    rowTpl = `<tr>
                                <td><a href="#/episodes/%id%">%episode%</a></td>
                                <td class="text-end pe-3">
                                    <button class="btn btn-sm btn-outline-danger char-ep-del" title="%del_ep%" data-id="%id%" type="button">
                                        <i class="bi-trash3-fill"></i>
                                    </button>
                                </td>
                            </tr>\n`;
                    if (self.character_data.episodes.length > 0) {
                        targetDomId = "#char_eps_table_container table tbody";
                        $.each(self.character_data.episodes, function (k,i) {
                            rowData.push(rowTpl.replace(/%id%/g, i).replace("%episode%", i.toString() + " &ndash;" + episodesObj.list[i].name).replace("%del_ep%", window.JS_STRINGS.del_ep))
                        });
                        $("#char_no_eps").hide();
                        $("#char_eps_table_container").show();
                    } else {
                        $("#char_no_eps").show();
                        $("#char_eps_table_container").hide();
                    }
                    break;
            
                case ("relations"):
                    rowTpl = `<tr>
                                <td class="ps-3"><a href="#/character/%id%">%full_name%</a></td>
                                <td>%relationship%</td>
                                <td><i class="bi-gender-%sex_slug%" title="%sex_word%"></i></td>
                                <td class="text-end pe-3">
                                    <button class="btn btn-sm btn-outline-dark char-rel-show" title="%display%" data-id="%id%" type="button">
                                        <i class="bi-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger char-rel-del" title="%del_rel%" data-id="%id% type="button">
                                        <i class="bi-trash3-fill"></i>
                                    </button>
                                </td>
                            </tr>\n`
                    if (self.character_data.relationships.length > 0) {
                        $.each(self.character_data.relationships, function (k,i) {
                            var row = rowTpl.replace(/%id%/g, i.id).replace("%full_name%", i.name).replace("%relationship%", relationshipsObj[i.relations.id]);
                            row = row.replace("%sex_slug%", i.sex).replace("%sex_word%", window.JS_STRINGS.sex_word[i.sex]);
                            row = row.replace("%display%", window.JS_STRINGS.display).replace("%del_rel%", window.JS_STRINGS.del_rel)
                            rowData.push(row);
                        })

                        $("#char_no_relationships").hide();
                        $("#char_relationships_table_container").show();
                    } else {
                        $("#char_no_relationships").show();
                        $("#char_relationships_table_container").hide();
                    }
                    break;

                default:
                    return false;
            }
            if (targetDomId != "") {
                $(targetDomId).html(rowData.join("\n"));
                connectEvents(target);
            }
        }

        /* public methods */
        /**
         * add a new character via the add character button
         */
        this.add = function() {
            if (window.saveState) { 
                if (window.navObj) {
                    window.navObj.goNav = true;
                }
                window.saveState.oldHash = window.location.hash;
                window.location.hash = '/character/add';
                window.saveState.check();
            }
            $("#character_add").show();
            $("#character_edit").hide();
            $(".form-control").val("");
            $(".form-select").val(0);
            $("#char_dev_state").val("notdefined");
            $("#character_image").css("background-image", "url(assets/empty-char-picture.svg)");
            $("#character_image_body").css("background-image", "url(assets/empty-char-t-pose.svg)");
            $("#char_no_relationships").show();
            $("#char_relationships_table_container").hide();
            $("#char_relationships_table_container table tbody").html("");
            $("#char_no_eps").show();
            $("#char_eps_table_container").hide();
            $("#char_eps_table_container table tbody").html("");
            $("#add_char_btn").fadeIn();
            $("#nav_characters").addClass("active");
            $("#char_detail").fadeIn().promise().done(function() { $("#char_first_name").focus(); });
        }

        /**
         * Delete a given character
         */
        this.delete = function() {}

        /**
         * add episode to character via modal
         * 
         * @param {boolean} confirm : execute adding the episode to the character
         */
        this.episodeAdd = function(confirm) {
            if (typeof(confirm) != "boolean") { confirm = false; }

            /* clear errors */
            $(".form-validate").removeClass("is-invalid");
            $("#appendEpisodeModal_episode_exists_msg").hide();

            if (confirm === true) {
                var epExists = false;
                var epNum = 0;
                var epTitle = "";
                var go = true;

                /* validate content */
                if ($("#appendEpisodeModal_add").hasClass("active")) {
                    epNum = parseInt($("#append_new_episode_num").val());
                    epExists = episodesObj.epIdExists(epNum);
                    epTitle = $("#append_new_episode_title").val();

                    if (epNum == NaN || epExists) {
                        $("#append_new_episode_num").addClass("is-invalid");
                        if (epExists) {
                            $("#appendEpisodeModal_episode_exists_msg").show();
                        }
                        $("#append_new_episode_num").focus();
                        go = false;
                    }
                    if (epTitle.length < 1) {
                        $("#append_new_episode_title").addClass("is-invalid");
                        go = false;
                    }            

                    if (go) {
                        episodesObj.update({"id": epNum, "name": epTitle});
                    }

                } else {
                    epNum = parseInt($("#append_selected_episode").val());
                    epTitle = episodesObj.list[epNum.toString()].name;
                }

                /* process episode content */
                if (go) {
                    self.character_data.episodes.push(epNum);
                    $("#appendEpisodeModal").modal("hide");
                    writeTable("episodes");
                }
                
            } else {
                $("#appendEpisodeModal").modal("show");
                $("#appendEpisodeModal_select_tab").trigger("click"); // for some reason I need to do this or the tabs don't work; *slaps forehead*    
                if ($("#append_selected_episode").prop("disabled")) {
                    $("#appendEpisodeModal_add_tab").trigger("click"); 
                    setTimeout(function() { $("#append_new_episode_num").focus(); }, 600);
                }
            }

        }

        /**
         * delete episode from character via modal
         * 
         * @param {number}  id       ID of episode to delete
         * @param {boolean} confirm  Confirms deletion of item from modal
         */
        this.episodeDel = function(id, confirm) {
            if (typeof(id) != "number") { return false; }
            if (typeof(confirm) != "boolean") { confirm = false; } 

            var delModal = $("#deleteItemModal")
            var delYesButton = $("#deleteItemModal_yes")
            delYesButton.off("click"); /* disable clicking the Yes button */

            if (confirm) {
                var arrLoc = self.character_data.episodes.indexOf(id);
                self.character_data.episodes.splice(arrLoc,1);
                writeTable("episodes");
                $(delModal).modal("hide");
            } else {
                $("#deleteItemModal_title_item").html(capitalizeFirst(window.JS_STRINGS["del_ep"]));
                $("#deleteItemModal_msg").html(capitalizeFirst(window.JS_STRINGS["del_modal_text"].replace("%item%", window.JS_STRINGS["ep_num"] + " " + id)));                
                $(delYesButton).click(function() { self.episodeDel(id, true); });
                $(delModal).modal("show")
            }
        }

        /**
         * Fetch data from character form
         */
        this.fetchFormData = function() {}

        /**
         * load data function
         * 
         * @param {integer} id : id of the site to load
         */
        this.load = function(id) {
            if (typeof(id) != "number"){
                if (id != "add") { id = "add"; }
            }
            
            if (id == "add") {
                self.add();    
            } else {
                $.post("/fetch", { "what": "character", "id": id}, 
                    function (r) {
                        if (r.error) {
                            /* flash error message here */
                            self.add();
                        } else {
                            self.character_data = validateData(r);
                            if (self.character_data === false) {
                                /* flash error message here */
                                self.add();
                            } else {
                                writeFormData();
                            }
                        }
                        window.loading.stop();
                    });
            }

        }

        /**
         * add relationship to character via modal
         */
        this.relationAdd = function() {}
   
        /**
         * delete relationship from character via modal
         */
        this.relationDel = function() {}

        /**
         * write data in the JSON data object into the form
         */
        this.writeFormData = function() {}

        /**
         * add image to or remove image from character
         * 
         * @param {string}  action  : whether to "add" or "remove"
         * @param {boolean} confirm : confirm removal; only works with "remove"
         */
        this.imageAddRemove = function(action, confirm) {}

        /**
         * Display image modal
         * 
         * @param {string} imgType : which image to handle: "body" or "head"
         */
        this.imageHandler = function(imgType) {}

        connectEvents();
    }
    
    window.characterObj = new Character()
});
