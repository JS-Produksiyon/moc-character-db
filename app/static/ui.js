/* Men of Courage Character Database
 *
 * JavaScript engine for the site
 * 
 *   File name: ui.js
 *   Date Created: 2024-09-12
 *   Date Modified: 2024-09-12
 * 
 */

html_templates = {
    charlist_row : `<tr>
    <td class="ps-3"><a href="#/character/%id%">%full_name%</a></td>
    <td>%episodes%</td>
    <td><i class="bi-gender-%sex_slug%" title="%sex_word%"></i></td>
    <td class="col-3">%status%</td>
    <td class="text-end pe-3">
        <a href="#/character/%id%"><button class="btn btn-sm btn-outline-dark char-display" title="%display%" type="button">
            <i class="bi-eye"></i>
        </button></a>
    </td>
</tr>\n`,
    char_relation_row : `<tr>
    <td class="ps-3"><a href="#/character/%id%">%full_name%</a></td>
    <td>%relationship%</td>
    <td><i class="bi-gender-%sex_slug%" title="%sex_word%"></i></td>
    <td class="text-end pe-3">
        <button class="btn btn-sm btn-outline-dark char-" title="%display%" type="button">
            <i class="bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" title="%del_rel%" type="button">
            <i class="bi-trash3-fill"></i>
        </button>
    </td>
</tr>\n`,
    char_episode_row : `<tr>
    <td><a href="#/episodes/%id%">%episode%</a></td>
    <td class="text-end pe-3">
        <button class="btn btn-sm btn-outline-danger" title="%del_ep%" type="button">
            <i class="bi-trash3-fill"></i>
    </button>
    </td>
</tr>\n`,
    episode_data : `<div class="accordion-item">
    <h2 class="accordion-header" id="episode_%id%">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_%id%">
                    %id% &ndash; %title%
                </button>
    </h2>
    <div id="collapse_%id%" class="accordion-collapse collapse">
        <div class="accordion-body">
            <p><strong>%ep_rec_date%:</strong> %rec_date%</p>
            <p class="mb-0"><strong>%ep_characters%:</strong></p>
            <ul>
                %charlist%
            </ul>
        </div>
    </div>            
</div>\n`,
    episode_charlist : '<li><a href="#/character/%id%">%full_name%</a></li>'
}