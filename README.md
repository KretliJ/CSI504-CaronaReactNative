## Nome do Discente
Jonas Elias Kretli

## Especificação do trabalho

O objetivo deste documento é definir os requisitos funcionais e não funcionais para o
desenvolvimento de um aplicativo móvel de caronas no Icea/Ufop. O aplicativo visa
conectar motoristas e passageiros que compartilham rotas semelhantes e horários
compatíveis, oferecendo uma alternativa econômica, sustentável e segura de transporte.

## Escopo
  * O aplicativo permitirá que usuários:
    - Se cadastrem como motorista, passageiro ou ambos, fornecendo um email
institucional válido.
    - Publiquem e busquem caronas.
    - Negociem e confirmem viagens.
    - Avaliem e sejam avaliados após cada corrida.

O sistema estará disponível para Android. Interface responsiva e compatível com
diferentes tamanhos de tela. O app deve ser desenvolvido com React Native e banco de
dados Firebase.

## Perfis de Usuários
* Motorista – oferece caronas, define horários, preços e regras.
* Passageiro – procura caronas e realiza reservas.
* Administrador – gerencia denúncias, perfis e transações.

## Problemas e recursos faltantes
* O sistema conta com uma página de placeholder na função "Esqueci minha senha", indicando que a recuperação de conta é uma funcionalidade futura.
  - O sistema utiliza o firebase como backend e para operações CRUD, mas houve a escolha de não usar o firebase auth porque foi necessário que cada usuário fosse registrado com funções customizadas (Motorista, Passageiro, Ambos, Administrador), logo a implementação deste sistema requer API de email e verificação de email válido, sendo módulos considerados fora do escopo para a versão atual do protótipo. Por essa razão, a tela "Esqueci minha senha" permanece como um placeholder.
* A página de chat individual da carona ainda não conta com o nome ou email do usuário sobre os balões de fala.
* A página de chat individual permite uma conversa apenas entre o motorista e o primeiro passageiro que se registrou na carona.

## Guia de instalação

* 1: Pré requisitos
  - Conta expo;
  - EAS CLI
   ```bash
   npm install -g eas-cli
   ```
* 2: Repositótio
   ```bash
   git clone <link-do-repositorio>
   ```
   ```bash
   cd ./carona-native/
   ```
* 3: Instalar bibliotecas
   ```bash
   npm install
   ```
   ```bash
   npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/drawer react-native-gesture-handler react-native-reanimated @react-native-async-storage/async-storage firebase crypto-js expo-image-picker react-native-gifted-chat react-native-keyboard-controller
   ```
* 4: Criar dev build
  - Faça login no Expo e EAS
   ```bash
   npx expo login
   ```
   ```bash
   eas login
   ```
   - Crie a build
   ```bash
   eas build --profile development --platform android
   ```
  - Aguarde o processo terminar. A EAS fornecerá um link ou QR code para instalar o app no seu celular ou emulador.
  
* 5: Executar
  ```bash
  npx expo start --dev-client
  ```
