<?php
/**
 * Men of Courage Character Database
 * 
 * © 2024 JS Prodüksiyon Ltd. Şti
 * 
 * License: GNU GPL 3.0
 * 
 * Last updated: 2024-07-23 | JMW
 * 
 * This file is only in PHP so that we can easily localize the strings using standard tools like _() / gettext().
 */
$locale = 'en'

?>
<!doctype html>
<html lang="<?php $locale ?>" class="h-100">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="./assets/ed-logo-128.png" />

    <!-- Bootstrap CSS -->
    <link href="./assets/bootstrap-5.2.3-dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="./assets/bootstrap-icons-1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link href="./assets/style.css" rel="stylesheet">

    <title><?php _('Men of Courage') ?> <?php _('Character Database') ?></title>
  </head>
  <body class="d-flex flex-column h-100">
    <header>
        <nav class="navbar navbar-dark bg-dark fixed-top">
            <div class="container-fluid">
                <span class="navbar-brand"><img src="./assets/ed-logo.svg" alt="<?php _('Men of Courage') ?> <?php _('Official Logo') ?>"> <?php _('Men of Courage') ?> <?php _('Character Database') ?></span>
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a href="#" class="nav-link back-to-list"><?php _('Character List') ?></a></li>
                </ul>
            </div>
        </nav>
    </header>
    <main>
        <div class="ed-load spinner-border text-secondary ed-none" role="status"><div class="visually-hidden"><?php _('Loading') ?>...</div></div>
        <div class="container mt-3 mb-3 h-100">
            <!-- Add character button -->
            <div class="float-end">
                <button class="btn btn-secondary" type="button"><i class="bi-plus"></i> <?php _('Add Chacacter') ?></button>
            </div>
            <!-- contains the table listing the characters -->
            <div id="char_list" class="ed-none">
                <h1><?php _('Character List') ?></h1>
                <div id="char_list_table_container" class="rounded-3 overflow-hidden mb-3 border">
                    <table class="table table-striped mb-0">
                        <thead class="bg-dark text-light">
                            <tr>
                                <th class="col-4 ps-3"><?php _('Full Name') ?></th>
                                <th class="col-3"><?php _('Episodes') ?></th>
                                <th class="col-1"><!-- <?php _('Sex') ?> --></th>
                                <th class="col-3"><?php _('Animation') ?></th>
                                <th class="col-1"><!-- <?php _('Buttons') ?> --></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="ps-3"><a href="#">Harun Akalın</a></td>
                                <td>2</td>

                                <td><i class="bi-gender-male" title="Erkek"></i></td>
                                <th class="col-3">In Process</th>
                                <td class="text-end pe-3">
                                    <button class="btn btn-sm btn-outline-dark char-display" data-moc-charid="" title="Görüntüle" type="button">
                                        <i class="bi-eye"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td class="ps-3"><a href="#">Erkan Akalın</a></td>
                                <td>1</td>
                                <td><i class="bi-gender-male" title="Erkek"></i></td>
                                <th class="col-3">In Process</th>
                                <td class="text-end pe-3">
                                    <button class="btn btn-sm btn-outline-dark char-display" data-moc-charid="" title="Görüntüle" type="button">
                                        <i class="bi-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- contains the form with the character details -->
            <div id="char_detail" class="">
                <h1 id="character_details"><?php _('Character Details') ?></h1>
                <h1 id="character_add"><?php _('Add Character') ?></h1>
                <form id="character_details_form" onsubmit="return false;" class="rounded-3 border p-2">
                    <input type="hidden" value="" id="char_id" name="id">
                    <div id="character_image" class="float-end border rounded-2 me-1 mt-1">
                        <div class="edit-icon">
                            <img src="./assets/empty-char-picture-edit.svg" title="<?php _('Edit') ?>">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 p-3">
                            <input type="text" class="form-control border-0 fs-2" placeholder="<?php _('First Name') ?>" name="first_name" id="char_first_name">
                        </div>
                        <div class="col-4 h2 p-3">
                            <input type="text" class="form-control border-0 fs-2" placeholder="<?php _('Last Name') ?>" name="last_name" id="char_last_name">
                        </div>
                        <div class="col-4">
                            <!-- <?php _('character image') ?> -->
                        </div>
                    </div>
                    <div class="row ps-3 mb-4">
                        <label class="col-1 col-form-label text-end" for="char_age"><?php _('Age') ?>:</label>
                        <div class="col-3">
                            <input type="text" class="form-control" placeholder="35" name="age" id="char_age">
                            <small class="text-secondary"><?php _('This can be a number or a range (e.g. in his 30\'s)') ?></small>
                        </div>
                        <label class="col-1 col-form-label text-end" for="char_sex"><?php _('Sex') ?>:</label>
                        <div class="col-2">
                            <select class="form-select" name="sex" id="char_sex">
                                <option value="0"><?php _('Select') ?>...</option>
                                <option value="e"><?php _('Male') ?></option>
                                <option value="k"><?php _('Female') ?></option>
                            </select>
                        </div>
                        <label class="col-1 col-form-label text-end" for="char_home"><?php _('Residence') ?>:</label>
                        <div class="col-2">
                            <select class="form-select" name="home" id="char_home">
                                <option value="select"><?php _('Select') ?>...</option>
                                <option value="--">----------</option>
                                <option value="add"><?php _('Add Location') ?></option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col ps-3 pe-3">
                            <label class="h3" for="char_physical_description" class="form-label"><?php _('Physical Description') ?>:</label>
                            <div id="character_image_body" class="border rounded-2 float-end mt-4">
                                <div class="edit-icon">
                                    <img src="./assets/empty-char-picture-edit.svg" title="<?php _('Edit') ?>">
                                </div>                
                            </div>
                            <div class="row">
                                <div class="col">
                                    <textarea class="form-control" name="physical_description" id="char_physical_description" rows="7"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-4">
                        <label class="col-3 col-form-label text-end" for="char_dev_state"><?php _('Animation Model Status') ?>:</label>
                        <div class="col-3">
                            <select class="form-select" name="dev_state" id="char_dev_state">
                                <option value="-1"><?php _('Unnecessary') ?></option>
                                <option value="0"><?php _('Described') ?></option>
                                <option value="1"><?php _('In Design') ?></option>
                                <option value="2"><?php _('Available') ?></option>
                                <option value="3"><?php _('In use') ?></option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-4">
                        <div class="col ps-3 pe-3">
                            <label class="h3" for="char_character_description" class="form-label"><?php _('Personality Description') ?>:</label>
                            <textarea class="form-control" name="character_description" id="char_character_description" rows="5"></textarea>
                        </div>
                    </div>
                    <div class="row mb-4">
                        <div class="col ps-3 pe-3">
                            <div class="float-end">
                                <button class="btn btn-sm btn-outline-secondary" title="<?php _('Add Relationship') ?>" type="button" data-bs-toggle="modal" data-bs-target="#relationship_modal"><i class="bi-plus"></i></button>
                            </div>
                            <h3><?php _('Relationships to Other Characters') ?>:</h3>
                            <p id="char_no_relationships" class="ms-3"><?php _('None') ?></p>
                            <div id="char_relationships_table_container" class="rounded-3 overflow-hidden mb-3 border">
                                <table class="table table-striped m-0">
                                    <thead class="bg-dark text-light">
                                        <tr>
                                            <th class="col-4 ps-3"><?php _('Full Name') ?></th>
                                            <th class="col-3"><?php _('Relationship') ?></th>
                                            <th class="col-1"><!-- <?php _('Sex') ?> --></th>
                                            <th class="col-4"><!-- <?php _('Buttons') ?> --></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="ps-3">Erkan Akalın</td>
                                            <td>1</td>
                                            <td><i class="bi-gender-male" title="Erkek"></i></td>
                                            <td class="text-end pe-3">
                                                <button class="btn btn-sm btn-outline-dark char-" title="Görüntüle" type="button">
                                                    <i class="bi-eye"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger" title="İlişkiyi sil" type="button">
                                                    <i class="bi-trash3-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="ps-3">Miray Akalın</td>
                                            <td>Eş</td>
                                            <td><i class="bi-gender-female" title="Erkek"></i></td>
                                            <td class="text-end pe-3">
                                                <button class="btn btn-sm btn-outline-dark char-display" data-moc-charid=""  title="Görüntüle" type="button">
                                                    <i class="bi-eye"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger relation-del" data-moc-relid="" title="İlişkiyi sil" type="button">
                                                    <i class="bi-trash3-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>        
                            </div>
                        </div>
                    </div>
                    <div class="row mb-4">
                        <div class="col ps-3 pe-3">
                            <div class="float-end">
                                <button class="btn btn-sm btn-outline-secondary" title="<?php _('Add Episode') ?>" type="button"><i class="bi-plus"></i></button>
                            </div>
                            <h3>Appears in Episodes</h3>
                            <p id="char_no_eps" class="ms-3"><?php _('None') ?></p>
                            <div id="char_eps_table_container" class="rounded-3 overflow-hidden mb-3 border">
                                <table class="table table-striped m-0">
                                    <tr>
                                        <td>201 - Şiddet</td>
                                        <td class="text-end pe-3">
                                            <button class="btn btn-sm btn-outline-danger" title="Bölümü sil" type="button">
                                                <i class="bi-trash3-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 ps-3">
                            <button class="btn btn-secondary back-to-list" type="button">
                                <i class="bi-chevron-left"></i> <?php _('Back to List') ?>
                            </button>
                        </div>
                        <div class="col-4 text-center">
                            <button class="btn btn-outline-danger" type="button">
                                <i class="bi-trash3-fill"></i> <?php _('Delete Character') ?>
                            </button>
                        </div>
                        <div class="col-4 pe-3 text-end">
                            <button class="btn btn-success" type="submit">
                                <i class="bi-floppy-fill"></i> <?php _('Save Character') ?>
                            </button>
                        </div>
                    </div>
                </form>
                <p>&nbsp;</p>
            </div>
        </div>
    </main>
    <footer class="footer sticky mt-auto py-3 bg-light fixed-bottom">
        <div class="container-fluid">
        <?php _('Copyright') ?> &copy; 2024 JS Prodüksiyon Ltd. Şti. <?php _('Released under GNU GPL 3.0') ?>
        </div>
    </footer>
    
    <!-- Modals -->
    <!-- Select relationship -->
    <div class="modal fade" id="relationship_modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5"><?php _('Select Relationship') ?></h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-2">
                        <label class="col-2 col-form-label text-end"><?php _('Character') ?>:</label>
                        <div class="col-10">
                            <input class="form-control" list="relationships_people" id="indiv_relation_list" placeholder="Aramak için buraya yazınız">
                            <datalist id="relationships_people"></datalist>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <label class="col-2 col-form-label text-end"><?php _('Relationship') ?>:</label>
                        <div class="col-10">
                            <input class="form-control" list="relationships_types" id="indiv_relation_list" placeholder="Aramak için buraya yazınız">
                            <datalist id="relationships_types"></datalist>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="bi-ban"></i> <?php _('Cancel') ?></button>
                    <button type="button" class="btn btn-primary"><i class="bi-check"></i> <?php _('Select') ?></button>
                </div>
            </div>
        </div>
    </div>

    <!-- Add/select episode -->
    <div class="modal fade" id="episode_modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5"><?php _('Select Episode') ?></h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-2">
                        <input class="form-check-input" type="radio" name="ep_use_">
                        <label class="col-2 col-form-label text-end">Kişi:</label>
                        <div class="col-10">
                            <input class="form-control" list="relationships_people" id="indiv_relation_list" placeholder="Aramak için buraya yazınız">
                            <datalist id="relationships_people"></datalist>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <label class="col-2 col-form-label text-end">İlişki:</label>
                        <div class="col-10">
                            <input class="form-control" list="relationships_types" id="indiv_relation_list" placeholder="Aramak için buraya yazınız">
                            <datalist id="relationships_types"></datalist>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="bi-ban"></i> İptal</button>
                    <button type="button" class="btn btn-primary"><i class="bi-check"></i> Seç</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Add city -->


    <!-- Upload image-->

    
    <!-- JavaScript here -->
    <script src="./assets/jquery-3.7.1.min.js"></script>
    <script src="./assets/bootstrap-5.2.3-dist/js/bootstrap.bundle.min.js"></script>
    <script src="./assets/ui.js"></script>
  </body>
</html>