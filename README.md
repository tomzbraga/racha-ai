# RachaAí 💸

Aplicativo mobile para dividir contas de forma justa. Crie um racha, adicione os participantes e os itens consumidos, e o app calcula quanto cada pessoa deve pagar, com gorjeta opcional.

Projeto final da disciplina de React Native (ADS).

## Funcionalidades

- Criar, listar e editar rachas (nome, data e participantes)
- Adicionar itens com valor e definir quem consumiu cada um
- Divisão por item: cada pessoa paga apenas pelo que consumiu
- Resumo final com o total por pessoa e gorjeta opcional
- Dados salvos no Firebase Firestore
- Feedback tátil (Haptics) e seletor de data nativo

## Tecnologias

- React Native + Expo
- Expo Router (Bottom Tabs + Native Stack)
- Zustand (estado global)
- Firebase Firestore
- `expo-haptics`, `@react-native-community/datetimepicker`, `@expo/vector-icons`
- JavaScript

## Estrutura do projeto

```
app/
  index.js              # redireciona para /rachas
  (tabs)/
    rachas/             # lista, novo racha, detalhe [id] e resumo
src/
  components/           # Button, Input, Card, Loading, EmptyState
  services/             # firebaseConnection.js, rachaService.js
  store/                # useRachaStore.js (Zustand)
  utils/                # funções de cálculo
  theme/                # cores, espaçamentos e tipografia
```

## Como rodar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- App **Expo Go** no celular, ou um emulador Android/iOS

### Instalação

```bash
git clone <URL_DO_REPOSITORIO>
cd rachaai
npm install
```

### Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com) e crie um projeto.
2. Em **Configurações do projeto → Seus apps**, registre um app **Web** e copie as credenciais.
3. Em **Build → Firestore Database**, clique em **Criar banco de dados** (modo de teste para desenvolvimento).
4. Na raiz do projeto, crie um arquivo `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

5. A conexão é inicializada em `src/services/firebaseConnection.js`, que lê essas variáveis.

> ⚠️ Não faça commit do `.env`. Ele já deve estar no `.gitignore`.

### Executando

```bash
npx expo start
```

Escaneie o QR code com o Expo Go ou pressione `a` (Android) / `i` (iOS) para abrir no emulador.

## Fluxo de trabalho (Git Flow)

- `main`: versão estável
- `develop`: integração
- `feature/*`: novas funcionalidades, integradas via Pull Request

## Equipe

- <Nome 1>
- <Nome 2>
- <Nome 3>

## Demonstração

🎥 <link_do_video_de_demonstracao>
