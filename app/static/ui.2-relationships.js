/* Men of Courage Character Database
 *
 * JavaScript engine for the site
 * 
 *   File name: ui.relationships.js
 *   Date Created: 2024-09-27
 *   Date Modified: 2024-09-30
 * 
 */

$(document).ready(function () {
    /* initialize the object */
    Relationships = function () {
        /* properties */
        /* public */
        this.baseValues = { "select": ["0", "Select"] };
        this.list = {}
        this.nextKey = 1;

        /* private */
        var editText = window.JS_STRINGS.edit;
        var optionTpl = '<option value="%option%">%item%</option>\n';
        var tableRow = `<tr>    
    <td class="col-3 ps-3">%main_relation%</td>
    <td class="col-3">%male_reciprocal_relation%</td>
    <td class="col-3">%female_reciprocal_relation%</td>
    <td class="col-3 text-end">
        <button class="btn btn-sm btn-outline-dark relationship-open" data-id="%id%" title="%edit%" type="button" role="button">
            <i class="bi bi-pencil"></i>
        </button>
    </td>
</tr>\n`;

        /* self-reference */
        var self = this;

        /* load localized base values */
        if (window.JS_STRINGS) {
            $.each(Object.keys(this.baseValues), function (k, i) {
                self.baseValues[k] = window.JS_STRINGS['select_' + k];
            })
        } 

        /* methods */
        /* private */
        /**
         * Connects the events to the buttons
         */
        var connectEvents = function () {
            $(".relationship-open").click(function() { self.addEdit($(this).data("id")); });
            $("#addEditRelationshipModal_save").click(self.update);
            $("#add_rel_btn button").click(function() { self.addEdit(0); });
            $("#load_default_relationships_btn").click(self.loadDefaults);
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
                if (id == NaN) { return false; }
            }

            /* make sure Id exists */
            if (id > 0 && Object.keys(self.list).indexOf(id.toString()) < 0) { 
                window.flash.display(window.JS_STRINGS["err_id_does_not_exist"].replace("%items%", window.JS_STRINGS["string_relation_types"]), "warning")
                id=0; 
            }

            $("#addEditRelationshipModal_id").val(id);
            $("#addEditRelationshipModal_slug").val((id < 1) ? "" : self.list[id].slug);
            $("#addEditRelationshipModal_rel_name").val((id < 1) ? "" : self.list[id].name);
            $("#addEditRelationshipModal_rel_sex").val((id < 1) ? "0" : self.list[id].sex);
            $("#addEditRelationshipModal_rel_rec_male").val((id < 1) ? "0" : self.list[id].reciprocal_male);
            dselect(document.querySelector("#addEditRelationshipModal_rel_rec_male"), { search: true });
            $("#addEditRelationshipModal_rel_rec_female").val((id < 1) ? "0" : self.list[id].reciprocal_female);
            dselect(document.querySelector("#addEditRelationshipModal_rel_rec_female"), { search: true });
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
                if (i.slug == slug) { id = i.id }
            });
            
            return id;
        }

        /**
         * Load relationships from database
         */
        this.load = function () {
            $.getJSON("/api/fetch", {'what':'relation_types'}, 
                function (r) {
                    if (r.error) {
                        window.flash.display(window.JS_STRINGS["es_read_failure"].replace("%item%", window.JS_STRINGS["string_relation_types"]), "warning");
                        console.log(r.error);
                    } else {
                        self.list = r["relation_types"];
                        self.nextKey = parseInt(r['records']) + 1;
                        self.write();
                    } 
                }).fail(function () {
                    window.flash.display(window.JS_STRINGS["general_failure"].replace("%action%", window.JS_STRINGS["string_relation_types"]), "danger");
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
                    window.flash.display(window.JS_STRINGS["es_write_failure"].replace("%item%", window.JS_STRINGS["string_relation_types"]), "warning");
                    console.log(r.error);
                } else {
                    self.load();
                    window.loading.stop();
                }
            }).fail(function () { window.flash.display(window.JS_STRINGS["general_failure"].replace("%action%", window.JS_STRINGS["string_relation_types"]), "danger"); });
        }

        /**
         * Write the new or edited relationship to the list and database
         */
        this.update = function () {}

        /**
         * Write the relationships to the HTML interface
         */
        this.write = function () {
            var loop = 0;
            var item = "";
            var out = "";
            var relationsMale = [];
            var relationsFemale = [];
            var optionsMale = [optionTpl.replace("%option%", self.baseValues.select[0]).replace("%item%", self.baseValues.select[1] + "...")];
            var optionsFemale = [optionTpl.replace("%option%", self.baseValues.select[0]).replace("%item%", self.baseValues.select[1] + "...")];
            
            /* write to the table */
            if (Object.keys(self.list).length > 0) {
                var sorted = sortRelations();
                for (loop=0; loop<sorted.length; loop++) {
                    item = sorted[loop][1];
                    out = out + tableRow.replace("%main_relation%", item.name
                                       ).replace("%male_reciprocal_relation%", item.reciprocal_male
                                       ).replace("%female_reciprocal_relation%", item.reciprocal_female
                                       ).replace("%id%", item.id
                                       ).replace("%edit%", editText);
                    if (item.sex == "male" || item.sex == "both") {
                        relationsMale.push(item.slug);
                    }
                    if (item.sex == "female" || item.sex == "both") {
                        relationsFemale.push(item.slug);
                    }
                }
            }
            $("#rel_list_table tbody").html(out);
            
            /* write to the dropdown boxes */
            if (relationsMale.length > 0) {
                for (loop=0; loop<relationsMale.length; loop++) {
                    item = self.getIdFromSlug(relationsMale[loop]);
                    optionsMale.push(optionTpl.replace("%option%", self.list[item].slug).replace("%item%", self.list[item].name));
                }
            }
            $("#addEditRelationshipModal_rel_rec_male").html(optionsMale.join("\n"));
            dselect(document.querySelector("#addEditRelationshipModal_rel_rec_male"), { search: true });

            if (relationsFemale.length > 0) {
                for (loop=0; loop<relationsFemale.length; loop++) {
                    item = self.getIdFromSlug(relationsFemale[loop]);
                    optionsFemale.push(optionTpl.replace("%option%", self.list[item].slug).replace("%item%", self.list[item].name));
                }
            }
            $("#addEditRelationshipModal_rel_rec_female").html(optionsFemale.join("\n"));
            dselect(document.querySelector("#addEditRelationshipModal_rel_rec_female"), { search: true });

            this.display(true);
            connectEvents();
        }


        /* initialize object */
        connectEvents();
    }

    window.relationshipObj = new Relationships();
    window.relationshipObj.load();
});
