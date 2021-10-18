# Car.it - backend [API]

Guide for using the **API** provided for **Car.it** requests.
> Guia para utilização da **API** fornecida para as requisições do **Car.it**

<br>

___

## Installation (Instalação)


To install the API, use the following command line in **Git Bash** of your directory:

> Para instalar a API, utilize a seguinte linha de comando no **Git Bash** de seu diretório:

```bash
git clone https://github.com/VictorNAGomes/car.it-backend.git
```

After cloning the repository, you must run the following command to install the necessary dependencies:

> Após realizar a clonagem do repositório, deve executar o seguinte comando para instalar as dependências necessárias:

```bash
npm install
```

Once you have performed all the actions mentioned, the API should already be working, use the following command to check:

> Ao ter realizado todas as ações citadas, a API já deve estar funcionando, utilize o seguinte comando para conferir:

```bash
npm start
```

<br>

___

## Endpoints of API

###### Observações


**Todas as requisições podem retornar um erro interno do servidor parecido com esse abaixo. Isso acontece quando o servidor não tem alternativas para lidar com a requisição enviada**


- **Internal Server Error 500** ->  O servidor encontrou algum problema interno ao realizar a requisição

```json
{
    "msg": "Ocorreu um erro ao listar os usuários: Error: select * from `users` inner join `ENDERECIN` 
     on `adresses`.`user_id` = `users`.`id` - Table 'carit.enderecin' doesn't exist"
}
```

**O token de autenticação de login deve ser guardado no AUTHENTICATION, localizado no HEADERS da requisição e deve ser enviado em conjunto de toda requisição que o necessite**

<br>

### GET /users

Este endpoint fornece a listagem de todos os usuários cadastrados no banco de dados. 

O cliente **NÃO** precisa estar logado para realizar essa requisição

#### Parâmetros 

- Nenhum parâmetro é necessário.

#### Respostas

- **OK 200** -> Retorna todos os usuários cadastrados no sistema

```json
[
    {
        "id": 1,
        "name": "Marcos Fajoli",
        "phone": "01514981010700",
        "password": "$2b$10$nuY9miure4SxbDFqmDM67e/9WamJD/YSREGO6UKiVrK5UpLMRW2dq",
        "email": "marcos@gmail.com",
        ...
        "road": "Rua Acento Agudo",
        "complement": "37",
        "user_id": 1
    },
    {
        "id": 2,
        "name": "Caue Almeida",
        "phone": "01514981010700",
        "password": "$2b$10$nuY9miure4SxbDFqmDM67erj0ekyeIPISfxMvdn0UO9Ro5cjQpghq",
        "email": "caue@gmail.com",
        ...
        "road": "Rua Acento Circunflexo",
        "complement": "37",
        "user_id": 2
    },
    ...
    {
        "id": 10,
        "name": "Mari Macedo",
        "phone": "01514981010700",
        "password": "$2b$10$pfJxd866FSMS/Xbyb66gJ.ZkJcUtVzO1wEPAOfZhGVdArT4BIznJi",
        "email": "mari@gmail.com",
        ...
        "road": "Rua Acento Grave",
        "complement": "37",
        "user_id": 10
    }
]
```

<br>

### GET /user/:id

Este endpoint fornece a listagem de um único usuário cadastrado no banco de dados. 

O cliente **NÃO** precisa estar logado para realizar essa requisição

#### Parâmetros 

- O **ID** requisitado deve ser enviado pela URL.

#### Respostas

- **OK 200** -> Retorna o usuário indicado na requisição

**GET /user/2**

```json
[
    {
        "id": 2,
        "name": "Caue Almeida",
        "phone": "01514981010700",
        "password": "$2b$10$nuY9miure4SxbDFqmDM67erj0ekyeIPISfxMvdn0UO9Ro5cjQpghq",
        "email": "caue@gmail.com",
        ...
        "complement": "37",
        "user_id": 2
    }
]
```

<br>

