/* Men of Courage Character Database
 *
 * JavaScript engine for the character object
 * 
 *   File name: ui.5-character.js
 *   Date Created: 2024-09-24
 *   Date Modified: 2024-12-04
 * 
 */
/* initialize the object */
$(document).ready(function (){
    Character = function() {

        /* parameters */
        /* public */
        this.character_data = { id: 0, first_name: "", last_name: "", sex: "0", age: "",
            physical: "", personality: "", employment: "", image_head: "",
            image_body: "", animation_status: "notdefined", residence: 0, marital_status: "0",
            acted_by: 0, relationships: [], episodes: []};
        this.nextId = 1;
      
        /* private */
        var csrfToken = $("#csrf_token").val();
        var optionTpl = '<option value="$option$">$item$</option>\n';
        var firstLoad = true;

        /* self-reference */
        var self = this;


        /* methods */
        /* private methods */
        /**
         * connect events to buttons and select boxes
         * 
         * @param {string} target : What target to rewrite for
         */
        var connectEvents = function(target) {
            if (typeof(target) != "string") { target = ""; }

            if (target == "") {
                $("#char_btn_add_episode").click(function () { self.episodeAdd(false); });
                $("#appendEpisodeModal_save").click(function () { self.episodeAdd(true); });
                $("#char_btn_add_relationship").click(function () { self.relationAdd("add"); });
                $("#appendRelationshipModal_save").click(function () { self.relationAdd("confirm"); });
                $("#save_char_btn").click(self.writeDbData);
                $("#character_image_body").click(function () { self.imageHandler("body"); });
                $("#character_image").click(function () { self.imageHandler("head"); });
                $("#imgBoxModal_del").click(function () { self.imageAddRemove("remove", false)});
                $("#imgBoxModal_load").click(function () { self.imageAddRemove("add", false)});
                $("#del_char_btn").click(function () { self.delete(false); })
            }
            if (target == "episodes" || target == "") {
                $(".char-ep-del").click(function () { self.episodeDel($(this).data("id")); } );
            }
            if (target == "relationships" || target == "") {
                $(".char-rel-show").click(function () { self.relationAdd("edit", $(this).data("rowid")); });
                $(".char-rel-del").click(function () { self.relationDel($(this).data("rowid"), false); });
            }
            if (target == "charFormConnect") {
                $(".form-control").blur(self.fetchFormData);
                $(".form-select").change(self.fetchFormData);
            }
            if (target == "charFormDisconnect") {
                $(".form-control").off("blur");
                $(".form-select").off("change");
            }
        }

        /**
         * Display the layer
         * 
         * @param {string} action : "add" (default) or "edit"
         */
        var display = function (action) {
            if (typeof(action) != "string") { action = "add"; }

            $.scrollTo(0);

            switch(action) {
                case "edit":
                    $("#character_add").hide();
                    $("#character_edit").show();
                    $("#add_char_btn").fadeIn();
                    break;

                default:
                    $("#character_add").show();
                    $("#character_edit").hide();
                    break;
            }

            $("#char_detail").fadeIn();
            window.loading.stop();
        }        

        /**
         * verifies data pulled from the form
         * 
         * @param {object} data          : JSON object to be checked through
         * @param {string} skeleton_type : what skeleton to use: 'base', 'relationships'
         */
        var verifyData = function(data, skeleton_type) {
            if (typeof(skeleton_type) != 'string') { skeleton_type = 'base'}

            var item = 0;
            var key = '';
            var skeleton = { id: typeof(0), first_name: typeof(""), last_name: typeof(""), 
                    sex: typeof(""), age: typeof(""), physical: typeof(""), 
                    personality: typeof(""), employment: typeof(""), image_head: typeof(""),
                    image_body: typeof(""), animation_status: typeof(""), residence: typeof(0), 
                    marital_status: typeof(""), acted_by: typeof(0), relationships: typeof([]), 
                    episodes: typeof([])};
            
            var relationships_skeleton = {rid: typeof(0), id: typeof(0), name: typeof(""), sex: typeof(""), reciprocal: typeof(true), relation: typeof("")}
            var result = false;
            var test = skeleton;

            /* select alternative skeleton */
            switch (skeleton_type) {
                case 'relationships':
                    test = relationships_skeleton;
                    break;
            }
            
            if (typeof(data) == typeof(test)) {
                if (Object.keys(data).length == Object.keys(test).length) {
                    while (item >= 0 && item < Object.keys(test).length) {
                        key = Object.keys(data)[item];
                        if (Object.keys(test).indexOf(key) > -1) {
                            if (test[key] == "number" && typeof(data[key]) == "string") {
                                data[key] = parseInt(data[key]);
                            }
                            if (typeof(data[key]) == test[key]) {
                                if (key == "relationships" && Object.keys(data[key]).length > 0) {
                                    $.each(data[key], function (k,i) {
                                        item = (verifyData(i, "relationships")) ? item : -2;
                                    });
                                } else if (key == "episodes") {
                                    if (Array.isArray(data[key])) {
                                        if (data[key].length > 0) { // this got moved into an inner loop so that we don't get a false negative if the array is empty
                                            $.each(data[key], function (k,i) {
                                                if (typeof(parseInt(i)) != "number") { item = -2; }
                                            });
                                        }
                                    } else {
                                        item = -2
                                    }
                                }
                            } else {
                                item = -2;
                            }
                            item++;
                        } else {
                            item = -1;
                        }
                    }
                    result = (item >= 0) ? data : false;
                }
            }
            
            return result;
        }

        /**
         * write data to the relationship and episode tables
         * 
         * @param {string} target : reference to the table to write to ("episodes" or "relationships")
         * @returns               : nothing if successful, false if target not defined or invalid
         */
        var writeTable = function(target) {
            if (typeof(target) != "string") { return false; }

            var rowTpl = "";
            var rowData = [];
            var targetDomId = "";

            switch (target) {
                case ("episodes"):
                    rowTpl = `<tr>
                                <td><a href="#/episodes/\$id\$">$episode$</a></td>
                                <td class="text-end pe-3">
                                    <button class="btn btn-sm btn-outline-danger char-ep-del" title="$del_ep$" data-id="$id$" type="button">
                                        <i class="bi-trash3-fill"></i>
                                    </button>
                                </td>
                            </tr>\n`;
                    if (self.character_data.episodes.length > 0) {
                        targetDomId = "#char_eps_table_container table tbody";
                        $.each(self.character_data.episodes, function (k,i) {
                            rowData.push(rowTpl.replace(/\$id\$/g, i).replace("$episode$", i.toString() + " &ndash;" + episodesObj.list[i].name).replace("$del_ep$", window.JS_STRINGS.del_ep))
                        });
                        $("#char_no_eps").hide();
                        $("#char_eps_table_container").show();
                    } else {
                        $("#char_no_eps").show();
                        $("#char_eps_table_container").hide();
                    }
                    break;
            
                case ("relationships"):
                    rowTpl = `<tr>
                                <td class="ps-3"><a href="#/character/\$id\$">$full_name$</a></td>
                                <td>$relationship$</td>
                                <td><i class="bi-gender-$sex_slug$" title="$sex_word$"></i></td>
                                <td class="text-end pe-3">
                                    <button class="btn btn-sm btn-outline-dark char-rel-show" title="$display$" data-rowid="$rowId$" type="button">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger char-rel-del" title="$del_rel$" data-rowid="$rowId$" type="button">
                                        <i class="bi-trash3-fill"></i>
                                    </button>
                                </td>
                            </tr>\n`
                    if (self.character_data.relationships.length > 0) {
                        targetDomId = "#char_relationships_table_container table tbody";
                        /* initially we sort the self.character_data.relationships object alphabetically by name */
                        var lang = document.documentElement.lang || "en";
                        self.character_data.relationships.sort((a,b) => a.name.localeCompare(b.name, lang));           

                        /* now we write out the sorted list */
                        $.each(self.character_data.relationships, function (k,i) {
                            var row = rowTpl.replace(/\$id\$/g, i.id).replace("$full_name$", i.name).replace("$relationship$", window.relationshipObj.getNameFromSlug(i.relation));
                            row = row.replace("$sex_slug$", i.sex).replace("$sex_word$", window.JS_STRINGS[`sex_word_${i.sex}`]);
                            row = row.replace("$display$", window.JS_STRINGS.edit).replace("$del_rel$", window.JS_STRINGS.del_rel);
                            row = row.replace(/\$rowId\$/g, k); /* this is reference so we can edit or delete */
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
         * add a new character via the add character button         * 
         */
        this.add = function() {
            var go = true;
            
            if (window.saveState) { 
                if (window.navObj) {
                    window.navObj.goNav = false; // we shouldn't navigate unless we get the check.
                }
                window.saveState.oldHash = window.location.hash;
                window.location.hash = '/character/add';
                window.saveState.check();
                if (window.saveState.dirty) { go = false; } // not sure if this is necessary. Best to add it so that we won't navigate away if we pop up the item...
            }

            if (go) {
                /* reset character object */
                self.character_data = { id: 0, first_name: "", last_name: "", sex: "0", age: "",
                    physical: "", personality: "", employment: "", image_head: "",
                    image_body: "", animation_status: "notdefined", residence: 0, marital_status: "0",
                    acted_by: 0, relationships: [], episodes: []};

                self.writeFormData();
            }
        }

        /**
         * Delete a given character
         * 
         * @param {boolean} confirm : confirm deletion of character
         */
        this.delete = function(confirm) {
            if (typeof(confirm) != "boolean") { confirm = false; }

            if (confirm) {
                window.saveState.clearUnsaved();
                window.charListObj.removeCharacter(self.character_data.id);
                $("#deleteItemModal_yes").off("click");
                $("#deleteItemModal").modal("hide");
                window.location.hash = "#/";
                
                let unixTimestamp = Math.floor(Date.now() / 1000);
                $.post("api/deleteItem", {"csrf_token": csrfToken, "what": "character", "id": self.character_data.id}, function (r) {
                    var charString = `${window.JS_STRINGS["character"]} <em>${self.character_data.first_name} ${self.character_data.last_name}</em>`
                    if (r.error) {
                        window.flash.display(capitalizeFirst(window.JS_STRINGS["es_del_failure"].replace("$item$", charString)), "warning");
                    } else {
                        window.flash.display(capitalizeFirst(window.JS_STRINGS["del_success"].replace("$item$", charString)), "success");
                    }
                }).fail(function () { window.flash.display(window.JS_STRINGS['general_failure'].replace("$action$", window.JS_STRINGS['del_char'].toLocaleLowerCase()), "danger"); });;
            } else {
                $("#deleteItemModal_title_item").html(window.JS_STRINGS['del_character']);
                $("#deleteItemModal_msg").html(window.JS_STRINGS['del_character_msg'].replace("$name$", `${self.character_data.first_name} ${self.character_data.last_name}`));
                $("#deleteItemModal_yes").click(function () { self.delete(true); });
                $("#deleteItemModal").modal("show");
            }
        }

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

                window.saveState.setUnsaved();

                /* validate content */
                if ($("#appendEpisodeModal_add").hasClass("active")) {
                    epNum = parseInt($("#append_new_episode_num").val());
                    epExists = episodesObj.epIdExists(epNum);
                    epTitle = $("#append_new_episode_title").val();

                    if (isNaN(epNum) || epExists) {
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

                /* update select box on episodes */
                self.updateAvailableEpisodes();

            } else {
                $("#append_selected_episode").val("0");
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
         * @param {number}  id      : ID of episode to delete
         * @param {boolean} confirm : Confirms deletion of item from modal
         */
        this.episodeDel = function(id, confirm) {
            if (typeof(id) != "number") { return false; }
            if (typeof(confirm) != "boolean") { confirm = false; } 

            var delModal = $("#deleteItemModal")
            var delYesButton = $("#deleteItemModal_yes")
            delYesButton.off("click"); /* disable clicking the Yes button */

            if (confirm) {
                window.saveState.setUnsaved();
                
                var arrLoc = self.character_data.episodes.indexOf(id);
                self.character_data.episodes.splice(arrLoc,1);
                writeTable("episodes");
                $(delModal).modal("hide");

                /* update select box on episodes */
                self.updateAvailableEpisodes();

            } else {
                $("#deleteItemModal_title_item").html(capitalizeFirst(window.JS_STRINGS["del_ep"]));
                $("#deleteItemModal_msg").html(capitalizeFirst(window.JS_STRINGS["del_modal_text"].replace("$item$", window.JS_STRINGS["ep_num"] + " " + id)));                
                $(delYesButton).click(function() { self.episodeDel(id, true); });
                $(delModal).modal("show")
            }
        }

        /**
         * Fetch data from character form
         */
        this.fetchFormData = function(firstLoad) {
            if (typeof(firstLoad) != "boolean") { firstLoad = false; }

            var data = { id: 0, first_name: "", last_name: "", sex: "0", age: "",
                physical: "", personality: "", employment: "", image_head: "",
                image_body: "", animation_status: "notdefined", residence: 0, marital_status: "0",
                acted_by: 0, relationships: [], episodes: []};
            
            /* insert data */
            $.each(data, function (k,i) {
                // we pull these from self.character_data because they are updated differently
                var except = ["id","image_head", "image_body", "relationships", "episodes"];
                var select = ["acted_by", "animation_status", "dev_state", "marital_status", "residence", "sex"];
                var textArea = ["physical", "personality"];
                var domName = "";

                if (except.indexOf(k) > -1) {
                    data[k] = self.character_data[k]; 
                } else {
                    domName = (select.indexOf(k) >= 0) ? `select[name=${k}]` : (textArea.indexOf(k) >=0) ? `textarea[name=${k}]` : `input[name=${k}]`;
                    if (data[k] != $(domName).val()) {
                        data[k] = $(domName).val();
                        if (window.saveState) { window.saveState.setUnsaved(); }
                    }
                }
            });

            self.character_data = data; 
        }

        /**
         * load data function
         * 
         * @param {integer} id : id of the site to load
         */
        this.load = function(id) {
            if (typeof(id) != "number") {
                if (isNaN(parseInt(id))) { // because if we don't have an integer, it won't be in the database
                    if (id != "add") { id = "add"; }
                }
            }
            
            if (id == "add") {
                self.add();
                display("add");
                setTimeout(function () { $("input[name=first_name]").focus() }, 600);
            } else {
                $.post("/api/fetch", { "what": "character", "id": id, "csrf_token": csrfToken}, 
                    function (r) {
                        if (r.error) {
                            window.flash.display(capitalizeFirst(window.JS_STRINGS["es_read_failure"].replace("$item$", window.JS_STRINGS["character"])), "warning");
                            self.add();
                        } else {
                            self.nextId = r.next;
                            self.character_data = verifyData(r.character);
                            if (self.character_data === false) {
                                window.flash.display(capitalizeFirst(window.JS_STRINGS["es_read_nodata"].replace("$item$", window.JS_STRINGS["character"])), "warning");
                                self.add();
                                display("add");
                            } else {
                                window.flash.display(capitalizeFirst(window.JS_STRINGS["es_read_success"].replace("$item$", window.JS_STRINGS["character"])), "success");
                                self.writeFormData();
                                display("edit");
                            }
                        }
                        window.loading.stop();
                    }).fail(function (r) { 
                        window.loading.stop();
                        window.errDialog(window.JS_STRINGS["es_no_db_connection"]);
                    });
            }

        }

        /**
         * add relationship to character via modal
         * 
         * @param {string} action : whether to add, edit, or confirm save
         * @param {number} rowId  : id or row in relationships which contains person
         */
        this.relationAdd = function(action, rowId) {
            /* load the relationship items */
            if (typeof(action) != "string") { action = "add"; } /* so we don't trigger the save */

            /* check for missing window.charListObj here, because it is needed multiple times below! */
            if (!window.charListObj) {
                $("#majorErrorModal_text").html(window.JS_STRINGS["char_no_charListObj"]);
                $("#majorErrorModal").modal("show");
                return false;
            }

            $("#appendRelationshipModal_character").removeClass("is-invalid");
            $("#appendRelationshipModal_relation").removeClass("is-invalid");

            if (action == "confirm") {
                window.saveState.setUnsaved();

                var go = true;
                var charId = $("#appendRelationshipModal_character").val();
                var doReciprocal = ($("#appendRelationshipModal_reciprocal").is(":checked")) ? true : false;
                var relSlug = $("#appendRelationshipModal_relation").val();
                var relationshipId = (! isNaN(parseInt($("#appendRelationshipModal_rid").val()))) ? parseInt($("#appendRelationshipModal_rid").val()) : 0;

                /* validate contents */
                if (charId == "0") {
                    $("#appendRelationshipModal_character").addClass("is-invalid");
                    go = false;
                }
                if (relSlug == "0") {
                    $("#appendRelationshipModal_relation").addClass("is-invalid");
                    go = false;
                }

                if (go) {
                    var relObj = { 
                        "rid": relationshipId,
                        "id": charId, 
                        "name": window.charListObj.list[charId].name, 
                        "sex": window.charListObj.list[charId].sex, 
                        "reciprocal": doReciprocal,
                        "relation": relSlug 
                    };
    
                    if ($("#appendRelationshipModal_action").val() == "add") {
                        self.character_data.relationships.push(relObj);
                    } else {
                        var rowId = parseInt($("#appendRelationshipModal_action").val());
                        if (! isNaN(rowId)) {
                            self.character_data.relationships[rowId] = relObj;
                        } else {
                            window.flash.display(window.JS_STRINGS.relation_reciprocal_load_error, "danger");
                        }
                    }

                    writeTable("relationships");

                    $("#appendRelationshipModal").modal("hide");
                }
            } else {
                /* first build the list and omit the current character, if in the list */
                    $("#appendRelationshipModal_noCharacters").hide();
                    $("#appendRelationshipModal_form").hide();
                    $("#appendRelationshipModal_save").prop("disabled", false);
                    $("#appendRelationshipModal_reciprocal_action").html(window.JS_STRINGS[`relation_reciprocal_action_${action}`]);
                    $("#appendRelationshipModal_action").html("add");
                    $("#appendRelationshipModal_reciprocal").prop("checked", true);

                    var otherCharKey = "add";
                    var otherCharId = "0";
                    var otherCharSlug = "0";
                    var relationshipId = "0";

                    if (action == "edit") {
                        relationshipId = self.character_data.relationships[rowId].rid;
                        otherCharKey = rowId;
                        otherCharId = self.character_data.relationships[rowId].id;
                        otherCharSlug = self.character_data.relationships[rowId].relation;
                    }

                    $("#appendRelationshipModal_action").val(otherCharKey);
                    $("#appendRelationshipModal_rid").val(relationshipId);

                    if (Object.keys(window.charListObj.list).length > 0) {
                        var thisCharacter = self.character_data.id;
                        var optionTags = [`<option value="0">${window.JS_STRINGS.select_character}</option>`];
                        $.each(window.charListObj.sortListByName(), function (k,i) {
                            if (window.charListObj.list[i].id != thisCharacter) {
                                optionTags.push(`<option value="${window.charListObj.list[i].id}">${window.charListObj.list[i].name}</option>`);
                            }
                        });
                        dselectRemove("#appendRelationshipModal_character");
                        $("#appendRelationshipModal_character").html(optionTags.join("\n"));
                        $("#appendRelationshipModal_character").val(otherCharId);
                        dselect(document.querySelector("#appendRelationshipModal_character"), { search: true, maxHeight: "280px" });
                        dselectLocalize("appendRelationshipModal_character", { "search": window.JS_STRINGS.dselect_search, "noresults": window.JS_STRINGS.dselect_noresults });
                        dselectRemove("#appendRelationshipModal_relation");
                        $("#appendRelationshipModal_relation").val(otherCharSlug);
                        dselect(document.querySelector("#appendRelationshipModal_relation"), { search: true, maxHeight: "280px" });
                        dselectLocalize("appendRelationshipModal_relation", {"search": window.JS_STRINGS.dselect_select, "noresults": window.JS_STRINGS.dselect_noresults});
                        $("#appendRelationshipModal_form").show();
                    } else {
                        $("#appendRelationshipModal_noCharacters").show();                        
                        $("#appendRelationshipModal_save").prop("disabled", true);
                    }
                    
                    $("#appendRelationshipModal").modal("show");
            } 

        }


        /**
         * delete relationship from character via modal
         * 
         * @param {number}  rowId  : row in relationships array to delete
         * @param {boolean} confirm : 
         */
        this.relationDel = function(rowId, confirm) {
            if (typeof(rowId) != "number") {
                rowId = parseInt(rowId);
                if (isNaN(rowId)) { return false; }
            }

            if (confirm) {
                window.saveState.setUnsaved();

                self.character_data.relationships.splice(rowId, 1);
                writeTable("relationships");
                $("#deleteItemModal_yes").off("click");
                $("#deleteItemModal").modal("hide");
            } else {
                var msg = window.JS_STRINGS.del_rel_text.replace("$main$", `${self.character_data.first_name} ${self.character_data.last_name}`);
                msg = msg.replace("$other$", window.charListObj.list[self.character_data.relationships[rowId].id].name);
                msg = msg.replace("$relationship$", window.relationshipObj.getNameFromSlug(self.character_data.relationships[rowId].relation));
                $("#deleteItemModal_title_item").html(window.JS_STRINGS.del_rel);
                $("#deleteItemModal_msg").html(msg);
                $("#deleteItemModal_yes").click(function () { self.relationDel(rowId, true); });
                $("#deleteItemModal").modal("show");
            }
        }



        /**
         * Update available episodes in append Episode modal
         */
        this.updateAvailableEpisodes = function () {
            var select = "";

            if (Object.keys(window.episodesObj.list).length > 0) { 
                $.each(window.episodesObj.list, function (k,e) { /* k=key; e=episode */
                    if (self.character_data.episodes.indexOf(e.id) < 0) {
                        select += optionTpl.replace("$option$", e.id).replace("$item$", `${e.id} &ndash; ${e.name}`);
                    }
                });
            }
                        
            if (select == "") {
                dselectRemove("#append_selected_episode");
                $("#append_selected_episode").html(optionTpl.replace("$option$", "0").replace("$item$", window.JS_STRINGS.episode_none));
                $("#append_selected_episode").prop("disabled", true);
            } else {
                select = optionTpl.replace("$option$", "0").replace("$item$", window.JS_STRINGS.select_episode_here) + select;
                $("#append_selected_episode").html(select);
                $("#append_selected_episode").prop("disabled", false);
                dselect(document.querySelector("#append_selected_episode"), { search: true, maxHeight: "280px" });
                dselectLocalize("#append_selected_episode", { "search": window.JS_STRINGS.dselect_search, "noresults": window.JS_STRINGS.dselect_noresults });
            }            

        }


        /**
         * write data to database
         */
        this.writeDbData = function() {
            var data = {};
            $(".form-validate").removeClass("is-invalid");

            /* verify required fields are filled in  */
            $.each(["#char_first_name", "#char_sex", "#char_marital_status"], function(k, i) {
                let value = $(i).val();
                if (value.length < 1 || parseInt(value) < 1) {
                    $(i).addClass("is-invalid");
                    data = false;
                }
            });
            
            if (data === false) { 
                $(window).scrollTo(0);
                return false; 
            }
            
            /* load data from form -- just to be sure */
            self.fetchFormData();

            data = verifyData(self.character_data, "base");

            if (data === false) {
                $("#majorErrorModal_text").html(window.JS_STRINGS["char_invalid_data"]);
                $("#majorErrorModal").modal("show");
                return false;
            }

            /* add character to character list */
            if (window.charListObj){
                var id = window.charListObj.updateList(self.character_data);
                if (self.character_data.id == 0) { 
                    self.character_data.id = id; 
                    $("input[name=id]").val(id);
                    
                    /* switch interface to editing mode */
                    $("#character_add").hide();
                    $("#character_edit").show();
                    $("#add_char_btn").show();
                }
                if (window.saveState) { window.saveState.clearUnsaved(); } /* make sure that we are now saved */
                $(window).scrollTo(0);                                     /* back to top */
                window.flash.display(window.JS_STRINGS["char_saved"], "success");
            } else {
                $("#majorErrorModal_text").html(window.JS_STRINGS["char_not_saved"]);
                $("#majorErrorModal").modal("show");
            }
          
            /* convert data */
            var send = {"csrf_token": csrfToken, "what": "character", "data": JSON.stringify(data)}

            $.post("/api/write", send, function (r) {
                if (r.error) {
                    window.flash.display(window.JS_STRINGS["es_write_failure"].replace("$item$", `<i>${data.first_name} ${data.last_name}</i>`), "warning");
                    console.log(r.error);
                } else {
                    window.flash.display(window.JS_STRINGS["es_write_success"].replace("$item$", `<i>${data.first_name} ${data.last_name}</i>`), "success");
                    window.episodesObj.load();
                    window.saveState.clearUnsaved();
                }
            }).fail(function () { window.flash.display(window.JS_STRINGS['general_failure'].replace("$action$", window.JS_STRINGS['string_written']), "danger"); });;
        }

        /**
         * write data in the JSON data object into the form
         */
        this.writeFormData = function() {
            /* make sure we don't trigger saveState.dirty while writing */
            connectEvents("charFormDisconnect");

            /* check for proper style of actor and residence boxes */
            if (window.actorsObj) {
                window.actorsObj.write();
            }
            if (window.residenceObj) {
                window.residenceObj.write();
            }

            /* load up the various fields */
            $.each(self.character_data, function (k,i) {
                if (k == "episodes" || k == "relationships") {
                    writeTable(k);
                    if (k == "episodes") { /* fill in select */
                        self.updateAvailableEpisodes();
                    }
                } else if (k == "image_head") {
                    if (i == "") {
                        $("#character_image").css("background-image", "url(/assets/empty-char-picture.svg)");
                    } else {
                        $("#character_image").css("background-image", `url(${i})`);
                    }
                } else if (k == "image_body") {
                    if (i == "") {
                        $("#character_image_body").css("background-image", "url(/assets/empty-char-t-pose.svg)");
                    } else {
                        $("#character_image_body").css("background-image", `url(${i})`);
                    }
                } else if (k =="physical" || k == "personality") {
                    $(`textarea[name=${k}]`).val(i);
                } else if (k == "sex" || k == "marital_status" || k == "animation_status" || k == "residence" || k == "acted_by") {
                    if (k == "residence" || k == "acted_by") {
                        if (!$(`#char_${k}`).prop("disabled")) {
                            dselectRemove(`#char_${k}`);
                        }
                    }
                    $(`select[name=${k}]`).val(i);
                    if (k == "residence" || k == "acted_by") {
                        if (!$(`#char_${k}`).prop("disabled")) {
                            dselect(document.querySelector(`#char_${k}`), { search: true, maxHeight: "280px" });
                            dselectLocalize(`#char_${k}`, { "search": window.JS_STRINGS.dselect_search, "noresults": window.JS_STRINGS.dselect_noresults });
                        }
                    }
                } else {
                    $(`input[name=${k}]`).val(i);
                }
            });

            /* once everything is written trigger change tracking */
            connectEvents("charFormConnect");
        }

        /**
         * add image to or remove image from character
         * 
         * @param {string}  action  : whether to "add" or "remove"
         * @param {boolean} confirm : confirm removal; only works with "remove"
         */
        this.imageAddRemove = function(action, confirm) {
            if (typeof(action) != "string") { return false; }
            if (typeof(confirm) != "boolean") { confirm = false; }

            if ($("#imageBoxModal_body_headshot").css("display") != "none") {
                var target = "head";
            } else if ($("#imageBoxModal_body_bodyshot").css("display") != "none") { 
                var target = "body"
                var imageTitle = window.JS_STRINGS.image_body_shot;
            }

            window.saveState.setUnsaved(); /* we now are dirty so we'll need to save things */

            if (action == "add") {

                let file =$("#imgBoxModal_img")[0].files[0];
                if (file) {
                    let reader = new FileReader();
                    /* for speed's sake loads the new image both into the character_data object AND the image in the modal */
                    reader.onload = function (content) {
                        let b64str = content.target.result;
                        let imageTitle = "";
                        if (target == "body") {
                            self.character_data.image_body = b64str;
                            imageTitle = window.JS_STRINGS.image_body_shot;
                        } else if (target == "head") {
                            self.character_data.image_head = b64str;
                            imageTitle = window.JS_STRINGS.image_body_shot;
                        }
                        $("#largeImage").html(`<img alt="${imageTitle}" src="${b64str}">`);        
                        $("#imageBoxModal_body_save_success").slideDown();
                        $("#imageBoxModal_upload_img").fadeOut(400, function() { $("#imageBoxModal_delete_img").fadeIn(); });
                        setTimeout(function () { $("#imageBoxModal_body_save_success").slideUp(); }, 5000);
                        self.writeFormData();
                    }
                    reader.readAsDataURL(file);
                }

            } else if (action == "remove") {
                if (confirm) {
                    $("#deleteItemModal_yes").off("click");
                    $("#deleteItemModal").modal("hide");
                    if (target == "head") {
                        self.character_data.image_head = "";
                    } else if (target == "body") {
                        self.character_data.image_body = "";
                    }
                    self.writeFormData();
                    $("#largeImage").html("");
                    $("#imageBoxModal_body_del_success").slideDown();
                    $("#imageBoxModal_delete_img").fadeOut(400, function() { $("#imageBoxModal_upload_img").fadeIn(); })
                    setTimeout(function () { $("#imageBoxModal_body_del_success").slideUp(); }, 5000);
                } else {
                    if (target == "head") {
                        $("#deleteItemModal_msg").html(window.JS_STRINGS.del_image_head);
                    } else if (target == "body") {
                        $("#deleteItemModal_msg").html(window.JS_STRINGS.del_image_head);
                    }
                    $("#deleteItemModal_yes").click(function () { self.imageAddRemove("remove", true); });
                    $("#deleteItemModal").modal("show");
                }
            }
            /* if no action is passed we do nothing */
        }

        /**
         * Display image modal
         * 
         * @param {string} imgType : which image to handle: "body" or "head"
         */
        this.imageHandler = function(imgType) {
            if (typeof(imgType) != "string") {  return false;  }
            if (imgType != "body" && imgType != "head") { return false; }

            var titleDomId = "";
            var imageContent = "";
            var imageTitle = "";

            $("#largeImage").html("");
            $(".ibm-hide").hide(); /* hide all layers that are context sensitive */
            $("#imgBoxModal_img").val("");

            if (imgType == "body") {
                titleDomId = "#imageBoxModal_body_bodyshot";
                imageContent = self.character_data.image_body;
                imageTitle = window.JS_STRINGS.image_body_shot;
            } else if (imgType == "head") {
                titleDomId = "#imageBoxModal_body_headshot";
                imageContent = self.character_data.image_head;
                imageTitle = window.JS_STRINGS.image_head_shot;
            }

            $(titleDomId).show();

            if (imageContent != "") {
                $("#largeImage").html(`<img alt="${imageTitle}" src="${imageContent}">`);
                $("#imageBoxModal_delete_img").show();
            } else {
                $("#imageBoxModal_upload_img").show();
            }

            $("#imageBoxModal").modal("show");
        }

        connectEvents();
    }
    
    window.characterObj = new Character()
});
