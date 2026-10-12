# Chat Offline — MultiChat

Aplicação de chat local criada com React, TypeScript e Vite. O projeto evoluiu de uma tela com uma única conversa para o **MultiChat**: uma interface que permite criar e organizar várias conversas independentes, alternar entre elas e continuar seus históricos no mesmo navegador.

> O MultiChat não é um serviço de mensagens entre pessoas nem usa um backend. “Usuário” e “Robô” são opções de autoria para as mensagens inseridas manualmente; não há respostas automáticas.

## O que é o MultiChat?

O MultiChat permite separar mensagens em conversas diferentes. Cada conversa recebe um ID único, que é exibido integralmente na lista lateral e no cabeçalho do chat. As mensagens são associadas à conversa selecionada, de modo que alternar entre conversas mostra o histórico correspondente sem misturar os conteúdos.

Em termos de dados, a aplicação mantém um conjunto de conversas indexado pelo ID. Cada conversa contém uma lista de mensagens, e cada mensagem tem um ID próprio, uma autoria (`user` ou `robot`) e seu conteúdo:

```text
conversas
├── ID da conversa A
│   ├── mensagem do Usuário
│   └── mensagem do Robô
└── ID da conversa B
    └── mensagem do Usuário
```

O gerenciamento desse estado é feito pela store Zustand em `src/stores/chatStore.ts`. Ela fornece operações para criar, selecionar e excluir conversas, além de adicionar e consultar mensagens. Os IDs são gerados com `crypto.randomUUID()`.

## Como usar

1. Clique em **Nova conversa** para criar uma conversa vazia. Ela será selecionada automaticamente.
2. Escreva uma mensagem e envie pelo botão **Enviar** ou pressione Enter. Use Shift + Enter para inserir uma quebra de linha.
3. Se quiser alterar a autoria, abra o seletor e escolha **Usuário** ou **Robô**.
4. Crie outras conversas para separar assuntos. Selecione um ID na barra lateral para consultar ou continuar aquela conversa.
5. Use o botão de exclusão ao lado de uma conversa para removê-la.

Ao excluir a conversa ativa, a aplicação deixa de ter uma conversa selecionada. Será necessário selecionar outra conversa ou criar uma nova antes de enviar mensagens.

## O que foi alterado

As mudanças dos commits mais recentes implementaram e integraram o fluxo de conversas múltiplas:

- **Estado e persistência:** foi adicionada a dependência Zustand e criada uma store para manter várias conversas e seus históricos. A persistência usa o `localStorage` do navegador.
- **Integração com o chat:** a tela principal passou a exibir as mensagens da conversa selecionada e enviar novas mensagens somente para ela. O compositor fica desabilitado quando nenhuma conversa está ativa.
- **Navegação entre conversas:** foi criada uma barra lateral com os IDs completos, indicação visual da conversa selecionada e ação para criar uma nova conversa.
- **Exclusão de conversas:** cada item da lista permite excluir sua conversa. Ao excluir a conversa ativa, o chat volta ao estado sem seleção.
- **Uso em telas pequenas:** em desktop, a barra lateral permanece visível; em celulares, ela pode ser aberta e fechada pelo botão de menu.
- **Validação e documentação:** os requisitos e as fases de implementação e validação foram registrados no [PRD de conversas múltiplas](.docs/features/mult-chat/prd.md).

## Persistência e limites

As conversas e mensagens ficam no `localStorage` do navegador atual. Ao recarregar ou reabrir a aplicação nesse navegador, os dados são restaurados, mas nenhuma conversa é selecionada automaticamente: escolha uma conversa na lista ou crie uma nova para começar.

Como os dados são locais, não há sincronização entre navegadores ou dispositivos, armazenamento em servidor, conta de usuário ou recuperação após limpar os dados do navegador.

## Recursos do chat

- Histórico separado para cada conversa, com rolagem e acompanhamento automático da última mensagem.
- Mensagens do Usuário alinhadas à direita e do Robô à esquerda, com autoria identificada.
- Quebras de linha preservadas no conteúdo das mensagens.
- Campo de texto multilinha com redimensionamento automático.
- Envio por Enter e quebra de linha por Shift + Enter.
- Envio desabilitado para conteúdo vazio ou composto somente por espaços.
- Seletor de autoria acessível; a opção Robô também recebe destaque visual no compositor.
- Estado vazio informativo quando não há conversa selecionada ou quando a conversa ainda não tem mensagens.

## Tecnologias

- React 19
- TypeScript
- Vite
- Zustand para estado e persistência
- Tailwind CSS
- Oxlint

## Estrutura principal

```text
src/
  App.tsx
  components/
    Chat.tsx           # compõe a tela, controla seleção e fluxo do chat
    ChatInput.tsx      # entrada e envio de mensagens
    MessageList.tsx    # histórico da conversa selecionada
    MessageBubble.tsx  # apresentação individual da mensagem
    SenderToggle.tsx   # seleção entre Usuário e Robô
    Sidebar.tsx        # lista e criação de conversas
    SidebarItem.tsx    # seleção e exclusão de uma conversa
  stores/
    chatStore.ts       # estado e persistência das conversas
    index.ts           # exportação da store
  types/
    message.ts         # tipos Author e ChatMessage
```

## Como executar

Pré-requisito: Node.js e npm instalados.

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra no navegador o endereço informado pelo Vite.

## Scripts

```bash
npm run dev      # inicia o servidor de desenvolvimento
npm run build    # verifica os tipos TypeScript e gera a versão de produção
npm run lint     # executa o Oxlint
npm run preview  # serve localmente a versão de produção
```
