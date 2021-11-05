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

After testing the API, you should run the database script on your computer, in MySql.

> Após testar a API, você deve rodar o script do banco de dados no seu computador, em MySql. 

If all this is done correctly, your API should now be working and ready to use!

> Se tudo isso for feito corretamente, sua API agora deve estar funcionando e já pode ser utilizada!

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

<br>

**O token de autenticação de login deve ser guardado no AUTHENTICATION, localizado no HEADERS da requisição e deve ser enviado em conjunto de toda requisição que o necessite**

- **Forbidden 403** -> Se o usuário não enviar um token de login ou tentar modificar algo que não está ligado a sua conta receberá essa mensagem de erro **(VALE SOMENTE PARA REQUISIÇÕES QUE NECESSITAM DE TOKEN DE AUTENTICAÇÃO DE LOGIN)**

```json
{
    "msg": "O cliente precisa estar logado para fazer essa requisição. "
}
```

OU

```json
{
    "msg": "O usuário está logado, porém está fazendo requisições em informações de outra conta. "
}
```

<br>

**Erros de sintaxe serão mostrados em retornos dados pelo sistema, e todas as rotas estão protegidas quanto a isso**

- **Erros na sintaxe - 406** -> Existem invalidações nos dados enviados pelo usuário, que serão informados como nos exemplos abaixo

```json
{
    "status": false,
    "msg": "O email deve ter mais de 2 caracteres. "
}
```

```json
{
    "status": false,
    "msg": "A senha deve ter pelo menos 8 caracteres. "
}
```

```json
{
    "status": false,
    "msg": "O CPF/CNPJ deve conter apenas números. "
}
```

<br><br>

### **GET /users**

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
        "email": "mari@gmail.com",
        ...
        "road": "Rua Acento Grave",
        "complement": "37",
        "user_id": 10
    }
]
```

<br><br>

### **GET /user/:id**

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

<br><br>

### **GET /users/rating**

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

<br><br>

### **GET /user/:id/vehicles**

Este endpoint fornece a listagem de um único usuário cadastrado no banco de dados com os seus veículos. 

O cliente **NÃO** precisa estar logado para realizar essa requisição

#### Parâmetros 

- O **ID** requisitado deve ser enviado pela URL.

#### Respostas

- **OK 200** -> Retorna os veículos cadastrados pelo usuário indicado na requisição

**GET /user/1/vehicles**

```json
[
    {
        "id": 3,
        "model": "Corolla",
        ...
        "user_id": 1
    },
    {
        "id": 4,
        "model": "Cadilac",
        ...
        "user_id": 1
    }
]
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

<br><br>

### **GET /user/:id/favorites**

Este endpoint fornece a listagem de um único usuário cadastrado no banco de dados com os seus veículos favoritados. 

O cliente **PRECISA** estar logado para realizar essa requisição

#### Parâmetros 

- O **ID** requisitado deve ser enviado pela URL.

#### Respostas

- **OK 200** -> Retorna os veículos favoritados pelo usuário indicado na requisição

**GET /user/1/favorites**

