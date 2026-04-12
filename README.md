# Freelancer Network API

Backend de uma rede social voltada para freelancers. A plataforma permite que profissionais publiquem seus projetos, compartilhem seu trabalho e se conectem com outros especialistas.

A ideia é facilitar a colaboração entre freelancers. Quando um profissional precisa entregar um trabalho que exige habilidades fora da sua área de especialização, ele pode encontrar e entrar em contato com outros freelancers da plataforma para complementar o projeto e oferecer um resultado melhor para o cliente.

A API fornece funcionalidades como:

* autenticação de usuários
* publicação de projetos
* comentários e curtidas
* busca de profissionais
* sistema de seguidores

---

# Tecnologias

* Node.js
* GraphQL
* Apollo Server
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

---

# Funcionalidades

* Registro e autenticação de usuários
* Criação, edição e remoção de projetos
* Curtidas em projetos
* Comentários em projetos
* Sistema de seguidores
* Busca de usuários
* Busca e filtros de projetos
* Projetos mais curtidos
* Projetos mais comentados

---

# Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

Instale as dependências:

```
npm install
```

---

# Configuração

Crie um arquivo `.env` na raiz do projeto:

```
MONGO_URI=sua_string_do_mongodb
JWT_SECRET=sua_chave_secreta
PORT=5000
```

---

# Executando o projeto

Modo desenvolvimento:

```
npm run dev
```

A API estará disponível em:

```
http://localhost:5000/graphql
```

---

# Estrutura do Projeto

```
back-end
├── config
│   └── db.js
├── graphql
│   ├── schema.js
│   ├── resolvers.js
│   └── context.js
├── models
│   ├── User.js
│   ├── Project.js
│   ├── Comment.js
│   ├── Like.js
│   └── Follow.js
├── app.js
└── server.js
```

---

# Uso da API

A API utiliza **GraphQL**.
As requisições podem ser feitas através do playground do Apollo ou ferramentas como:

* Postman
* Insomnia
* Apollo Sandbox

Endpoint principal:

```
/graphql
```

# GraphQL API

API GraphQL para gerenciamento de **usuários, projetos, curtidas, comentários e seguidores**.

---

# Base Query

Todas as requisições são feitas para:

```
/graphql
```

---

# Queries

## searchUsers

Busca usuários pelo nome.

### Parâmetros

| Campo | Tipo   | Descrição                        |
| ----- | ------ | -------------------------------- |
| name  | String | Nome ou parte do nome do usuário |

### Exemplo

```graphql
query {
  searchUsers(name: "jo") {
    id
    name
    email
    avatar
    description
    area
    contact
    projectsCount
    followersCount
    followingCount
  }
}
```

---

# searchProjectsByTitle

Busca projetos pelo título.

### Parâmetros

| Campo | Tipo   | Descrição                   |
| ----- | ------ | --------------------------- |
| title | String | Texto para buscar no título |

### Exemplo

```graphql
query {
  searchProjectsByTitle(title: "portfolio") {
    id
    title
    description
    category
    images
  }
}
```

---

# projects

Lista todos os projetos.

Também pode receber filtros.

### Parâmetros opcionais

| Campo    | Tipo   |
| -------- | ------ |
| title    | String |
| category | String |
| userId   | ID     |

### Exemplo

```graphql
query {
  projects {
    id
    title
    description
    category
    images
    createdAt
    likesCount
    commentsCount
  }
}
```

---

# project

Busca um projeto específico.

### Parâmetros

| Campo | Tipo |
| ----- | ---- |
| id    | ID   |

### Exemplo

```graphql
query {
  project(id: "PROJECT_ID") {
    id
    title
    description
    category
    images
    likesCount
    commentsCount
  }
}
```

---

# projectsByUser

Busca projetos de um usuário específico.

### Parâmetros

| Campo  | Tipo |
| ------ | ---- |
| userId | ID   |

```graphql
query {
  projectsByUser(userId: "USER_ID") {
    id
    title
    description
  }
}
```

---

# projectsByCategory

Busca projetos por categoria.

### Parâmetros

| Campo    | Tipo   |
| -------- | ------ |
| category | String |

```graphql
query {
  projectsByCategory(category: "Design") {
    id
    title
    description
  }
}
```

---

# mostLikedProjects

Lista os projetos mais curtidos.

```graphql
query {
  mostLikedProjects {
    id
    title
    likesCount
  }
}
```

---

# mostCommentedProjects

Lista os projetos mais comentados.

```graphql
query {
  mostCommentedProjects {
    id
    title
    commentsCount
  }
}
```

---

# projectComments

