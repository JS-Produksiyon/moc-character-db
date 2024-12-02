# Translating the Men of Courage Character Database
The Men of Courage Character Database is designed to be used in multiple languages. New languages can be added by people who have a basic understanding of programming. There are four files that will need to be edited to complete the localization. These are (in relation to the root of the repository):

* `moccdb.py`
* `app/languages/[language_code]/LC_MESSAGES/messages.po`
* `app/languages/[language_code]/relation_list.py`
* `app/static/setup_strings.json`

We strongly recommend making a pull request when you have completed the translation, so that your language can be added to the repository.

## 1. Create the new language files (`.po` and `.json`)
To localize to a new language, activate the virtual environment and execute the following commands from the repository root:

    pybabel init -i ./app/languages/messages.pot -d ./app/languages -l [language]

> The `[language]` should preferably correspond to the two-letter [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) code (e.g. `en` for English). Alternatively, you can use the ISO 639-1 code in combination with the given two-letter country code as defined by [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (e.g. `en_GB` for British English).

Then *copy* `app/languages/relation_list.py` file to the `app/languages/[language]` directory. 

## 2. Translate the strings
### messages.po
Begin with the `messages.po` file in the `app/languages/[language]/LC_MESSAGES` directory. This is quite straightforward as you merely have to follow the source strings marked with `msgid` and add your translation und `msgstr`. Just be sure to carry over any strings marked as `$code$` or `{code}` exactly as listed in `msgid`. Carrying over any HTML tags (e.g. `<code></code>` or `<b></b>`) is also recommended, but not necessary.

We would also request you take the time to fill in the metadata at the top of `messages.po` identifying who it was that translated the file.

### relation_list.py
Second, create a language-specific `relation_list.py` file. This file must be created very carefully following the documentation in the file itself. 
When localizing the MoC Character Database, please copy this file into the target directory under `app/languages/` (e.g. `app/languages/tr/relation_list.py`). Once copied, please update the __language__ and __language_code__ variables above. Then define the relationships as they exist in that language, following grammatical gender rules and/or relational complexities. 

`relation_list.py` contains two dictionaries, `RELATIONSHIP_STRINGS` and `RECIPROCAL_RELATIONSHIPS`, which are used to define the relationship between two characters. These arrays are used to pre-populate the database and do not use `gettext()` for localization, as some languages (e.g. Turkish) have more complex relationships than in English. 

However, *the keys are recommended to be kept in English.* Multiple words should be separated by a dash `-`. For example, if there is more than one type of uncle depending on father's side or mother's, change the keys to `uncle-m` and `uncle-f` respectively. How exactly these extended  relations are defined is up to the translator; but *please be consistent* across the translation! Otherwise the application will break. 

See the `relation_list.py` file for more details on documentation. We recommend that the person who translates this file have some experience programming in Python to prevent the file from breaking the application. 

> If the application breaks after activating the new language, check this `relation_list.py` *first*, as it is the one most easy to mess up!

### setup_strings.json
For the translation system to work properly this is the last file that is required to be edited. *It must be edited in place!*

* First, add your language code abbreviation to the `LANGUAGES` array. 

* If you are translating a language that is written from right to left (e.g. Arabic, Hebrew, Farsi), make sure that you add the language code for that language `RTL_LANGUAGES` array.

* When you add your language to the `SETUP_STRINGS.language_names` field, be sure to append your language to the other lists *alphabetically* for your language's native string (e.g. Hebrew – עִברִית – is transliterated *‘Ivrit*  and thus would go between English and Turkish; or the native name for German is *Deutsch*, so this would go before English). 

    In each case the language should be listed in their native form followed by the other language's translated form in parentheses (e.g. German would look be `Deutsch` for the German localization `Deutsch (German)` for the English localization and `Deutsch (Almanca)` for the Turkish localization). 
    
    You can refer to https://www.internationalphoneticalphabet.org/languages/language-names-in-native-language/ for a comprehensive list of the languages by their English names and then position them correctly in the JSON object. You can also get the various language translations for your language in the extant languages by using Google Translate.

The translation of the rest of the strings in `setup_strings.json` is straightforward. Please be sure to transfer over any HTML code (e.g. `<code></code>` or `<b></b>`) when translating.


### moccdb.py
The final file that *can* be translated, but does not need to is the `moccdb.py` file. Even though it is a Python file rather than JavaScript, it uses the same logic. Just add the new language code to `available` and then the translated string to each following dictionary entry. 

>**Note**: This file does not necessarily need to be translated as it only outputs to the command line and most users are used to the command line being in English. As it is, the `startmoccdb.bat` command file cannot be localized, so any strings printed by it will remain in English.


## 3. Compiling the files
Once the translation of the .po file is complete, compile it using the following command from the repository root.:

    pybabel compile -d ./app/languages


## Extracting strings from the source code
Extracting strings (from repository root):
    
    pybabel extract -F babel.cfg -o ./app/languages/messages.pot ./app

Updating existing translation strings:

     pybabel update -i ./app/languages/messages.pot -d ./app/languages -l [language]

---
Updated: 2024-12-02