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
    - Negociem e confirmem viagens. (TODO)
    - Avaliem e sejam avaliados após cada corrida. (TODO)

O sistema estará disponível para Android. Interface responsiva e compatível com
diferentes tamanhos de tela. O app deve ser desenvolvido com React Native e banco de
dados Firebase.

## Perfis de Usuários
* Motorista – oferece caronas, define horários, preços e regras.
* Passageiro – procura caronas e realiza reservas.
* Administrador – gerencia denúncias, perfis e transações.

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
   cd ./carona-native/
   ```
 * 3: Instalar bibliotecas
   ```bash
   npm install
   
   npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/drawer react-native-gesture-handler react-native-reanimated @react-native-async-storage/async-storage firebase crypto-js expo-image-picker react-native-gifted-chat react-native-keyboard-controller
   ```
 * 4: Criar dev build
   - Faça login no Expo e EAS
   ```bash
   npx expo login
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
