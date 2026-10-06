# Histórico de versões

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versões numeradas como `MAIOR.MENOR.CORREÇÃO`.

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
