CREATE TABLE IF NOT EXISTS `episodes` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`title` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `residence` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`name` varchar(128) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `characters` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`first_name` varchar(128) NOT NULL,
	`last_name` varchar(128) NOT NULL UNIQUE,
	`age` int NOT NULL UNIQUE,
	`physical` text NOT NULL UNIQUE,
	`personality` text NOT NULL UNIQUE,
	`image_head` blob NOT NULL UNIQUE,
	`image_body` blob NOT NULL UNIQUE,
	`animation_status` int NOT NULL,
	`residence` int NOT NULL,
	`marital_status` int NOT NULL,
	`episodes` int NOT NULL UNIQUE,
	`new_field` int NOT NULL,
	`acted_by` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `actors` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `relationships` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`main_character` int NOT NULL,
	`other_character` int NOT NULL,
	`relationship` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `char_to_ep` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`character` int NOT NULL,
	`episode` int NOT NULL,
	PRIMARY KEY (`id`)
);



ALTER TABLE `characters` ADD CONSTRAINT `characters_fk9` FOREIGN KEY (`residence`) REFERENCES `residence`(`id`);

ALTER TABLE `characters` ADD CONSTRAINT `characters_fk13` FOREIGN KEY (`acted_by`) REFERENCES `actors`(`id`);

ALTER TABLE `relationships` ADD CONSTRAINT `relationships_fk1` FOREIGN KEY (`main_character`) REFERENCES `characters`(`id`);

ALTER TABLE `relationships` ADD CONSTRAINT `relationships_fk2` FOREIGN KEY (`other_character`) REFERENCES `characters`(`id`);
ALTER TABLE `char_to_ep` ADD CONSTRAINT `char_to_ep_fk1` FOREIGN KEY (`character`) REFERENCES `characters`(`id`);

ALTER TABLE `char_to_ep` ADD CONSTRAINT `char_to_ep_fk2` FOREIGN KEY (`episode`) REFERENCES `episodes`(`id`);