/* Men of Courage Character Database
 *
 * JavaScript engine for the actors object
 * 
 *   File name: ui.js
 *   Date Created: 2024-09-24
 *   Date Modified: 2024-09-27
 * 
 */
/* rework this object to make it work for both Actors and Residences, because they are pretty much identical in function. Just the targets are different... */
/* initialize the object */
$(document).ready(function () {
    /** 
     * <select> object that has the ability to add items to it via a modal
     * 
     * @param {object} args : arguments required for configuring behaviors
     *                        {btn_add, btn_save, input, modal, no_content_msg, select, what}
     */
    ExtensibleSelect = function(args) {
        /* validate passed arguments */
        var argList = ["btn_add", "btn_save", "input", "modal", "no_content_msg", "select", "what"]
        if (typeof(args) != 'object') { console.log("ExtensibleSelect error: no arguments passed"); return false; }
        if (Object.keys(args).length != argList.length) { console.log("ExtensibleSelect error: invalid number of arguments passed"); return false; }
        for (var i=0; i<argList.length; i++) {
            if (Object.keys(args).indexOf(argList[i]) < 0 || typeof(args[argList[i]]) != 'string') {
                console.log("ExtensibleSelect error: invalid argument found.")
                return false;
            }
        }

        /* properties */
        /* public */
        this.list = {};
        this.nextKey = 1;
        this.baseValues = { "select": ["0", "Select"] };

        /* private */
        var csrfToken = $("#csrf_token").val();
        var domObjButtonAdd = args.btn_add;
        var domObjButtonSave = args.btn_save;
        var domObjInput = args.input;
        var domObjModal = args.modal;
        var domObjSelect = args.select;
        var optionTpl = '<option value="%option%">%item%</option>\n';
        var noContentMessage = args.no_content_msg;
        var whatItem = args.what;


        /* self-reference */
        var self = this;

        /* load localized base values */
        if (window.JS_STRINGS) {
            $.each(Object.keys(this.baseValues), function (k, i) {
                self.baseValues[k] = window.JS_STRINGS['select_' + k];
            })
        } 

        /* methods */
        /* private methods */
        /**
         * Connect events to buttons
         */
        var connectEvents = function() {
            $(domObjButtonAdd).click(self.show);
            $(domObjButtonSave).click(self.add);
        }
        
        /** 
         * Sort the global list object alphabetically according to name
         */
        var sortedList = function() {
            var sortArray = Object.entries(self.list);
            var sortedObj = {}
            return sortArray.sort((a,b) => a[1].name.localeCompare(b[1].name));
        }

        
        /* public methods */
        /**
         * add new Item from modal
         */
        this.add = function () {
            $(domObjInput).removeClass("is-invalid");

            if ($(domObjInput).val().length > 1) {
                var sendData = { "csrf_token": csrfToken, "what": whatItem, "id": self.nextKey, "name": $(domObjInput).val() }
                self.list[self.nextKey] = { "id": self.nextKey, "name": $(domObjInput).val() }
                self.write(self.nextKey.toString());
                $(domObjModal).modal("hide");
                $.post("/api/write", sendData, null, "json").done(function (r) {
                    if (r.error) {
                        window.flash.display(window.JS_STRINGS["es_write_failure"].replace("%item%", window.JS_STRINGS["string_" + whatItem]), "warning");
                        console.log(r.error);
                    } else if (r.success) {
                        window.flash.display(window.JS_STRINGS["es_write_success"].replace("%item%", window.JS_STRINGS["string_" + whatItem]), "success");
                    } else {
                        window.flash.display(window.JS_STRINGS["general_failure"], "danger");
                    }
                }).fail(function () { window.flash.display(window.JS_STRINGS["general_failure"].replace("%action%", window.JS_STRINGS["string_written"]), "danger"); })
                self.nextKey++;
                $(domObjInput).val(""); /* make sure we reset the item */
            } else {
                $(domObjInput).addClass("is-invalid");
            }
        }

        /**
         * load Item from database
         */
        this.load = function () {
            $.getJSON('/api/fetch', {'what': whatItem}, function (r) {
                if (r.error) {
                    window.flash.display(window.JS_STRINGS["es_read_failure"].replace("%item%", window.JS_STRINGS["string_" + whatItem]), "warning");
                    console.log(r.error);
                } else {
                    self.list = r[whatItem];
                    self.nextKey = parseInt(r['records']) + 1;
                    self.write();
                }
            }).fail(function () {
                window.flash.display(window.JS_STRINGS["general_failure"].replace("%action%", window.JS_STRINGS["string_received"]), "danger");
            });
        }

        /**
         * loads the add item modal
         */
        this.show = function () {
            $(domObjModal).modal("show");
            setTimeout(function () { $(domObjInput).focus(); }, 600);
        }

        /**
         * write data to list
         * 
         * @param {string} selected : value that will be marked as selected
         */
        this.write = function(selected) {
            if (typeof(selected) != "string") { selected = 0; }
            $(domObjSelect).prop("disabled", false);

            var options = [optionTpl.replace("%option%", self.baseValues.select[0]).replace("%item%", self.baseValues.select[1] + "...")];

            if (Object.keys(self.list).length > 0) {
                $.each(sortedList(), function (i,j) { 
                    options.push(optionTpl.replace("%option%", j[1].id).replace("%item%", j[1].name));
                 });
            } else {
                options = [optionTpl.replace("%option%", "0").replace("%item%", noContentMessage)];
                selected = 0;
                $(domObjSelect).prop("disabled", true);
            }
            selected = (Object.keys(self.list).indexOf(selected) < 0) ? 0 : selected; /* make sure the option is even available */
            $(domObjSelect).html(options.join("\n"));
            $(domObjSelect).val(selected);
            if ($(domObjSelect).prop("disabled") == false){
                dselect(document.querySelector(domObjSelect), { search: true });
            }
        }

        connectEvents();
    }

    window.actorsObj = new ExtensibleSelect({"btn_add": "#char_btn_add_actor", "btn_save": "#addActorModal_save", 
                                             "input": "#add_actor_name", "modal": "#addActorModal", 
                                             "no_content_msg" : window.JS_STRINGS["actors_none"], "select": "#char_acted_by", 
                                             "what": "actors"});
    window.residenceObj = new ExtensibleSelect({"btn_add": "#char_btn_add_residence", "btn_save": "#addResidenceModal_save", 
                                                "input": "#add_residence_name", "modal": "#addResidenceModal", 
                                                "no_content_msg" : window.JS_STRINGS["residences_none"], 
                                                "select": "#char_residence", "what": "residences"});
   
    window.actorsObj.load();
    window.residenceObj.load();
});
