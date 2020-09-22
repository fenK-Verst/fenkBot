create table lessons
(
    date     datetime
        constraint lessons_pk
            primary key,
    lessons  text         default '{}',
    homework varchar(255) default null
);

create unique index lessons_date_uindex
    on lessons (date);