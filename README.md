# Rocketseat - NWL Copa 2022

Projeto de bolão para Copa do mundo. Com backend e aplicações web e mobile

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

```
yarn add fastify
```

Compilação do código tpescript para javascript

```
yarn add -D tsx
```

Adiciona a seguinte linha nos script do package.json  
`"dev": "tsx src/server.ts",`
