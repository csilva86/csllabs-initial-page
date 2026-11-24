# Histórico de versões

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versões numeradas como `MAIOR.MENOR.CORREÇÃO`.

## [2.9.0] — 24/11/2026

Novo projeto no portfólio: **Org Assessment** (Salesforce × Claude Code).

### Adicionado
- **Org Assessment** em `salesforce.html`, como Project 01: o que faz, os guardrails aplicados por código, o que há por trás e o link para `csilva86/org-assessment` no GitHub.

### Alterado
- **DigiLibrary** passa a ser o Project 02, e sobra uma porta lacrada (Project 03).
- **Home:** o projeto em destaque passa a ser o Org Assessment.
- **Developments:** o cartão do Claude Code cita o Org Assessment e ganha as etiquetas Subagents e Hooks.
- Descrição (`meta description`) do `salesforce.html` inclui o Org Assessment.

### Técnico
- Nenhuma mudança em CSS ou JS: os números `?v=` continuam os mesmos.

## [2.8.0] — 22/11/2026

Fase 2 do diagnóstico de UX: viagens mais rápidas, sem perder a experiência do trem.

### Alterado
- **Intro mais curta:** o trem chega em 4,5 s (antes 7 s) e o botão "Board the train" aparece em cerca de 6,5 s (antes cerca de 11 s).
- **Quem já visitou o site** vê o botão "Board the train" logo no início, enquanto o trem ainda está chegando.
- **Viagem expressa:** a primeira viagem continua completa (aviso de portas, sino, viagem lenta). Da segunda em diante, e em todas as viagens de quem volta ao site, as portas abrem e fecham rápido e a viagem dura cerca de 1 s. Uma troca de estação passou de 8–11 s para cerca de 2 s.
- **Título de fundo:** o nome grande da estação (ex.: "CONTACT") esmaece quando o cartão abre, para não competir com o texto.

### Adicionado
- **Pular a viagem:** clicar no vagão ou apertar Enter, Espaço ou Esc durante a viagem leva direto à chegada.
- **Mudar de ideia no meio do caminho:** clicar em outra estação (ou usar as setas) durante a viagem pula para a chegada e segue direto para a nova estação.
- **Links por endereço com a página aberta:** trocar o endereço para `#contact`, `#developments` etc. agora move o trem (antes só funcionava ao abrir o link do zero).

### Técnico
- `wait()` agora pode ser interrompida por `rush()`; `request(i)` enfileira a próxima estação durante uma viagem.
- O site lembra que o visitante já passou por aqui com `localStorage` (`csllabs-visited`); se o navegador bloquear, tudo funciona como na primeira visita.
- Classes `#cabin.fast` (portas rápidas) e `#cabin.instant` (portas instantâneas) e `#app.reading` (título de fundo esmaecido) em `style.css`.
- `?v=` do `style.css`/`app.js` aumentado para 9.

## [2.7.0] — 22/11/2026

Fase 1 do diagnóstico de UX: o site passa a falar com recrutadores e o conteúdo real aparece logo na entrada. O visual e a viagem de trem não mudaram.

### Alterado
- **Home:** apresenta Carlos Silva como desenvolvedor Salesforce certificado (Platform Developer I, Data Cloud Specialist), destaca o projeto **DigiLibrary** e ganha dois botões: "See the projects" (abre `salesforce.html`) e "Open a channel" (viaja até Contact). O logo grande saiu do cartão (já aparece no topo).
- **About Us → About:** título no singular ("The mind behind the signal.") e nova linha **Code** com link para o GitHub.
- **Developments:** texto de abertura reescrito; a chamada do cartão Salesforce virou "See the projects"; textos de Claude Code (conta que o site foi feito assim) e Solidity mais concretos.
- **Contact:** texto convidando recrutadores e segundo canal (GitHub).
- **Intro e título da aba:** saem do "soon a new dimension will be revealed" e passam a dizer o que é o site.
- **Sem JavaScript:** a página mostra quem é, o link dos projetos, o e-mail e o GitHub, em vez de só pedir para ativar o JS.
- `?v=` do `style.css`/`app.js` aumentado para 8.

### Removido (temporariamente)
- Estação **Videos** saiu da linha até existir o primeiro vídeo. O bloco continua comentado no `index.html` e em `js/app.js`, com instruções para voltar. A linha agora tem 4 estações e o mapa se ajusta sozinho à quantidade.