- **Not Acceptable 406** -> Ocorreu um dos dois erros abaixo

O parâmetro não é um número

**GET /user/jjkk**

```json
{
    "msg": "O parâmetro passado precisa ser um número. "
}
```

<br>

**OU** o ID do usuário não existe no banco de dados

**GET /user/1000000000001**

```json
{
    "msg": "O ID de usuário indicado não existe no banco de dados. "
}
```

<br>

### GET /users/rating

Este endpoint fornece a listagem de todos os usuários cadastrados no banco de dados ordenados pelo ***rating***. 

O cliente **NÃO** precisa estar logado para realizar essa requisição

#### Parâmetros 

- Nenhum parâmetro é necessário.

#### Respostas

- **OK 200** -> Retorna todos os usuários cadastrados no sistema ordenados pelo ***rating***

```json
[
    {
        "id": 1,
        "name": "Marcos Fajoli",
        ...
        "rating": 5.0
    },
    {
        "id": 3,
        "name": "Caue Almeida",
        ...
        "rating": 4.9
    },
    ...
    {
        "id": 7,
        "name": "Mari Macedo",
        ...
        "rating": 2.2
    }
]
```

<br>

### GET /user/:id/vehicles

Este endpoint fornece a listagem de um único usuário cadastrado no banco de dados com os seus veículos. 

O cliente **NÃO** precisa estar logado para realizar essa requisição

#### Parâmetros 

- O **ID** requisitado deve ser enviado pela URL.

#### Respostas

- **OK 200** -> Retorna o ID do usuário indicado na requisição com os IDs dos seus veículos cadastrados

**GET /user/1/vehicles**

```json
{
    "id": 1,
    "vehicles": [
        {
            "id": 1
        },
        {
            "id": 2
        }
    ]
}
```

<br>

- **Not Acceptable 406** -> Ocorreu um dos dois erros abaixo

O parâmetro não é um número

**GET /user/jjkk/vehicles**

```json
{
    "msg": "O parâmetro passado precisa ser um número. "
}
```

**OU** o ID do usuário não existe no banco de dados

**GET /user/1000000000001/vehicles**

```json
{
    "msg": "O ID de usuário indicado não existe no banco de dados. "
}
```

<br>

### GET /user/:id/favorites

Este endpoint fornece a listagem de um único usuário cadastrado no banco de dados com os seus veículos favoritados. 

O cliente **PRECISA** estar logado para realizar essa requisição

#### Parâmetros 

- O **ID** requisitado deve ser enviado pela URL.

#### Respostas

- **OK 200** -> Retorna o ID do usuário indicado na requisição com os IDs dos seus veículos cadastrados

**GET /user/1/favorites**

```json
[
    {
        "userId": 1,
        "vehicleId": 1
    },
    {
        "userId": 1,
        "vehicleId": 2
    }
]
```

<br>

- **Forbidden 403** -> A requisição não enviou o token de autenticação de login ou ele é inválido

```json
{
    "msg": "O cliente precisa estar logado para fazer essa requisição. "
}
```

<br>

- **Not Acceptable 406** -> Ocorreu um dos dois erros abaixo

O parâmetro não é um número

**GET /user/jjkk/favorites**

```json
{
    "msg": "O parâmetro passado precisa ser um número. "
}
```

**OU** o ID do usuário não existe no banco de dados

**GET /user/1000000000001/favorites**

```json
{
    "msg": "O ID de usuário indicado não existe no banco de dados. "
}
```

<br>

___

## Contribuidores

[Marcos Fajoli de Almeida](https://github.com/MarcosFajoli) -> Desenvolvedor back-end e aluno do último ano do curso de Desenvolvimento de Sistemas da ETEC Antonio Devisate

[Victor Nathan Alves Gomes](https://github.com/MarcosFajoli) -> Desenvolvedor full-stack e aluno do último ano do curso de Desenvolvimento de Sistemas da ETEC Antonio Devisate