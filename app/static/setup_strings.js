/**
 * Men of Courage Character Database
 * 
 * Strings used to localize  the setup page on the fly
 * 
 *   File name: setup_strings.js
 *   Date Created: 2024-09-10
 *   Date Modified: 2024-09-10
 */
$(document).ready(function() {
    /* define the strings for this page in various languages */
    const LANGUAGES = ["en", "tr"]
    const SETUP_STRINGS = {
        "page_title": {
            "en": "Men of Courage Character Database",
            "tr": "Erkeğe Dair Karakter Veri Tabanı"
        },
        "body_title" : {
            "en": "First Run Application Setup",
            "tr": "Uygulamanın İlk Defa Çalışmasındaki Ayarlar"
        },
        "explanation": {
            "en": "You appear to be running the Men of Courage Character Database for the first time. Please review and alter the settings for this instance of the database before continuing. Please be sure to select the correct language for your region. Selecting a language below will automatically set the interface to that language.",
            "tr": "Erkeğe Dair Karakter Veri Tabanı’nı ilk defa çalıştırmaktasınız. Aşağıdaki ayarları kontrol edip veri tabanının bu sürümü için doğru olduklarını teyit edin. Bölgeniz için doğru dili seçtiğinizden emin olunuz. Aşağıdan bir dili seçince, arabirim otomatik olarak o dilde görüntülenecektir."
        },
        "general_options_title": {
            "en": "General Options",
            "tr": "Genel Seçenekler"
        },
        "select_lang_title": {
            "en": "Select Database Language:",
            "tr": "Veri Tabanı Dili:"
        },
        "language_names": {
            "en": { "en": "English", "tr": "Türkçe (Turkish)" },
            "tr": { "en": "İngilizce (English)", "tr": "Türkçe" }
        },
        "secret_key_label": {
            "en": "Secret Key:",
            "tr": "Gizli Anahtar:"
        },
        "secret_key_error": {
            "en": "The secret key you have entered is not long enough. It must be at least 12 characters in length.",
            "tr": "Gizli anahatar yeterince kadar uzun değil. En az 12 karakter uzunluğunda olmalıdır."
        },
        "secret_key_explanation": {
            "en": "<strong>This field is optional.</strong> Enter a complex secret code of at least 12 characters up to 128 characters to make communications with the database secure. If left empty, the database will generate its own 48-character random key.",
            "tr": "<strong>Bu alan isteğe bağlı doldurulabilir.</strong> Veri tabanını güvende tutmak için en az 12 ve en fazla 128 karakterden oluşan bir dizi giriniz. Boş bırakılırsa, veri tabanı otomatik olarak 48-karakterlik gelişigüzel bir dizi oluşturacaktır."
        },
        "db_title": {
            "en": "Database Options",
            "tr": "Veri Tabanı Seçenekleri"
        },
        "db_explanation": {
            "en": "Select the type of database you wish to store the data in. If the option is greyed out, the requirements to connect to that type of database have not been installed. Please refer to <code>README.md</code> for more information.",
            "tr": "Kullanmak istediğiniz veri tabanı türünü seçiniz. Bir seçenek seçilemez halde ise, veri tabanına bağlantıyı sağlayan gereksinimleri yüklenmiş değiller. Daha bilgi için <code>README.md</code> dosyasına göz atın."
        },
        "db_sqlite_file_label": {
            "en": "SQLite Database File Name:",
            "tr": "SQLite Veri Tabanı Dosya İsmi:"
        },
        "sqlite_explanation": {
            "en": "This is the name of the file the SQLite database will be written to. It will be placed in the <code>/instance</code> folder of the application.",
            "tr": "Bu, SQLite veri tabanının kaydedileceği dosyanın ismidir. Dosya <code>/instance</code> altdizinine yerleştirilecektir."
        },
        "db_host_label": {
            "en": "Database Host:",
            "tr": "Veri Tabanı Sunucusu:"
        },
        "db_port_label": {
            "en": "Database Host Port:",
            "tr": "Veri Tabanı Suncu Portu:"
        },
        "db_name_label": {
            "en": "Database Name:",
            "tr": "Veri Tabanı İsmi:"
        },
        "db_user_label": {
            "en": "Database User:",
            "tr": "Veri Tabanı Kullanıcısı:"
        },
        "db_pwd_label": {
            "en": "Database Password",
            "tr": "Veri Tabanı Parolası:"
        },
        "save_button": {
            "en": "Save Settings",
            "tr": "Ayarları Kaydet"
        },
        "sqlite_file_error":
        {
            "en": "You have not entered a valid SQLite database file name. It must be at least one character long.",
            "tr": "Geçerli bir SQLite veri tabanı dosya ismi girilmedi. En az bir karakter uzunluğunda olmalıdır."
        },
        "db_host_error": {
            "en": "You have not entered a valid database host name. It must be <code>localhost</code> an IP address or at least one character long.",
            "tr": "Geçerli bir veri tabanı sunucu ismi girilmedi. Girilen veri, <code>localhost</code>, bir IP adresi veya en az bir karakter uzunluğunda olmalıdır."
        },
        "db_port_error":
        {
            "en": "You have not entered a valid database host port. It must be an integer of at least four characters.",
            "tr": "Geçerli bir SQLite veri tabanı sunucu portu girilmedi. Tam sayı olup en az dört karakter uzunluğunda olmalıdır."
        },
        "db_name_error":
        {
            "en": "You have not entered a valid database name. It must be at least one character long.",
            "tr": "Geçerli bir veri tabanı ismi girilmedi. En az bir karakter uzunluğunda olmalıdır."
        },
        "db_user_error":
        {
            "en": "You have not entered a valid database user name. It must be at least one character long.",
            "tr": "Geçerli bir veri tabanı kullanıcı ismi girilmedi. En az bir karakter uzunluğunda olmalıdır."
        },
        "db_pwd_error":
        {
            "en": "You have not entered a valid password. It must be at least five characters long.",
            "tr": "Geçerli bir parola girilmedi. En az beş karakter uzunluğunda olmalıdır."
        }
    };
    
    if ($("#lang_select").length > 0) {
        $("#lang_select").change(function() {
            lang = $("#lang_select").val();

            document.title = SETUP_STRINGS["page_title"][lang];
            
            $.each(SETUP_STRINGS, function(key, value) {
                if (key == "language_names") {
                    $.each(value[lang], function(skey, sval) {
                        $("#lang_" + skey).html(sval)
                    });
                } else {
                    $("#" + key).html(value[lang]);
                }
            });
        });
    
    }

    /* change form for database type */
    if ($(".db-type").length > 0) {
        $(".db-type").click(function() {
            var dbType = $(this).attr("id");          /* this makes the checking for the db types easier */ 
            $("#db_type").val($(this).attr("value")); /* set hidden field for easier validation and submission */
            if (dbType == "db_sqlite") {
                $("#sqlite_details").slideDown();
                $("#other_db_details").slideUp();
            } else {
                $("#db_port").val(dbType == "db_postgresql" ? "5432" : "3306");
                $("#sqlite_details").slideUp();
                $("#other_db_details").slideDown();
            }
        });
    }

    /* click save_settings button */
    if ($("#save_settings").length > 0) {
        $("#save_settings").click(function () {
            $(".form-control").removeClass("is-invalid")
            var go = true;

            /* validate secret key length */
            if ($("#secret_key").val().length > 0 && $("#secret_key").length < 12) {
                go = false;
                $("#secret_key").addClass("is-invalid");
            }

            /* validate database entries */
            if ($("#db_type").val() == 'sqlite') {
                if ($("#sqlite_db_file").val().length < 1) {
                    go = false;
                    $("#sqlite_db_file").addClass("is-invalid");
                }
            } else {
                if ($("#db_host").val().length < 1) {
                    go = false;
                    $("#db_host").addClass("is-invalid");
                }
                var port = parseInt($("#db_name").val());
                if (port == NaN || port < 999) {
                    go = false;
                    $("#db_port").addClass("is-invalid");
                }
                if ($("#db_name").val().length < 1) {
                    go = false;
                    $("#db_name").addClass("is-invalid");
                }
                if ($("#db_user").val().length < 1) {
                    go = false;
                    $("#db_user").addClass("is-invalid");
                }
                if ($("#db_pwd").val().length < 5) {
                    go = false;
                    $("#db_pwd").addClass("is-invalid");
                }
            }
            if (go) $("#setup").submit();
        });
    }

    /* set interface language to browser language, if available */
    browserLang = (navigator.userLanguage) ? navigator.userLanguage : navigator.language;
    mocdbLang = browserLang.substring(0,2);
    if (LANGUAGES.includes(mocdbLang)) {
        $("#lang_select").val(mocdbLang);
        $("#lang_select").trigger("change");
    }
});