```json
[
    {
        "id": 3,
        "model": "Corolla",
        ...
        "user_id": 4
    },
    {
        "id": 4,
        "model": "Audi",
        ...
        "user_id": 7
    }
]
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

<br><br>

### **PATCH /user/:id/rating**

Este endpoint modifica o rating do usuário indicado

O cliente **NÃO** precisa estar logado para realizar essa requisição

#### Parâmetros 

- O **ID** requisitado deve ser enviado pela URL.

- O novo ***rating*** deve ser enviado através de um json

```json
{
    "rating": 5.0
}
```

#### Respostas

- **OK 200** -> Significa que o ***rating*** foi atualizado com sucesso.

```json
{
    "msg": "Rating do usuário atualizado. "
}
```

<br>

- **Not Acceptable 406** -> Ocorreu um dos dois erros abaixo

O parâmetro não é um número

**PATCH /user/jjkk/rating**

```json
{
    "msg": "O parâmetro passado precisa ser um número. "
}
```

**OU** o ID do usuário não existe no banco de dados

**PATCH /user/1000000000001/rating**

```json
{
    "msg": "O ID de usuário indicado não existe no banco de dados. "
}
```

<br><br>

### **PUT /user/:id**

Este endpoint modifica os dados do usuário

O cliente **PRECISA** estar logado para realizar essa requisição

#### Parâmetros 

- O **ID** requisitado deve ser enviado pela URL.

- O novos dados devem ser enviados através de um json

```json
{
    "name": "lemas",
    "phone": "14576986985",
    "email": "lemas@gmail.com",
    "cpf": 07307307327,
    "cnpj": null,
    "cep": 17500000,
    "state": "São Paulo",
    "city": "Marília",
    "district": "Vila Barros",
    "road": "Rua Juliete",
    "complement": "32, apto 10"
}
```

> Qualquer um dos dados inseridos acima podem ser omitidos, informando somente os dados que deseja atualizar

> ATENÇÃO: somente o CPF **OU** o CNPJ pode ser inserido, um dos dois deve ser omitido ou atribuido como null

#### Respostas

- **OK 200** -> O usuário foi atualizado

```json
{
    "msg": "Usuário atualizado. "
}
```

<br>

- **Not Acceptable 406** -> Ocorreu um dos três erros abaixo

**ERRO 01** -> O email indicado pelo usuário já existe no banco de dados

**Corpo da requisição**

PUT /user/1

```json
{
    "name": "lemarque",
    "email": "emailjautilizado@gmail.com"
}
```
**Resposta**

Bad Request 406

```json
{
    "msg": "O email inserido já existe no banco de dados. "
}
```

**ERRO 02** -> O CPF indicado pelo usuário já existe no banco de dados

**Corpo da requisição**

PUT /user/1

```json
{
    //CPF já cadastrado anteriormente
    "name": "lemarque",
    "cpf": 00000000000 
}
```
**Resposta**

Bad Request 406

```json
{
    "msg": "O CPF já foi cadastrado anteriormente no sistema. "
}
```

**ERRO 03** -> O CNPJ indicado pelo usuário já existe no banco de dados

**Corpo da requisição**

PUT /user/1

```json
{
    //CNPJ já cadastrado anteriormente
    "name": "lemarque",
    "cnpj": 00000000000000 
}
```
**Resposta**

Bad Request 406

```json
{
    "msg": "O CPF já foi cadastrado anteriormente no sistema. "
}
```


<br><br>

### **DELETE /user/:id**

Este endpoint deleta os dados do usuário

O cliente **PRECISA** estar logado para realizar essa requisição

#### Parâmetros 

- O **ID** requisitado deve ser enviado pela URL.

#### Respostas

- **OK 200** -> O usuário foi deletado com sucesso

**DELETE /user/1**

```json
{
    "msg": "Usuário deletado. ID: 1"
}
```

<br>

- **Not Acceptable 406** -> Ocorreu um dos dois erros abaixo

O parâmetro não é um número

**DELETE /user/jjkk**

```json
{
    "msg": "O parâmetro passado precisa ser um número. "
}
```

**OU** o ID do usuário não existe no banco de dados

**DELETE /user/1000000000001**

```json
{
    "msg": "O ID de usuário indicado não existe no banco de dados. "
}
```

<br><br>

### **POST /user**

Este endpoint cria um usuário

O cliente **NÃO** precisa estar logado para realizar essa requisição

#### Parâmetros

- O dados devem ser enviados através de um json, como o exemplo abaixo

```json
{
    "name": "lemas",
    "phone": "14576986985",
    "password" : "sucodefruta2",
    "email": "lemas@gmail.com",
    "cpfCnpj": 0730730732,
    "cep": 17500000,
    "state": "São Paulo",
    "city": "Marília",
    "district": "Vila Barros",
    "road": "Rua Juliete",
    "complement": "32, apto 10"
}
```

#### Respostas

- **OK 200** -> O usuário foi cadastrado

```json
{
    "msg": "Usuário cadastrado. ID: 1"
}
```

<br>

- **Not Acceptable 406** -> Ocorreu um dos três erros abaixo

**ERRO 01** -> O email indicado pelo usuário já existe no banco de dados

**Corpo da requisição**

POST /user

```json
{
    "name": "lemas",
    "phone": "14576986985",
    "password" : "sucodefruta2",
    "email": "emailjautilizado@gmail.com",
    "cpfCnpj": 0730730732,
    "cep": 17500000,
    "state": "São Paulo",
    "city": "Marília",
    "district": "Vila Barros",
    "road": "Rua Juliete",
    "complement": "32, apto 10"
}
```
**Resposta**

Bad Request 406

```json
{
    "msg": "O email inserido já existe no banco de dados. "
}
```

**ERRO 02** -> O CPF indicado pelo usuário já existe no banco de dados

**Corpo da requisição**

POST /user

```json
{
    //CPF já cadastrado anteriormente
    "name": "lemas",
    "phone": "14576986985",
    "password" : "sucodefruta2",
    "email": "lemas@gmail.com",
    "cpfCnpj": 00000000000,
    "cep": 17500000,
    "state": "São Paulo",
    "city": "Marília",
    "district": "Vila Barros",
    "road": "Rua Juliete",
    "complement": "32, apto 10"
}
```
**Resposta**

Bad Request 406

```json
{
    "msg": "O CPF já foi cadastrado anteriormente no sistema. "
}
```

**ERRO 03** -> O CNPJ indicado pelo usuário já existe no banco de dados

**Corpo da requisição**

POST /user

```json
{
    //CNPJ já cadastrado anteriormente
    "name": "lemas",
    "phone": "14576986985",
    "password" : "sucodefruta2",
    "email": "lemas@gmail.com",
    "cpfCnpj": 00000000000000,
    "cep": 17500000,
    "state": "São Paulo",
    "city": "Marília",
    "district": "Vila Barros",
    "road": "Rua Juliete",
    "complement": "32, apto 10"
}
```
**Resposta**

Bad Request 406

```json
{
    "msg": "O CPF já foi cadastrado anteriormente no sistema. "
}
```


<br><br>

### **POST /user/login**

Este endpoint realiza o login dos usuário

O cliente **NÃO** precisa estar logado para realizar essa requisição

#### Parâmetros

- O dados devem ser enviados através de um json, como o exemplo abaixo

```json
{
    "email": "lemarque@gmail.com",
    "senha": "lemaselemesmo"
}
```

#### Respostas

- **OK 200** -> O login foi realizado

```json
{
    "token": "fasdhjfeujJSDPGJ\SIGRrgfwrjewfGFERfjhrewJHeIEDFDIIEW"
}
```

<br>

- **Bad Request 406** -> Login ou senha estão inválidos

```json
{
    "msg": "Credenciais inválidas. "
}
```

<br><br>

### **POST /user/recoverPassword**

Este endpoint envia o token de recuperação de senha para o usuário

O cliente **NÃO** precisa estar logado para realizar essa requisição

#### Parâmetros

- O email deve ser enviado através de um json

```json
{
    "email": "lemarque@gmail.com"
}
```

#### Respostas

- **OK 200** -> O token de recuperação de senha foi enviado para o email cadastrado do usuário

```json
{
    "msg": "Confira em seu email o token para recuperação de senha. Token: <token aqui>"
}
```

<br>

- **Bad Request 406** -> O email inserido não existe no banco de dados

```json
{
    "msg": "O email de usuário indicado não existe no banco de dados. "
}
```

___

## Contribuidores

[Marcos Fajoli de Almeida](https://github.com/MarcosFajoli) -> Desenvolvedor back-end e aluno do último ano do curso de Desenvolvimento de Sistemas da ETEC Antonio Devisate

[Victor Nathan Alves Gomes](https://github.com/VictorNAGomes) -> Desenvolvedor full-stack e aluno do último ano do curso de Desenvolvimento de Sistemas da ETEC Antonio Devisate