Busca comentários de um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

```graphql
query {
  projectComments(projectId: "PROJECT_ID") {
    id
    text
    createdAt
  }
}
```

---

# projectLikes

Lista curtidas de um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

```graphql
query {
  projectLikes(projectId: "PROJECT_ID") {
    id
  }
}
```

---

# Mutations

As mutations são usadas para **criar, atualizar ou remover dados** na API.

---

# login

Autentica um usuário.

### Parâmetros

| Campo    | Tipo   |
| -------- | ------ |
| email    | String |
| password | String |

### Exemplo

```graphql
mutation {
  login(
    email: "usuario@email.com"
    password: "123456"
  ) {
    token
  }
}
```

---

# register

Cria um novo usuário.

### Parâmetros

| Campo    | Tipo   |
| -------- | ------ |
| name     | String |
| email    | String |
| password | String |

### Exemplo

```graphql
mutation {
  register(
    name: "João"
    email: "joao@email.com"
    password: "123456"
  ) {
    token
  }
}
```

---

# followUser

Permite seguir outro usuário.

### Parâmetros

| Campo  | Tipo |
| ------ | ---- |
| userId | ID   |

### Exemplo

```graphql
mutation {
  followUser(userId: "USER_ID")
}
```

---

# unfollowUser

Permite deixar de seguir um usuário.

### Parâmetros

| Campo  | Tipo |
| ------ | ---- |
| userId | ID   |

### Exemplo

```graphql
mutation {
  unfollowUser(userId: "USER_ID")
}
```

---

# updateProfile

Atualiza informações do perfil.

### Parâmetros

| Campo       | Tipo   |
| ----------- | ------ |
| avatar      | String |
| description | String |
| area        | String |
| contact     | String |

### Exemplo

```graphql
mutation {
  updateProfile(
    avatar: "https://site.com/avatar.png"
    description: "Designer gráfico"
    area: "Design"
    contact: "email@email.com"
  ) {
    id
    name
    email
    avatar
    description
    area
    contact
    projectsCount
    followersCount
    followingCount
  }
}
```

---

# createProject

Cria um novo projeto.

### Parâmetros

| Campo       | Tipo     |
| ----------- | -------- |
| title       | String   |
| description | String   |
| category    | String   |
| link        | String   |
| images      | [String] |

### Exemplo

```graphql
mutation {
  createProject(
    title: "Meu Projeto"
    description: "Descrição do projeto"
    category: "Programação"
    link: "https://github.com/exemplo"
    images: ["https://site.com/img.png"]
  ) {
    id
    title
    description
    category
    link
    images
    createdAt
    likesCount
    commentsCount
  }
}
```

---

# updateProject

Atualiza um projeto existente.

### Parâmetros

| Campo       | Tipo     |
| ----------- | -------- |
| projectId   | ID       |
| title       | String   |
| description | String   |
| category    | String   |
| link        | String   |
| images      | [String] |

### Exemplo

```graphql
mutation {
  updateProject(
    projectId: "PROJECT_ID"
    title: "Novo título"
  ) {
    id
    title
    description
    category
    link
    images
    createdAt
    likesCount
    commentsCount
  }
}
```

---

# deleteProject

Remove um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

### Exemplo

```graphql
mutation {
  deleteProject(projectId: "PROJECT_ID")
}
```

---

# createComment

Adiciona um comentário em um projeto.

### Parâmetros

| Campo     | Tipo   |
| --------- | ------ |
| projectId | ID     |
| text      | String |

### Exemplo

```graphql
mutation {
  createComment(
    projectId: "PROJECT_ID"
    text: "Muito bom!"
  ) {
    id
    text
    createdAt
  }
}
```

---

# updateComment

Edita um comentário existente.

### Parâmetros

| Campo     | Tipo   |
| --------- | ------ |
| commentId | ID     |
| text      | String |

### Exemplo

```graphql
mutation {
  updateComment(
    commentId: "COMMENT_ID"
    text: "Comentário atualizado"
  ) {
    id
    text
    createdAt
  }
}
```

---

# deleteComment

Remove um comentário.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| commentId | ID   |

### Exemplo

```graphql
mutation {
  deleteComment(commentId: "COMMENT_ID")
}
```

---

# likeProject

Adiciona uma curtida a um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

### Exemplo

```graphql
mutation {
  likeProject(projectId: "PROJECT_ID") {
    id
  }
}
```

---

# unlikeProject

Remove a curtida de um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

### Exemplo

```graphql
mutation {
  unlikeProject(projectId: "PROJECT_ID")
}
```

# Freelancer Network API

