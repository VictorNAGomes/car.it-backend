drop database if exists carit;

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
) CHARACTER SET utf8 COLLATE utf8_general_ci;

create table adresses (
    id int not null primary key auto_increment,
    cep varchar(10) not null,
    state varchar(20) not null,
    city varchar(30) not null,
    district varchar(100) not null,
    road varchar(100) not null,
    complement varchar(10) not null,
    editedAt datetime,
    user_id int not null,
    constraint fk_address_user_id foreign key (user_id) references users(id) 
        on update cascade 
        on delete cascade
) CHARACTER SET utf8 COLLATE utf8_general_ci;

create table vehicles(
    id int not null primary key auto_increment,
    model varchar(30) not null,
    brand varchar(30) not null,
    year char(4) not null,
    vehicleType enum("Carro", "Moto") not null,
    conservationState enum("Novo", "Seminovo", "Usado"),
    price int(9) not null,
    steering enum("Hidráulica", "Eletro-hidráulica", "Elétrica", "Mecânica"),
    transmission enum("Manual", "Automatizada", "Automática") not  null,
    doors int(1),
    fuel enum("Gasolina", "Etanol", "Flex", "Diesel", "Gás", "Eletricidade") not null,
    description text,
    createdAt datetime not null default now(),
    editedAt datetime,
    user_id int not null,
    constraint fk_car_user_id foreign key (user_id) references users(id)
        on update cascade 
        on delete cascade
) CHARACTER SET utf8 COLLATE utf8_general_ci;

create table additionals(
    id int not null primary key auto_increment,
    name varchar(80) not null
) CHARACTER SET utf8 COLLATE utf8_general_ci;

create table vehicle_additional(
    id int not null primary key auto_increment,
    vehicle_id int not null,
    additional_id int not null,
    constraint fk_vehicle_id foreign key (vehicle_id) references vehicles(id)
        on update cascade 
        on delete cascade,
    constraint fk_additional_id foreign key (additional_id) references additionals(id)
        on update cascade 
        on delete cascade
) CHARACTER SET utf8 COLLATE utf8_general_ci;