### Corrigido
- Os cartões das estações mostravam barras de rolagem do navegador mesmo sem precisar (1 px de sobra nos cantos decorativos). Agora a rolagem só aparece quando o conteúdo é maior que o cartão.

### Técnico
- `posOf` calcula a posição das estações a partir do total de estações.
- Botões com `data-go="<id da estação>"` dentro dos cartões viajam até aquela estação.

## [2.6.0] — 29/10/2026

Conteúdo das estações baseado no currículo do fundador (sem telefone, e-mail pessoal ou lista de empregadores).

### Alterado
- **Home:** texto de apresentação ("a Salesforce and AI engineering lab led by Carlos Silva").
- **About Us:** os "Loading…" foram trocados por conteúdo real: quem fundou a CSLLABS e a trajetória (consultoria técnica desde 2008, Salesforce desde 2020, desenvolvedor desde 2022), linhas Founder / Focus / Base e os blocos **Mission** e **Vision**. A barra de carregamento foi removida.
- **Developments:** o cartão Salesforce ganhou Flows e Data Cloud (e Sales/Service/Data Cloud no texto); nova seção **Certifications** (Platform Developer I 2026, Data Cloud Specialist 2025, AI Specialist 2024, AI Associate 2024, B2C Commerce Developer 2023) e nova seção **Skills**.
- `meta description` e `og:description` atualizados. `?v=` do `style.css`/`app.js` aumentado para 7.

## [2.5.0] — 24/10/2026

### Alterado
- Página **Salesforce Projects**: a porta do **DigiLibrary** agora tem a descrição real do projeto (em inglês): um app Salesforce para gerenciar uma biblioteca digital corporativa, criado para um desafio de desenvolvedor Apex, com integração à API pública Open Library.
- A tela da porta ganhou duas listas: **What it does** (busca por título/autor no catálogo e na Open Library, importação com um clique, empréstimo com bloqueio quando não há cópias, listas ao vivo na Home, devolução apagando o empréstimo) e **Under the hood** (contagem de cópias correta em lote, limite de empréstimos validado no servidor, busca que continua funcionando se a Open Library estiver fora do ar).
- Etiquetas do projeto: Salesforce, **Apex**, Salesforce DX e **Open Library API** (antes: só Salesforce e Salesforce DX).
- A porta do projeto ficou mais larga (até 560 px) para comportar o texto, e as portas lacradas acompanham a mesma altura.
- Descrição da página (`meta description`) atualizada. `concourse.css` agora em `?v=2`.

## [2.4.0] — 24/10/2026

### Adicionado
- Nova página **`salesforce.html` ("Salesforce Projects")**: um corredor de estação de trem (teto com luminárias, parede com colunas, piso em perspectiva) em que cada projeto é uma porta com sua tela de informações: nome, descrição, repositório, tecnologias e botão "View on GitHub" (abre em nova aba).
- Primeiro projeto: **DigiLibrary** → https://github.com/csilva86/DigiLibrary/ (descrição provisória; o repositório ainda não tem descrição pública).
- Duas portas lacradas ("Project 02/03") indicam projetos futuros.
- Botão "Back to the train" que volta direto para a estação Developments.

### Alterado
- Na estação Developments, o cartão **Salesforce** virou um link para a nova página (com a chamada "Enter the concourse" e efeito ao passar o mouse). O texto da estação agora diz "Open Salesforce to explore its projects."
- `?v=` do `style.css`/`app.js` aumentado para 6.

## [2.3.0] — 15/10/2026

Revisão de interface (acessibilidade, legibilidade e acabamento), baseada nas diretrizes "Web Interface Guidelines" e nas boas práticas de polimento de interface. O visual não mudou.

### Adicionado
- Imagem de pré-visualização `img/og-image.png` (1200×630) e metadados `og:image`, `og:url`, `twitter:card` e `canonical`: ao compartilhar o link (WhatsApp, LinkedIn, etc.) aparece uma prévia com o logo.
- `color-scheme: dark` (CSS e meta), `overscroll-behavior` e `touch-action: manipulation` (sem atraso de toque e sem "bounce" da página).
- Feedback de clique: botões encolhem levemente ao serem pressionados.

### Alterado
- Estações do mapa: área de toque ampliada (antes 16×16 px; agora cerca de 44 px) e o **nome da estação** passou a ser clicável também.
- Legibilidade: textos de 7–9 px passaram para 9–11 px no mínimo; rodapé e rótulo do painel com mais contraste.
- Títulos com `text-wrap: balance` e parágrafos com `text-wrap: pretty` (sem palavras soltas na última linha); suavização de fonte (macOS).
- O painel LED do topo deixou de ser anunciado por leitores de tela (a informação já é anunciada pela região "aria-live"), evitando repetição.
- `?v=` dos arquivos aumentado para 5.