Backend de uma rede social voltada para freelancers. A plataforma permite que profissionais publiquem seus projetos, compartilhem seu trabalho e se conectem com outros especialistas.

A ideia é facilitar a colaboração entre freelancers. Quando um profissional precisa entregar um trabalho que exige habilidades fora da sua área de especialização, ele pode encontrar e entrar em contato com outros freelancers da plataforma para complementar o projeto e oferecer um resultado melhor para o cliente.

A API fornece funcionalidades como:

* autenticação de usuários
* publicação de projetos
* comentários e curtidas
* busca de profissionais
* sistema de seguidores

---

# Tecnologias

* Node.js
* GraphQL
* Apollo Server
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

---

# Funcionalidades

* Registro e autenticação de usuários
* Criação, edição e remoção de projetos
* Curtidas em projetos
* Comentários em projetos
* Sistema de seguidores
* Busca de usuários
* Busca e filtros de projetos
* Projetos mais curtidos
* Projetos mais comentados

---

# Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

Instale as dependências:

```
npm install
```

---

# Configuração

Crie um arquivo `.env` na raiz do projeto:

```
MONGO_URI=sua_string_do_mongodb
JWT_SECRET=sua_chave_secreta
PORT=5000
```

---

# Executando o projeto

Modo desenvolvimento:

```
npm run dev
```

A API estará disponível em:

```
http://localhost:5000/graphql
```

---

# Estrutura do Projeto

```
back-end
├── config
│   └── db.js
├── graphql
│   ├── schema.js
│   ├── resolvers.js
│   └── context.js
├── models
│   ├── User.js
│   ├── Project.js
│   ├── Comment.js
│   ├── Like.js
│   └── Follow.js
├── app.js
└── server.js
```

---

# Uso da API

A API utiliza **GraphQL**.
As requisições podem ser feitas através do playground do Apollo ou ferramentas como:

* Postman
* Insomnia
* Apollo Sandbox

Endpoint principal:

```
/graphql
```

# GraphQL API

API GraphQL para gerenciamento de **usuários, projetos, curtidas, comentários e seguidores**.

---

# Base Query

Todas as requisições são feitas para:

```
/graphql
```

---

# Queries

## searchUsers

Busca usuários pelo nome.

### Parâmetros

| Campo | Tipo   | Descrição                        |
| ----- | ------ | -------------------------------- |
| name  | String | Nome ou parte do nome do usuário |

### Exemplo

```graphql
query {
  searchUsers(name: "jo") {
    id
    name
    email
    avatar
    description
    area
    contact
    projectsCount
    followersCount
    followingCount
  }
}
```

---

# searchProjectsByTitle

Busca projetos pelo título.

### Parâmetros

| Campo | Tipo   | Descrição                   |
| ----- | ------ | --------------------------- |
| title | String | Texto para buscar no título |

### Exemplo

```graphql
query {
  searchProjectsByTitle(title: "portfolio") {
    id
    title
    description
    category
    images
  }
}
```

---

# projects

Lista todos os projetos.

Também pode receber filtros.

### Parâmetros opcionais

| Campo    | Tipo   |
| -------- | ------ |
| title    | String |
| category | String |
| userId   | ID     |

### Exemplo

```graphql
query {
  projects {
    id
    title
    description
    category
    images
    createdAt
    likesCount
    commentsCount
  }
}
```

---

# project

Busca um projeto específico.

### Parâmetros

| Campo | Tipo |
| ----- | ---- |
| id    | ID   |

### Exemplo

```graphql
query {
  project(id: "PROJECT_ID") {
    id
    title
    description
    category
    images
    likesCount
    commentsCount
  }
}
```

---

# projectsByUser

Busca projetos de um usuário específico.

### Parâmetros

| Campo  | Tipo |
| ------ | ---- |
| userId | ID   |

```graphql
query {
  projectsByUser(userId: "USER_ID") {
    id
    title
    description
  }
}
```

---

# projectsByCategory

Busca projetos por categoria.

### Parâmetros

| Campo    | Tipo   |
| -------- | ------ |
| category | String |

```graphql
query {
  projectsByCategory(category: "Design") {
    id
    title
    description
  }
}
```

---

# mostLikedProjects

Lista os projetos mais curtidos.

```graphql
query {
  mostLikedProjects {
    id
    title
    likesCount
  }
}
```

---

# mostCommentedProjects

Lista os projetos mais comentados.

```graphql
query {
  mostCommentedProjects {
    id
    title
    commentsCount
  }
}
```

---

# projectComments

Busca comentários de um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

