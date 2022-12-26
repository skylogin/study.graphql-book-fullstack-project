# study.graphql-book-fullstack-project

GraphQL과 타입스크립트로 개발하는 웹서비스 (https://github.com/hwasurr/graphql-book-fullstack-project)

- gitignore > https://www.toptal.com/developers/gitignore

- apollo server
- express (node.js)
- react
- apollo client
- mysql
- redis

## project init (root 폴더)

- `yarn init -y -p`
- `mkdir project`

### front-end (project 폴더 > web)

- `npx create-react-app --template @chakra-ui/typescript web`

### back-end (project 폴더 > server)

- `mkdir server`
- `yarn init -y -p`
- `yarn add express apollo-server-express graphql reflect-metadata typescript appolo-server-core`
- `yarn add ts-node`
- `yarn add --dev nodemon`

### common (root 폴더)

- `yarn add eslint prettier`
- `yarn add eslint-config-airbnb`
- `yarn add @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript`
- `yarn add eslint-config-prettier eslint-plugin-prettier`
- `yarn add eslint-plugin-import`
- `yarn add eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y`

## dev 01 (project 폴더 > server)

- `yarn add type-graphql`

## dev 01 (project 폴더 > web)

- `yarn add @apollo/client graphql`
- `yarn add --dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo @graphql-codegen/add`
- `yarn add react-waypoint`

## dev 02 (project 폴더 > web)

- `yarn add react-router-dom@5.2`
- `yarn add --dev @types/react-router-dom@5.1.7`
- `yarn add react-lazyload`
- `yarn add --dev @types/react-lazyload`

## dev 03 (project 폴더 > server)

- `yarn add typeorm mysql2`
- `yarn add class-validator argon2`
- `yarn add nanoid jsonwebtoken`
- `yarn add --dev @types/nanoid @types/jsonwebtoken`
- `yarn add ioredis`
- `yarn add --dev @types/ioredis`
- `yarn add cookie-parser`
- `yarn add --dev @types/cookie-parser`

## dev 04 (project 폴더 > web)

- `yarn add react-hook-from`

## dev 05 (project 폴더 > server)

- `yarn add dataloader`

## dev 06 (project 폴더 > server)

- `yarn add graphql-upload`
- `yarn add --dev @types/graphql-upload`

## dev 06 (project 폴더 > web)

- `yarn add apollo-upload-client`
- `yarn add --dev @types/apollo-upload-client`
