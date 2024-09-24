/* Men of Courage Character Database
 *
 * JavaScript engine for the character object
 * 
 *   File name: ui.js
 *   Date Created: 2024-09-24
 *   Date Modified: 2024-09-24
 * 
 */
/* initialize the object */
$(document).ready(function (){
    Character = function() {

        /* parameters */
        this.character_data = { id: 0, first_name: "", last_name: "", sex: "", age: 0,
            physical: "", personality: "", employment: "", image_head: "",
            image_body: "", animation_status: "", residence: 0, marital_status: 0,
            acted_by: 0, relationships: [], episodes: []};
      
        _me = this;


        /* private methods */
        /**
         * verifies data pulled from the form
         * 
         * @param {object} data          : JSON object to be checked through
         * @param {string} skeleton_type : what skeleton to use: 'base', 'relationships', 'relations'
         */
        verifyData = function(data, skeleton_type) {
            if (typeof(skeleton_type) != 'string') { skeleton_type = 'base'}

            var result = false;
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
         * @param {string} target : DOM name of table to write to
         * @param {array}  data   : JSON array containing the episode data
         */
        writeTable = function(target, data) {}

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
         * add new actor via modal
         */
        this.actorAdd = function() {}

        /**
         * Delete a given character
         */
        this.delete = function() {}

        /**
         * add episode to character via modal
         */
        this.episodeAdd = function() {}

        /**
         * delete episode from character via modal
         */
        this.episodeDel = function() {}

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
                this.add();    
            } else {
                $.postJson
            }

        }

        /**
         * add relationship to character via modal
         */
        this.relationAdd = function() {}

        /**
         * add new residence via modal
         */
        this.residenceAdd = function() {}
    
        /**
         * delete relationship from character via modal
         */
        this.relationDel = function() {}

        /**
         * write data in the JSON data object into the form
         */
        this.writeFormData = function() {}

        /**
         * add image to data to character
         */
        this.imageAdd = function() {}

        /**
         * Display image modal
         */
        this.imageModal = function() {}

    }

    window.characterObj = new Character()
});
