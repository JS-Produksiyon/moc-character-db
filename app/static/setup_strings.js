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
        "secret_key_explanation": {
            "en": "<strong>This field is optional.</strong> Enter a complex secret code of up to 128 characters to make communications with the database secure. If left empty, the database will generate its own 48-character random key.",
            "tr": "<strong>Bu alan isteğe bağlı doldurulabilir.</strong> Veri tabanını güvende tutmak için en fazla 128 karakterden oluşan bir dizi giriniz. Boş bırakılırsa, veri tabanı otomatik olarak 48-karakterlik gelişigüzel bir dizi oluşturacaktır."
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
    
    if ($(".db-type").length > 0) {
        $(".db-type").click(function() {
            var dbType = $(this).attr("id")
            if (dbType == "db_sqlite") {
                $("#sqlite_details").slideDown();
                $("#other_db_details").slideUp();
            } else {
                $("#db_port").val(dbType == "db_postgre" ? "5432" : "3306");
                $("#sqlite_details").slideUp();
                $("#other_db_details").slideDown();
            }
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

