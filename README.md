# Rocketseat - NWL Copa 2022

Projeto de bolão para Copa do mundo. Com backend e aplicações web e mobile

# Aula 01

## Passos

### Configuração

- Inicialização

  Inicia o projeto

```
npm init
```

Adiciona o Typescript

```
yarn add -D typescript

npx tsc --init
```

Mudar target no tsconfig.json criado  
`"target": "es2022"`

### Projeto

- Fastify

```
yarn add fastify
```

Compilação do código tpescript para javascript

```
yarn add -D tsx
```

Adiciona a seguinte linha nos script do package.json  
`"dev": "tsx src/server.ts",`

- Prisma

```
yarn add -D prisma

yarn add @prisma/client

npx prisma init --datasource-provider  SQLite
```

### Modelagem de dados

- Tabela Poll
  Após criar o model no schema.prisma executar a migração para criar os obejtos do banco de dados e fazer o versionamento do banco.

```
npx prisma migrate dev
```

- Geração de ERD automáticos

```
yarn add -D prisma-erd-generator @mermaid-js/mermaid-cli
```

Adicionar um novo generator no `schema.prisma` como abaixo

```
generator erd {
  provider = "prisma-erd-generator"
}
```

Gera o diagrama

```
npx prisma generate
```

> error:

    ```
    Error:
    ✔ Generated Prisma Client (4.5.0 | library) to ./node_modules/@prisma/client in 45ms

    Command failed: /home/ppaula/estudos/Rocketseat/NLWCopa2022/projeto/server/node_modules/.bin/mmdc -i /tmp/prisma-erd-w1Zklc/prisma.mmd -o /home/ppaula/estudos/Rocketseat/NLWCopa2022/projeto/server/prisma/ERD.svg -t forest -c /tmp/prisma-erd-w1Zklc/config.json
    ```

    Corrigido com a instalação do seguinte pacote


    ```
    sudo apt install libxkbcommon-x11-0
    ```

### População da base para testes

- criar o arquivo `seed.ts` com os objetos a serem criados na base

- Adicionar a seguinte linha no package.json`

```
"prisma": {
  "seed": "tsx prisma/seed.ts"
},
```

- execução da população com o seed

```
npx prisma db seed
```

## Outros pacotes

### Validação do esquema com o pacote `zod`

```
yarn add zod
```

## Criação de IDs com short-unique-id

```
yarn add short-unique-id
```

### Token JWT

[@fastify/jwt](https://github.com/fastify/fastify-jwt)

```
yarn add @fastify/jwt
```

### Environment variables from .env files

[dotenv](https://github.com/motdotla/dotenv)

```
yarn add dotenv
```

Uso:

    ```
    import * as dotenv from 'dotenv';
    dotenv.config();
    ```
