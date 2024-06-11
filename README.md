# CRUD Usuários

## Requisitos

- [] Sistema deve ser escrito em NodeJS
- [] Deve conter testes unitários
- [] Deve conter testes de sistema
- [] Cada usuário deve conter os seguintes atributos:
  - \_id
  - name
  - email
  - password

## Schema do Banco de Dados

```SQL
CREATE TABLE users (
_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL
);
```

## Contrato da API

| Método | Path       | Descrição                | Cenários de Teste                                   |
| ------ | ---------- | ------------------------ | --------------------------------------------------- |
| GET    | /users     | Listar todos os usuários | Status Code = 200 (OK)                              |
| POST   | /users     | Criar um novo usuário    | Status Code = 201 (Created)                         |
| GET    | /users/:id | Detalhar um usuário      | Status Code = 200 (OK) \|\| 404 (Not Found)         |
| PUT    | /users/:id | Atualizar um usuário     | Status Code = 200 (OK) \|\| 404 (Not Found)         |
| DELETE | /users/:id | Remover um usuário       | Status Code = 204 (No Content) \|\| 404 (Not Found) |
