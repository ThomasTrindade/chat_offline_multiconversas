# PRD: Conversas múltiplas

## Visão geral

Transformar o chat atual, que mantém uma única conversa, em uma experiência com várias conversas independentes. A pessoa usuária poderá criar conversas, alternar entre elas e retomar seus históricos, que serão mantidos localmente no navegador.

## Problema

Atualmente, as mensagens ficam em um único estado da tela. Não há como separar assuntos em conversas diferentes ou voltar ao histórico de uma conversa depois de navegar para outra.

## Objetivos

- Permitir criar e alternar entre conversas independentes.
- Preservar as mensagens de cada conversa ao alternar entre elas.
- Restaurar conversas e histórico após recarregar ou reabrir o site no mesmo navegador.
- Disponibilizar a navegação por conversas em desktop e celular.

## Fora de escopo

- Sincronização entre dispositivos ou armazenamento em servidor.
- Renomear ou excluir conversas.
- Exibir um título derivado das mensagens; a identificação será o ID da conversa.

## Usuários e cenário principal

Uma pessoa abre o site, cria uma conversa, troca mensagens e cria outras conversas para separar assuntos. Mais tarde, pode selecionar uma conversa existente e continuar vendo seu histórico.

## Requisitos funcionais

### Conversas e estado

1. Ao iniciar o site, nenhuma conversa estará ativa e será exibido um estado vazio até que a pessoa selecione ou crie uma conversa. Isso também se aplica quando há conversas persistidas.
2. A aplicação usará uma store Zustand em `src/stores` para manter:
   - O histórico de cada conversa, composto por itens do tipo `ChatMessage` definido em `src/types/message.ts` (`id`, `author` e `content`).
   - O ID da conversa ativa, ou nenhum ID quando não houver conversa ativa.
3. Cada conversa terá um ID único, usado como sua identificação visível na lista. O ID será apresentado integralmente.
4. A lista exibirá as conversas existentes e indicará visualmente qual está ativa.
5. O botão de nova conversa criará uma conversa vazia e a tornará ativa imediatamente.
6. Selecionar uma conversa carregará seu próprio histórico sem alterar as mensagens das demais.
7. As conversas e mensagens serão persistidas localmente no navegador e restauradas quando o site for aberto novamente no mesmo navegador.
8. O composer e seus controles ficarão desabilitados quando não houver conversa ativa. Nessa condição, o composer terá 50% de opacidade e seus botões não executarão ações.
9. Com uma conversa ativa, o envio de mensagens continuará respeitando o comportamento atual do chat, mas adicionará a mensagem somente ao histórico dessa conversa.

### Layout e interação

1. Em telas desktop, o sidebar ficará à esquerda e permanecerá visível.
2. Em telas de celular, o sidebar poderá ser aberto e fechado por um botão hambúrguer no canto superior esquerdo.
3. No celular, selecionar uma conversa não fechará automaticamente o sidebar; ele permanecerá aberto até ser fechado pelo botão de controle.
4. A lista do sidebar exibirá o ID de cada conversa e incluirá o botão para criar uma nova conversa.

## Requisitos não funcionais

- A solução deve manter os tipos existentes de mensagem e evitar duplicar ou transformar o conteúdo do histórico ao alternar entre conversas.
- A persistência não deve exigir conta ou conexão com servidor.
- A interface deve continuar utilizável em telas pequenas e grandes.

## Plano de implementação por fases

As fases devem ser executadas na ordem apresentada. Cada fase depende da conclusão da anterior, exceto quando indicado que se trata apenas de validação do trabalho já integrado.

### Fase 1 — Estado e persistência (Concluída)

**Objetivo:** estabelecer o modelo de dados compartilhado e persistente das conversas.

**Atividades:**

