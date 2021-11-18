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
    codeToVerify char(6) default "000000",
    hasAddress tinyint default 0,
    verified tinyint default 0,
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
    user_id int not null,
    constraint fk_address_user_id foreign key (user_id) references users(id) 
        on update cascade 
        on delete cascade
) CHARACTER SET utf8 COLLATE utf8_general_ci;

create table passwordTokens (
    id int not null primary key auto_increment,
    token varchar(200),
    used tinyint default 0,
    user_id int not null,
    constraint fk_passwordTokens_user_id foreign key (user_id) references users(id)
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

create table favorites (
    id int not null primary key auto_increment,
    user_id int not null,
    vehicle_id int not null,
    constraint fk_favorites_user_id foreign key (user_id) references users(id)
        on update cascade
        on delete cascade,
    constraint fk_favorites_vehicle_id foreign key (vehicle_id) references vehicles(id)
        on update cascade
        on delete cascade
);

create table user_image(
    id int not null primary key auto_increment,
    fileName varchar(120) not null,
    link varchar(100) not null,
    deleteHash varchar(100) not null,
    user_id int not null,
    constraint fk_user_image_id foreign key (user_id) references users(id)
        on update cascade
        on delete cascade
);

insert into additionals (name) values
("Ar condicionado"),
("Câmbio Borboleta"),
("Vidro Elétrico"),
("Controle de Estabilidade"),
("Airbag"),
("Alarme"),
("Trava Elétrica"),
("Teto Solar");
