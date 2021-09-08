create database if not exists carit;

use carit;

create table users (
    id int not null primary key auto_increment,
    name varchar(200) not null,
    phone varchar(20) not null,
    password varchar(200) not null,
    email varchar(150) not null unique,
    cpf char(11) unique,
    cnpj char(14) unique,
    rating decimal(2, 1) not null,
    createdAt datetime not null default now(),
    editedAt datetime
);

create table adresses (
    id int not null primary key auto_increment,
    cep varchar(10) not null,
    state varchar(20) not null,
    city varchar(30) not null,
    road varchar(100) not null,
    complement varchar(10) not null,
    editedAt datetime,
    user_id int not null,
    constraint fk_address_user_id foreign key (user_id) references users(id) 
        on update cascade 
        on delete cascade
);

create table cars(
    id int not null primary key auto_increment,
    model varchar(80) not null,
    year int(4) not null,
    conservationState varchar(20),
    price decimal(11,2) not null,
    steering enum("Hidráulica", "Eletro-hidráulica", "Elétrica", "Mecânica") not null,
    transmission enum("Manual", "Automatizada", "Automática") not null,
    doors int(2) not null,
    fuel enum("Gasolina", "Etanol", "Flex", "Diesel", "Gás", "Eletricidade"),
    createdAt datetime not null default now(),
    editedAt datetime,
    user_id int not null,
    constraint fk_car_user_id foreign key (user_id) references users(id)
        on update cascade 
        on delete cascade
);

create table additionals(
    id int not null primary key auto_increment,
    name varchar(80) not null
);

create table car_additional(
    id int not null primary key auto_increment,
    car_id int not null,
    additional_id int not null,
    constraint fk_car_id foreign key (car_id) references cars(id)
        on update cascade 
        on delete cascade,
    constraint fk_additional_id foreign key (additional_id) references additionals(id)
        on update cascade 
        on delete cascade
);