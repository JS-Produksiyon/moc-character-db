/* Men of Courage Character Database
 *
 * JavaScript engine for the character list object
 * 
 *   File name: ui.4-charList.js
 *   Date Created: 2024-10-02
 *   Date Modified: 2024-10-24
 * 
 */
$(document).ready(function () {
    var CharacterList = function () {
        /* properties */
        /* public */
        this.list = {};
        this.nextItem = 1;

        /* private */
        var charTpl = {
                id: 0,
                name: "", /* full name */
                sex: "",
                episodes: 0, /* episode count */
                animation_status: ""
            };
        var rowTpl = `<tr>
                        <td class="ps-3"><a href="#/character/\$id\$">$full_name$</a></td>
                        <td><i class="bi-gender-$sex_slug$" title="$sex_word$"></i></td>
                        <td>$episodes$</td>
                        <td class="col-3">$ani_status$</td>
                        <td class="text-end pe-3">
                            <a href="#/character/\$id\$"><button class="btn btn-sm btn-outline-dark char-display" title="$display$" type="button">
                                <i class="bi-eye"></i>
                            </button></a>
                        </td>
                    </tr>\n`;

        /* self-reference */
        var self = this;

        /* methods */
        /* private */


        /* public */
        /**
         * display the list 
         */
        this.display = function () {}

        /**
         * load list data from database
         */
        this.load = function () {
            $.get("/api/fetch", {"what":"character_list"}, function (r) {
                if (r.error) {
                    window.flash.display(window.JS_STRINGS['es_read_failure'].replace("$item$", window.JS_STRINGS['episodes']), 'danger');
                    console.log(r.error);
                } else {
                    self.list = r.character_list;
                    self.nextItem = r.next;
                    self.writeList();
                }
            }).fail(function () { window.flash.display(window.JS_STRINGS['general_failure'].replace("$item$", window.JS_STRINGS['episodes']), 'danger'); });
        }

        /**
         * Remove character from list
         * 
         * @param {number} id : character id to remove
         */
        this.removeCharacter = function (id) {
            delete self.list[id];
            this.writeList();
        }

        /**
         * Update list with passed data
         * 
         * @param {object} charData : Character data object for updating the list
         * @returns                 : id of item just added
         */
        this.updateList = function (charData) {
            /* convert charData item to an entry */
            if (typeof(charData) != "object") { return false; }
            /* make sure that the fields we need to display in the character list exist and are in the right length */
            if (typeof(charData.id) != "number" || typeof(charData.first_name) != "string" || charData.first_name.length < 1 || typeof(charData.last_name) != "string"
                || typeof(charData.episodes) != "object" || typeof(charData.sex) != "string" || typeof(charData.animation_status) != "string") { return false; }

            var charLine = JSON.parse(JSON.stringify(charTpl)); /* this is so we don't overwrite the base object, since objects persist in JS  */
            charLine.id = (charData.id < 1) ? self.nextItem : charData.id;
            charLine.name = `${charData.first_name} ${charData.last_name}`;
            charLine.sex = charData.sex;
            charLine.animation_status = charData.animation_status;
            charLine.episodes = charData.episodes.length;

            self.list[charLine.id] = JSON.parse(JSON.stringify(charLine)); /* this is so we don't overwrite this line later, since objects persist in JS  */

            if (self.nextItem == charLine.id) { self.nextItem++; }

            self.writeList(); /* we've updated it, after all.... */

            return charLine.id;
        }

        /**
         * writes the list object to the screen
         */
        this.writeList = function () {
            /* hide both containers */
            $("#charlist_no_chars").hide();
            $("#char_list_table_container").hide();

            if (Object.keys(self.list).length > 0) {
                /* build character list table rows */
                var tbody = [];
                $.each(self.list, function (k,i) {
                    var row = rowTpl.replace(/\$id\$/g, i.id).replace("$full_name$", i.name).replace("$episodes$", i.episodes);
                    row = row.replace("$sex_slug$", i.sex).replace("$sex_word$", window.JS_STRINGS[`sex_word_${i.sex}`]);
                    row = row.replace("$ani_status$", $(`select[name=animation_status] option[value=${i.animation_status}]`).text());
                    row = row.replace("$display$", window.JS_STRINGS.display);
                    tbody.push(row);
                })
                $("#char_list_table_container table tbody").html(tbody.join("\n"));
                $("#char_list_table_container").show();
            } else {
                $("#charlist_no_chars").show();
            }
        }
    }

    charListObj = new CharacterList();
    charListObj.load();
});