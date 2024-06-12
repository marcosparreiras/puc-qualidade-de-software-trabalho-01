# CRUD Usuários

## Requisitos

- [x] Sistema deve ser escrito em NodeJS
- [x] Deve conter testes unitários
- [x] Deve conter testes de sistema
- [x] Cada usuário deve conter os seguintes atributos:
  - \_id
  - name
  - email
  - password

## Schema do Banco de Dados

```SQL
CREATE TABLE users (
_id VARCHAR(36) PRIMARY KEY,
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

## Teste a aplicação em sua máquina

Certifique-se de ter o Docker e o NodeJs instalado em sua máquina antes de prosseguir.

- [Docker](https://www.docker.com/)
- [NodeJs](https://nodejs.org/en)

1. Faça o clone do projeto

```bash
git clone https://github.com/marcosparreiras/puc-qualidade-de-software-trabalho-01.git
```

2. Navegue até diretório do projeto e execute o seguinte comando para inicar o banco de dados em um container docker:

```bash
docker compose up -d
```

3. Instale as dependências do projeto com o comando:

```bash
npm install
```

4. Com as dependencias do projeto instaladas e com o banco de dados em execução, execute o seguinte comando para executar as migrations no banco de dados:

```bash
npm run db:migrate
```

5. Com tudo configurado você pode executar a aplicação em modo de desenvolvimento com o comando:

```bash
npm run dev
```

ou você pode utilizar os seguites comandos para executar as baterias de teste:

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```