- [x] Adicionar Zustand às dependências.
- [x] Criar a store em `src/stores`, usando o tipo `ChatMessage` existente.
- [x] Implementar operações para criar uma conversa com ID único, selecionar uma conversa e adicionar mensagens à conversa ativa.
- [x] Persistir a lista de conversas e seus históricos localmente no navegador.
- [x] Inicializar sem conversa ativa, mesmo quando existirem conversas restauradas da persistência.

**Condição de conclusão:** concluída — as operações da store mantêm históricos isolados por conversa, e a persistência restaura as conversas sem selecionar automaticamente uma delas.

### Fase 2 — Fluxo de conversas no chat

**Objetivo:** integrar a store ao fluxo principal da aplicação.

**Atividades:**

- Substituir o estado isolado de mensagens em `App` pelo estado da conversa ativa na store.
- Exibir o estado vazio quando nenhuma conversa estiver ativa.
- Conectar o envio do composer à conversa ativa, preservando os dados e o comportamento atual das mensagens.
- Impedir o envio e desabilitar o composer e seus controles quando não houver conversa ativa, aplicando 50% de opacidade.

**Condição de conclusão:** mensagens aparecem e são adicionadas somente ao histórico da conversa selecionada; sem conversa ativa, o composer não permite ações.

### Fase 3 — Sidebar e navegação responsiva

**Objetivo:** permitir criar e alternar conversas pela interface em telas grandes e pequenas.

**Atividades:**

- Criar o sidebar à esquerda com a lista de conversas identificadas por seus IDs completos.
- Indicar visualmente a conversa ativa e permitir selecioná-la.
- Adicionar o botão de nova conversa; ao acioná-lo, criar e selecionar uma conversa vazia.
- Manter o sidebar visível em telas desktop.
- Em telas de celular, adicionar o botão hambúrguer no canto superior esquerdo para abrir e fechar o sidebar.
- Manter o sidebar aberto ao selecionar uma conversa no celular; fechá-lo somente pelo botão de controle.

**Condição de conclusão:** a lista, criação e seleção funcionam nos layouts desktop e celular conforme os comportamentos especificados.

### Fase 4 — Validação integrada

**Objetivo:** verificar os critérios de aceite no fluxo completo.

**Atividades:**

- Validar criação de várias conversas e isolamento dos respectivos históricos.
- Validar seleção e alternância entre conversas, inclusive após recarregar ou reabrir o site.
- Validar a inicialização sem conversa ativa com e sem conversas persistidas.
- Validar o estado desabilitado do composer e o comportamento do sidebar em diferentes tamanhos de tela.
- Executar as verificações de lint e build disponíveis no projeto e corrigir regressões relacionadas à funcionalidade.

**Condição de conclusão:** todos os critérios de aceite abaixo são atendidos e as verificações aplicáveis terminam sem erros introduzidos pela funcionalidade.

## Critérios de aceite

1. Ao iniciar o site, inclusive quando já existem conversas persistidas, nenhum chat está ativo até que a pessoa selecione ou crie um; o composer fica desabilitado, com opacidade de 50%.
2. Criar uma conversa adiciona uma entrada com ID visível à lista, seleciona essa conversa e habilita o composer.
3. Enviar mensagens em uma conversa e depois selecionar outra mostra apenas as mensagens da conversa selecionada.
4. Retornar à primeira conversa restaura todas as suas mensagens e seus dados (`id`, `author` e `content`) sem alterações.
5. Recarregar ou reabrir o site no mesmo navegador restaura as conversas e respectivos históricos.
6. No desktop, o sidebar aparece à esquerda. No celular, o botão hambúrguer abre e fecha o sidebar.
7. No celular, selecionar uma conversa mantém o sidebar aberto; somente o botão de controle o fecha.
8. Sem conversa ativa, nenhuma ação dos controles do composer é executada.

## Dependências e observações técnicas

- Adicionar Zustand às dependências do projeto.
- Manter a store em `src/stores`.
- Reaproveitar o tipo `ChatMessage` existente em `src/types/message.ts`.
- Usar persistência local integrada à store Zustand.
