/* Men of Courage Character Database
 *
 * JavaScript object for Reciprocal relationships
 * 
 *   File name: ui.relationships.js
 *   Date Created: 2024-09-27
 *   Date Modified: 2024-12-09
 * 
 */

$(document).ready(function () {
    /* initialize the object */
    Relationships = function () {
        /* properties */
        /* public */
        this.list = {}
        this.nextKey = 1;

        /* private */
        var csrfToken = $("#csrf_token").val();
        var editText = window.JS_STRINGS.edit;
        var optionTpl = '<option value="$option$">$item$</option>\n';
        var tableRow = `<tr>    
    <td class="col-3 ps-3">$main_relation$</td>
    <td class="col-3">$male_reciprocal_relation$</td>
    <td class="col-3">$female_reciprocal_relation$</td>
    <td class="col-3 text-end">
        <button class="btn btn-sm btn-outline-dark relationship-open" data-id="$id$" title="$edit$" type="button" role="button">
            <i class="bi bi-pencil"></i>
        </button>
    </td>
</tr>\n`;

        /* self-reference */
        var self = this;

        /* methods */
        /* private */
        /**
         * Connects the events to the buttons
         * 
         * @param {boolean} rewrite : only reconnect the .relationship-open class 
         */
        var connectEvents = function (rewrite) {
            if (typeof(rewrite) != "boolean") { rewrite = false; }

            if (!rewrite){
                $("#addEditRelationshipModal_save").click(self.update);
                $("#add_rel_btn button").click(function() { self.addEdit(0); });
                $("#load_default_relationships_btn").click(self.loadDefaults);
            }

            $(".relationship-open").click(function() { self.addEdit($(this).data("id")); });
        }

        /**
         * Create a unique slug from a source string
         * 
         * @param {string} source : the string to create the slug from
         */
        var makeSlug = function (source) {
            if (typeof(source) != "string") { source = ""; }

            var slug = "";
            var nextSlug = 1;
            var slugFound = false;
            var resetSlug = false;

            /* generate a random 10-character alphanumeric string */
            if (source == "") {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                
                for (var i=0; i<10; i++) { slug += chars.charAt(Math.floor(Math.random() * chars.length)); }
            } else {
                slug = source.normalize("NFD");
                slug = slug.replace(/[\u0300-\u036f]/g, "");
                slug = slug.replace(/[^a-zA-Z0-9 ]/g, "");
                slug = slug.replace(/ /g, "-");

                do  {
                    if (resetSlug) { 
                        slugFound = false;
                        resetSlug = false;
                    }
                    for (var j=0; j<Object.keys(self.list).length; j++) {
                        if (Object.keys(self.list)[j].slug == slug) { slugFound = true; }
                    }
                    if (slugFound) {
                        slug.substring(0, slug.lastIndexOf("_")) = slug + "_" + nextSlug;
                        resetSlug = true;
                    }
                } while (slugFound);
            }

            return slug.toLowerCase();
        }

        /**
         * sorts the relationships alphabetically by their name
         * 
         * @returns {array} : sorted objects
         */
        var sortRelations = function () {
            var sortArray = Object.entries(self.list);
            var sortedObj = {}
            return sortArray.sort((a,b) => a[1].name.localeCompare(b[1].name));
        }

        /* public */
        /**
         * Add or edit a relationship in the modal
         * 
         * @param {number} id : id of item to edit; set to 0 to add
         */
        this.addEdit = function (id) {
            if (typeof(id) != "number") {
                id = parseInt(id);
                if (isNaN(id)) { return false; }
            }

            /* make sure Id exists */
            if (id > 0 && Object.keys(self.list).indexOf(id.toString()) < 0) { 
                window.flash.display(window.JS_STRINGS["err_id_does_not_exist"].replace("$items$", window.JS_STRINGS["string_relation_types"]), "warning")
                id=0; 
            }

            $("#addEditRelationshipModal_id").val(id);
            $("#addEditRelationshipModal_slug").val((id < 1) ? "" : self.list[id].slug);
            $("#addEditRelationshipModal_rel_name").val((id < 1) ? "" : self.list[id].name);
            $("#addEditRelationshipModal_rel_sex").val((id < 1) ? "0" : self.list[id].sex);
            $("#addEditRelationshipModal_rel_rec_male").val((id < 1) ? "0" : self.list[id].reciprocal_male);
            dselect(document.querySelector("#addEditRelationshipModal_rel_rec_male"), { search: true });
            dselectLocalize("#addEditRelationshipModal_rel_rec_male", { "search": window.JS_STRINGS.dselect_search, "noresults": window.JS_STRINGS.dselect_noresults });
            $("#addEditRelationshipModal_rel_rec_female").val((id < 1) ? "0" : self.list[id].reciprocal_female);
            dselect(document.querySelector("#addEditRelationshipModal_rel_rec_female"), { search: true });
            dselectLocalize("#addEditRelationshipModal_rel_rec_female", { "search": window.JS_STRINGS.dselect_search, "noresults": window.JS_STRINGS.dselect_noresults });
            $("#addEditRelationshipModal").modal("show");
            setTimeout(function () {$("#addEditRelationshipModal_rel_name").focus(); }, 600);
        }

        /**
         * Display the relationship list
         * 
         * @param {boolean} updateOnly : whether or not to display actual content
         */
        this.display = function (updateOnly) {
            if (typeof(updateOnly) != 'boolean') { updateOnly = false; }
            /* display messages depending on whether data has been loaded or not */           
            if (Object.keys(self.list).length < 1) {
                $("#rel_list_table_container").hide();
                $("#rellist_no_chars").show();
                if ($("#relation_defaults_exist").val() == "True") {
                    $("#rellist_defaults").show();
                }
            } else {
                $("#rel_list_table_container").show();
                $("#rellist_no_chars").hide();
                $("#rellist_defaults").hide();
            }

            if (!updateOnly){
                /* display the actual content */
                $("#relation_list").fadeIn();
                $("#add_rel_btn").fadeIn();
                $("#nav_relations").addClass("active");
            }
        }

        /**
         * Finds the id of a slug, if it exists
         * 
         * @param {string} slug : slug to look for
         */
        this.getIdFromSlug = function (slug) {
            var id = 0;
            
            $.each(self.list, function (k, i) {
                if (i.slug == slug) { id = i.id; }
            });
            
            return id;
        }

        /**
         * Returns the descriptive name of a relationship using the slug
         * 
         * @param {string} slug : string to look for
         */
        this.getNameFromSlug = function (slug) {
            var name = "";

            $.each(self.list, function (k,i) {
                if (i.slug == slug) { name = i.name; }
            });

            return name;
        }

        /**
         * Load relationships from database
         */
        this.load = function () {
            $.getJSON("/api/fetch", {'what':'relation_types'}, 
                function (r) {
                    if (r.error) {
                        window.flash.display(window.JS_STRINGS["es_read_failure"].replace("$item$", window.JS_STRINGS["string_relation_types"]), "warning");
                        console.log(r.error);
                    } else {
                        self.list = r["relation_types"];
                        self.nextKey = parseInt(r['records']) + 1;
                        self.write();
                    } 
                }).fail(function () {
                    window.flash.display(window.JS_STRINGS["general_failure"].replace("$action$", window.JS_STRINGS["string_relation_types"]), "danger");
                });
        }

        /**
         * Load default relationships into database
         */
        this.loadDefaults = function () {
            window.loading.start();
            $("#rellist_defaults").fadeOut();
            $.getJSON("/api//write-default-relation-types", null, function (r) {
                if (r.error) {
                    window.flash.display(window.JS_STRINGS["es_write_failure"].replace("$item$", window.JS_STRINGS["string_relation_types"]), "warning");
                    console.log(r.error);
                } else {
                    self.load();
                    window.loading.stop();
                }
            }).fail(function () { window.flash.display(window.JS_STRINGS["general_failure"].replace("$action$", window.JS_STRINGS["string_relation_types"]), "danger"); });
        }

        /**
         * Write the new or edited relationship to the list and database
         */
        this.update = function () {
            /* validate fields */
            var go = true;
            $(".form-validate").removeClass("is-invalid")
            if ($("#addEditRelationshipModal_rel_name").val().length < 2) {
                $("#addEditRelationshipModal_rel_name").addClass("is-invalid");
                go = false;
            }
            if ($("#addEditRelationshipModal_rel_sex").val() == "0") {
                $("#addEditRelationshipModal_rel_sex").addClass("is-invalid");
                go = false;
            }

            /* process fields into base item */
            var slug = ($("#addEditRelationshipModal_slug").val() == "") ? makeSlug($("#addEditRelationshipModal_rel_name").val()) : $("#addEditRelationshipModal_slug").val();
            var data = { "id": ($("#addEditRelationshipModal_id").val() == 0) ? self.nextKey : $("#addEditRelationshipModal_id").val(), 
                         "slug": slug,
                         "name": $("#addEditRelationshipModal_rel_name").val(),
                         "reciprocal_female": ($("#addEditRelationshipModal_rel_rec_female").val() == "0") ? "" : ($("#addEditRelationshipModal_rel_rec_female").val() == "1") ? slug : $("#addEditRelationshipModal_rel_rec_female").val(),
                         "reciprocal_male": ($("#addEditRelationshipModal_rel_rec_male").val() == "0") ? "" : ($("#addEditRelationshipModal_rel_rec_female").val() == "1") ? slug : $("#addEditRelationshipModal_rel_rec_male").val(),
                         "sex": $("#addEditRelationshipModal_rel_sex").val()
            }
            if (data.id == self.nextKey) { self.nextKey++; }
            self.list[data.id.toString()] = data;

            /* update reciprocal relationships */
            $.each([self.getIdFromSlug(data.reciprocal_male), self.getIdFromSlug(data.reciprocal_female)], function(key, query) {
                if (query > 0) {
                    if (data.sex == 'female' || data.sex == 'both') {
                        self.list[query.toString()].reciprocal_female = data.slug;    
                    }
                    if (data.sex == 'male' || data.sex == 'both') {
                        self.list[query.toString()].reciprocal_male = data.slug;
                    } 
                }    
            });

            $("#addEditRelationshipModal").modal("hide");
            
            /* post updted content to the database */
            data["csrf_token"] = csrfToken;
            data["what"] = "relation_types";

            $.post("/api/write", data, function (r) {
                if (r.error) {
                    window.flash.display(window.JS_STRINGS["es_write_failure"].replace("$item$", window.JS_STRINGS["string_relation_types"]), "warning");
                    console.log(r.error);
                } else {
                    window.flash.display(window.JS_STRINGS["es_write_success"].replace("$item$", window.JS_STRINGS["string_relation_types"]), "success");
                }
            }).fail(function () { window.flash.display(window.JS_STRINGS["general_failure"].replace("$action$", window.JS_STRINGS["string_relation_types"]), "danger"); });

            self.write();
        }

        /**
         * Write the relationships to the HTML interface
         */
        this.write = function () {
            var loop = 0;
            var item = "";
            var out = "";
            var reciprocalFemale = "";
            var reciprocalMale = "";
            var relationsFemale = [];
            var relationsMale = [];
            var optionsCharacter = [optionTpl.replace("$option$", "0").replace("$item$", window.JS_STRINGS.select_relationship)]
            var optionsMale = [optionTpl.replace("$option$", "0").replace("$item$", window.JS_STRINGS.select_relationship),
                               optionTpl.replace("$option$", "1").replace("$item$", window.JS_STRINGS.this_relationship)]; // allows for the current relationship to be the reciprocal relationship
            var optionsFemale = [optionTpl.replace("$option$", "0").replace("$item$", window.JS_STRINGS.select_relationship),
                                 optionTpl.replace("$option$", "1").replace("$item$", window.JS_STRINGS.this_relationship)];
            
            /* write to the table */
            if (Object.keys(self.list).length > 0) {
                var sorted = sortRelations();
                for (loop=0; loop<sorted.length; loop++) {
                    item = sorted[loop][1];
                    /* get names of reciprocal relations */
                    reciprocalFemale = self.getNameFromSlug(item.reciprocal_female)
                    reciprocalMale = self.getNameFromSlug(item.reciprocal_male)
                    out = out + tableRow.replace("$main_relation$", item.name
                                       ).replace("$male_reciprocal_relation$", reciprocalMale
                                       ).replace("$female_reciprocal_relation$", reciprocalFemale
                                       ).replace("$id$", item.id
                                       ).replace("$edit$", editText);
                    if (item.sex == "male" || item.sex == "both") {
                        relationsMale.push(item.slug);
                    }
                    if (item.sex == "female" || item.sex == "both") {
                        relationsFemale.push(item.slug);
                    }
                    optionsCharacter.push(optionTpl.replace("$option$", item.slug).replace("$item$", item.name))
                }

                /* enable select box on the append modal */
                $("#appendRelationshipModal_relation").html(optionsCharacter.join("\n"));
                $("#appendRelationshipModal_relation").val("0");
                $("#appendRelationshipModal_relation").prop("disabled", false);
                dselect(document.querySelector("#appendRelationshipModal_relation"), { search: true, maxHeight: "300px" });
                dselectLocalize("#appendRelationshipModal_relation", { "search": window.JS_STRINGS.dselect_search, "noresults": window.JS_STRINGS.dselect_noresults });
            } else {
                /* disable select box on the append modal */
                dselectRemove("#appendRelationshipModal_relation");
                $("#appendRelationshipModal_relation").html(optionTpl.replace("$option$", "0").replace("$item$", window.JS_STRINGS.relation_types_none));
                $("#appendRelationshipModal_relation").val("0");
                $("#appendRelationshipModal_relation").prop("disabled", true);
            }
            $("#rel_list_table tbody").html(out);
            
            /* write to the dropdown boxes */
            if (relationsMale.length > 0) {
                for (loop=0; loop<relationsMale.length; loop++) {
                    item = self.getIdFromSlug(relationsMale[loop]);
                    optionsMale.push(optionTpl.replace("$option$", self.list[item].slug).replace("$item$", self.list[item].name));
                }
            }
            $("#addEditRelationshipModal_rel_rec_male").html(optionsMale.join("\n"));
            dselect(document.querySelector("#addEditRelationshipModal_rel_rec_male"), { search: true });
            dselectLocalize("#addEditRelationshipModal_rel_rec_male", { "search": window.JS_STRINGS.dselect_search, "noresults": window.JS_STRINGS.dselect_noresults });

            if (relationsFemale.length > 0) {
                for (loop=0; loop<relationsFemale.length; loop++) {
                    item = self.getIdFromSlug(relationsFemale[loop]);
                    optionsFemale.push(optionTpl.replace("$option$", self.list[item].slug).replace("$item$", self.list[item].name));
                }
            }
            $("#addEditRelationshipModal_rel_rec_female").html(optionsFemale.join("\n"));
            dselect(document.querySelector("#addEditRelationshipModal_rel_rec_female"), { search: true });
            dselectLocalize("#addEditRelationshipModal_rel_rec_female", { "search": window.JS_STRINGS.dselect_search, "noresults": window.JS_STRINGS.dselect_noresults });

            this.display(true);
            connectEvents(true);
        }


        /* initialize object */
        connectEvents();
    }

    window.relationshipObj = new Relationships();
    window.relationshipObj.load();
});
