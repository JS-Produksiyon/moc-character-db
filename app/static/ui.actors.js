/* Men of Courage Character Database
 *
 * JavaScript engine for the actors object
 * 
 *   File name: ui.js
 *   Date Created: 2024-09-24
 *   Date Modified: 2024-09-25
 * 
 */
/* initialize the object */
$(document).ready(function () {
    Actors = function() {
        /* properties */
        /* public */
        this.list = {};
        this.nextKey = 0;
        this.baseValues = {"select": ["0", "Select"], "spacer": ["---", "---------------"], "add_actor": ["add", "Add Actor"] }

        /* private */
        var domObjButton = "#addActorModal_save"
        var domObjInput = "#add_actor_name";
        var domObjModal = "#addActorModal";
        var domObjSelect = "#char_actor";
        var optionTpl = '<select option="%option%">%item%</select>\n';


        /* self-reference */
        var _me = this;

        if (window.JS_STRINGS) {
            $.each(Object.keys(this.baseValues), function (k, i) {
                _me.baseValues[k] = window.JS_STRINGS['select_' + k];
            })
        } 

        /* methods */
        /* private methods */
        var connectEvents = function() {
            $(domObjSelect).on("change", _me.show);
            $(domObjButton).click(_me.add);
        }

        /* public methods */
        /**
         * add new Actor from modal
         */
        this.add = function () {
            $(domObjInput).removeClass("is-invalid");
            if ($(domObjInput).var().length > 1) {
                var sendData = {"what": "actor", "id": _me.nextKey, "name": $(domObjInput).var() }
                _me.list[_me.nextKey] = { "id": _me.nextKey, "name": $(domObjInput).var() }
                _me.write();
                $(domObjModal).modal("hide");
                $.post("/api/write", sendData, null, "json").done(function (r) {
                    if (r.error) {
                        window.flash.display(window.JS_STRINGS["actor_write_failure"], "warning");
                    } else if (r.success) {
                        window.flash.display(window.JS_STRINGS["actor_write_success"], "success");
                    } else {
                        window.flash.display(window.JS_STRINGS["general_failure"], "danger");
                    }
                }).fail(function () { window.flash.display(window.JS_STRINGS["general_failure"], "danger"); })
                _me.nextKey++;

            } else {
                $(domObjInput).addClass("is-invalid");
            }
        }

        /**
         * load Actors from database
         */
        this.load = function () {}

        /**
         * loads the add actor modal
         */
        this.show = function () {
            $(domObjModal).modal("show");
            setTimeout(function () { $("#add_actor_name").focus(); }, 600);
        }

        /**
         * write data to list
         * 
         * @param {string} selected : value that will be marked as selected
         */
        this.write = function(selected) {
            if (typeof(selected) != "string") { selected = 0; }
            
            var options = optionTpl.replace("%option%", _me.baseValues.select[0]).replace("%item%", _me.baseValues.select[1]);

            if (_me.list.length > 0) {
                for (var i=0; i<_me.list.length; i++) {
                    options = options + optionTpl.replace("%option%", _me.list[i].id).replace("%item%", _me.list[i].name);
                }
            }

            options = optionTpl.replace("%option%", _me.baseValues.spacer[0]).replace("%item%", _me.baseValues.spacer[1]);
            options = optionTpl.replace("%option%", _me.baseValues.add_actor[0]).replace("%item%", _me.baseValues.add_actor[1]);
            selected = (options.indexOf('value="' + selected + '"') < 0) ? 0 : selected; /* make sure the option is even available */
            $(domObjSelect).html(options);
            dselect(document.querySelector(domObjSelect), { search: true });
            $(domObjSelect).val(selected);
        }

        connectEvents();
    }

    window.actorsObj = new Actors();
});