## [2.2.1] — 15/10/2026

### Corrigido
- Estação **Developments**: os rótulos "Technology 0X · In use" dos cartões agora ficam alinhados no topo (antes, o texto era centralizado na vertical e os cartões com menos texto ficavam com o rótulo mais abaixo). `?v=` aumentado para 4.

## [2.2.0] — 15/10/2026

### Adicionado
- Estação **Developments**: três novas tecnologias — **Claude Code**, **Solidity** e **AWS** — cada uma com ícone neon e cor própria (laranja-coral, roxo e âmbar).
- O ícone do Claude Code é um desenho próprio de terminal (o Devicon não tem ícone dele). Os de Solidity e AWS vêm do Devicon.

### Alterado
- Os cartões de tecnologia agora formam uma grade de 2×2 no computador (1 coluna no celular) e todos têm o mesmo estilo; a cor de cada um é definida por `--t` no próprio bloco.
- Os dois espaços reservados "Technology 02/03" foram substituídos pelas tecnologias reais.
- `?v=` dos arquivos aumentado para 3.
- README: créditos e instruções de como adicionar uma tecnologia atualizados.

## [2.1.0] — 15/10/2026

### Adicionado
- Estação **Developments**: cartão da primeira tecnologia, **Salesforce** (Apex, Lightning Web Components, SOQL e integrações), com o ícone do Devicon estilizado em neon (contorno brilhante e leve cintilação; sem animação para quem prefere movimento reduzido).
- Estrutura de "cartões de tecnologia" pronta para receber as próximas (dois espaços reservados "Technology 02" e "Technology 03").
- Seção "Créditos" no README (Devicon, licença MIT, e aviso sobre a marca Salesforce).

### Alterado
- Os três cartões censurados "Project 01–03" foram substituídos pelos cartões de tecnologia. O texto da estação agora diz: "The technologies we build with. Project details stay classified until launch."
- Números de versão dos arquivos em `index.html` aumentados para `?v=2` (força os navegadores a carregarem o CSS novo).

## [2.0.0] — 06/10/2026

Redesenho completo da home: a página única de teaser virou uma estação de trem interativa.

### Adicionado
- Plataforma de entrada com o trem chegando, portas abrindo e botão "Board the train".
- Animação de embarque (zoom até a porta) e interior do vagão.
- Mapa da linha com cinco estações: Home, About Us, Developments, Videos e Contact. Ao clicar, o trem viaja (paisagem em movimento, plataforma da estação chegando) e as portas abrem mostrando o conteúdo.
- Conteúdo provisório ("em breve") em cada estação, em inglês.
- Som opcional gerado por código (desligado por padrão), botão "Skip intro", navegação por setas do teclado e links diretos por estação.
- Layout para celular em pé e suporte a "reduzir movimento".
- Favicon e ícone para tela inicial do celular (a partir do ícone da marca).
- E-mail de contato: carlos.silva@csllabs.com.
- Documentação: README, este CHANGELOG, `docs/DOMINIO-E-DNS.md` e `docs/PUBLICAR.md`.

### Alterado
- O código passou de um único arquivo para `index.html`, `css/style.css` e `js/app.js`, com imagens em `img/`. Isso facilita a manutenção.
- O logo deixou de ser embutido no código e passou a ser o arquivo `img/logo.png`.

### Preservado
- A versão anterior (teaser em arquivo único) continua disponível pela tag `v1.0.0` do repositório.

## [1.0.1] — 03/10/2026

### Corrigido
- Domínio `csllabs.com` (sem www) exibia erro de conexão segura. Os registros DNS foram corrigidos (remoção de registros A extras do redirecionamento da GoDaddy) e o HTTPS passou a funcionar em `csllabs.com` e `www.csllabs.com`. Detalhes em `docs/DOMINIO-E-DNS.md`.

## [1.0.0] — 03/10/2026

Primeira versão publicada: página de teaser em arquivo único.

### Adicionado
- Cidade futurista animada em loop, com naves cruzando o céu, em paleta cyberpunk (roxo e ciano sobre preto).
- Logo da CSLLABS no topo e a frase "Come and see: soon a new dimension will be revealed." surgindo com efeito de revelação.
