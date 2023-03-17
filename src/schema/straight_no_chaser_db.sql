create database if not exists `straight_no_chaser`;

use `straight_no_chaser`;

create table if not exists `shows`(
    `id` int(11) AUTO_INCREMENT,
    `host` varchar(300) NOT NULL,
    `title` varchar(500) NULL,
    `show_date` DATETIME,
    `date_created` DATETIME,
    `date_updated` DATETIME,
    PRIMARY KEY(`id`)
);

create table if not exists `tracks` (
    `id` bigint(20) AUTO_INCREMENT,
    `show_id` int(11),
    `track` varchar(500),
    `artist` varchar(500),
    `album` varchar(500),
    `label` varchar(500),
    PRIMARY KEY(`id`),
    FOREIGN KEY (`show_id`) 
    REFERENCES `shows`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=INNODB;