```graphql
query {
  projectComments(projectId: "PROJECT_ID") {
    id
    text
    createdAt
  }
}
```

---

# projectLikes

Lista curtidas de um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

```graphql
query {
  projectLikes(projectId: "PROJECT_ID") {
    id
  }
}
```

---

# Mutations

As mutations são usadas para **criar, atualizar ou remover dados** na API.

---

# login

Autentica um usuário.

### Parâmetros

| Campo    | Tipo   |
| -------- | ------ |
| email    | String |
| password | String |

### Exemplo

```graphql
mutation {
  login(
    email: "usuario@email.com"
    password: "123456"
  ) {
    token
  }
}
```

---

# register

Cria um novo usuário.

### Parâmetros

| Campo    | Tipo   |
| -------- | ------ |
| name     | String |
| email    | String |
| password | String |

### Exemplo

```graphql
mutation {
  register(
    name: "João"
    email: "joao@email.com"
    password: "123456"
  ) {
    token
  }
}
```

---

# followUser

Permite seguir outro usuário.

### Parâmetros

| Campo  | Tipo |
| ------ | ---- |
| userId | ID   |

### Exemplo

```graphql
mutation {
  followUser(userId: "USER_ID")
}
```

---

# unfollowUser

Permite deixar de seguir um usuário.

### Parâmetros

| Campo  | Tipo |
| ------ | ---- |
| userId | ID   |

### Exemplo

```graphql
mutation {
  unfollowUser(userId: "USER_ID")
}
```

---

# updateProfile

Atualiza informações do perfil.

### Parâmetros

| Campo       | Tipo   |
| ----------- | ------ |
| avatar      | String |
| description | String |
| area        | String |
| contact     | String |

### Exemplo

```graphql
mutation {
  updateProfile(
    avatar: "https://site.com/avatar.png"
    description: "Designer gráfico"
    area: "Design"
    contact: "email@email.com"
  ) {
    id
    name
    email
    avatar
    description
    area
    contact
    projectsCount
    followersCount
    followingCount
  }
}
```

---

# createProject

Cria um novo projeto.

### Parâmetros

| Campo       | Tipo     |
| ----------- | -------- |
| title       | String   |
| description | String   |
| category    | String   |
| link        | String   |
| images      | [String] |

### Exemplo

```graphql
mutation {
  createProject(
    title: "Meu Projeto"
    description: "Descrição do projeto"
    category: "Programação"
    link: "https://github.com/exemplo"
    images: ["https://site.com/img.png"]
  ) {
    id
    title
    description
    category
    link
    images
    createdAt
    likesCount
    commentsCount
  }
}
```

---

# updateProject

Atualiza um projeto existente.

### Parâmetros

| Campo       | Tipo     |
| ----------- | -------- |
| projectId   | ID       |
| title       | String   |
| description | String   |
| category    | String   |
| link        | String   |
| images      | [String] |

### Exemplo

```graphql
mutation {
  updateProject(
    projectId: "PROJECT_ID"
    title: "Novo título"
  ) {
    id
    title
    description
    category
    link
    images
    createdAt
    likesCount
    commentsCount
  }
}
```

---

# deleteProject

Remove um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

### Exemplo

```graphql
mutation {
  deleteProject(projectId: "PROJECT_ID")
}
```

---

# createComment

Adiciona um comentário em um projeto.

### Parâmetros

| Campo     | Tipo   |
| --------- | ------ |
| projectId | ID     |
| text      | String |

### Exemplo

```graphql
mutation {
  createComment(
    projectId: "PROJECT_ID"
    text: "Muito bom!"
  ) {
    id
    text
    createdAt
  }
}
```

---

# updateComment

Edita um comentário existente.

### Parâmetros

| Campo     | Tipo   |
| --------- | ------ |
| commentId | ID     |
| text      | String |

### Exemplo

```graphql
mutation {
  updateComment(
    commentId: "COMMENT_ID"
    text: "Comentário atualizado"
  ) {
    id
    text
    createdAt
  }
}
```

---

# deleteComment

Remove um comentário.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| commentId | ID   |

### Exemplo

```graphql
mutation {
  deleteComment(commentId: "COMMENT_ID")
}
```

---

# likeProject

Adiciona uma curtida a um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

### Exemplo

```graphql
mutation {
  likeProject(projectId: "PROJECT_ID") {
    id
  }
}
```

---

# unlikeProject

Remove a curtida de um projeto.

### Parâmetros

| Campo     | Tipo |
| --------- | ---- |
| projectId | ID   |

### Exemplo

```graphql
mutation {
  unlikeProject(projectId: "PROJECT_ID")
}
```