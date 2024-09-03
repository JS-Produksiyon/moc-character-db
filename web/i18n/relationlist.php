<?php
/**
 * Men of Courage Character Database
 * List of relations between characters  
 * Default Language (English)
 *
 * Version: 2024-07-24
 * 
 * This file contains two associative arrays, $RELATIONS_STRINGS and $RECIPROCAL_RELATIONS, which
 * are used to define the relation between two characters. These arrays are used to prepopulate the
 * database and do not use `gettext()` for localization, as some languages (e.g. Turkish) have more 
 * complex relationships than in English. 
 * 
 * When localizing the MoC Character Database, please copy this file and append the filename 
 * with a dash `-` and the target language code (e.g. `relationlist-ln.php`), then define the 
 * relationships as they exist in that language, following grammatical gender rules and/or 
 * relational complexities. 
 * 
 * However, *keys are recommended to be kept in English.* Multiple words should be separated by a 
 * dash `-`. For example, if there is more than one type of uncle depending on father's side or 
 * mother's, change the keys to `uncle-m` and `uncle-f` respectively. How exactly these extended 
 * relations are defined is up to the translator; but *please be consistent* across the 
 * translation! Otherwise the application will break. 
 */

 /* 
 * $RELATIONS_STRINGS is an associative array containing the names of a given relation. 
 *
 * Format:
 *
 * $RELATIONS_STRINGS = array ('key' => 'Value', 'key' => 'Value');
 * 
 *    Where `Value` follows capitalization rules of the target language
 * 
 */
$RELATIONS_STRINGS = array(
   'husband'      => 'Husband',
   'wife'         => 'Wife',
   'son'          => 'Son',
   'daughter'     => 'Daughter',
   'brother'      => 'Brother',
   'sister'       => 'Sister',
   'grandfather'  => 'Grandfather',
   'grandmother'  => 'Grandmother',
   'grandson'     => 'Grandson',
   'granddaughter'=> 'Granddaughter',
   'bro-in-law'   => 'Brother-in-law',
   'sis-in-law'   => 'Sister-in-law',
   'dad-in-law'   => 'Father-in-law',
   'mom-in-law'   => 'Mother-in-law',
   'son-in-law'   => 'Son-in-law',
   'dau-in-law'   => 'Daughter-in-law',
   'uncle'        => 'Uncle',
   'aunt'         => 'Aunt',
   'nephew'       => 'Nephew',
   'niece'        => 'Niece',
   'cousin'       => 'Cousin',
   'employer'     => 'Employer',
   'employee'     => 'Employee',
   'acquaintance' => 'Acquaintance',
   'friend'       => 'Friend',
   'enemy'        => 'Enemy'
);

/* 
 * The data in $RECIPROCAL_RELATIONS are used when updating a character and his/her relations
 * The relation takes two different possibilities: male or female. If the target  relationship is 
 * only either male or female, leave the relationship it is *not* blank.
 * 
 * The keys need to be identical to the ones in $RELATIONS_STRINGS, otherwise defining the 
 * reciprocal relations will not work.
 * 
 * Format:
 * 
 * $RECIPROCAL_RELATIONS = array(
 *    'key' => array('male'=> 'value', 'female' => 'value'),
 *    'key' => array('male'=> 'value', 'female' => 'value')
 * );
 * 
 *    Where `value` is a reference to one of the other `key`s in the array.
 * 
 */
$RECIPROCAL_RELATIONS = array(
   'husband'      => array('male' => '', 'female' => 'wife'),
   'wife'         => array('male' => 'husband', 'female' => ''),
   'father'       => array('male' => 'son', 'female' => 'daughter'),
   'mother'       => array('male' => 'son', 'female' => 'daughter'),
   'son'          => array('male' => 'father', 'female' => 'mother'),
   'daughter'     => array('male' => 'father', 'female' => 'mother'),
   'brother'      => array('male' => 'brother', 'female' => 'sister'),
   'sister'       => array('male' => 'brother', 'female' => 'sister'),
   'grandfather'  => array('male' => 'grandson', 'female' => 'granddaughter'),
   'grandmother'  => array('male' => 'grandson', 'female' => 'granddaughter'),
   'grandson'     => array('male' => 'grandfather', 'female' => 'grandmother'),
   'granddaughter'=> array('male' => 'grandfather', 'female' => 'grandmother'),
   'bro-in-law'   => array('male' => 'bro-in-law', 'female' => 'sis-in-law'),
   'sis-in-law'   => array('male' => 'bro-in-law', 'female' => 'sis-in-law'),
   'dad-in-law'   => array('male' => 'son-in-law', 'female' => 'dau-in-law'),
   'mom-in-law'   => array('male' => 'son-in-law', 'female' => 'dau-in-law'),
   'son-in-law'   => array('male' => 'dad-in-law', 'female' => 'mom-in-law'),
   'dau-in-law'   => array('male' => 'dad-in-law', 'female' => 'mom-in-law'),
   'uncle'        => array('male' => 'nephew', 'female' => 'niece'),
   'aunt'         => array('male' => 'nephew', 'female' => 'niece'),
   'nephew'       => array('male' => 'uncle', 'female' => 'aunt'),
   'niece'        => array('male' => 'uncle', 'female' => 'aunt'),
   'cousin'       => array('male' => 'cousin', 'female' => 'cousin'),
   'employer'     => array('male' => 'employee', 'female' => 'employee'),
   'employee'     => array('male' => 'employer', 'female' => 'employer'),
   'acquaintance' => array('male' => 'acquaintance', 'female' => 'acquaintance'),
   'friend'       => array('male' => 'friend', 'female' => 'friend'),
   'enemy'        => array('male' => 'enemy', 'female' => 'enemy'),
);

?>