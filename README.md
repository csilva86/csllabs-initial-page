# CSLLABS

Site oficial da marca CSLLABS, publicado com GitHub Pages em **csllabs.com**.

O site é uma estação de trem futurista em 2D: o visitante vê o trem chegando à plataforma, embarca, e dentro do vagão usa o mapa da linha para viajar entre as estações (Home, About Us, Developments, Videos e Contact). Cada estação é uma seção do site. Não há dependências nem etapa de build: são apenas arquivos estáticos.

Versão atual: **2.0.0** (veja o [CHANGELOG](CHANGELOG.md)).

## Estrutura

```
index.html                 estrutura da página e os TEXTOS de cada estação
css/style.css              visual: cores, tamanhos, animações
js/app.js                  comportamento: trem, mapa, viagem, som
img/logo.png               logo exibido no site
img/favicon-64.png         ícone da aba do navegador
img/apple-touch-icon.png   ícone para a tela inicial do celular
CNAME                      domínio personalizado (mantido pelo GitHub Pages)
docs/                      documentação (domínio/DNS e como publicar)
```

## O que editar para...

- **Mudar o texto de uma estação:** `index.html`, procure o comentário `STATION 0X` e edite o bloco `<article class="card">`.
- **Trocar o e-mail de contato:** `js/app.js`, linha `var CONTACT_EMAIL`.
- **Trocar o logo:** substitua `img/logo.png` por outro arquivo com o mesmo nome.
- **Mudar nome ou cor de uma estação no mapa:** `js/app.js`, lista `STATIONS`.
- **Mudar cores gerais e tamanhos:** `css/style.css`, bloco `:root` no topo.

Depois de alterar `css/style.css` ou `js/app.js`, aumente o número em `?v=1` no `index.html` (`?v=2`, `?v=3`...) para que os visitantes recebam a versão nova em vez da guardada no cache do navegador.

## Testar no computador

Dê dois cliques no `index.html`. As fontes do Google só carregam com internet.

## Publicar uma nova versão

Veja [docs/PUBLICAR.md](docs/PUBLICAR.md). Resumo: cada versão publicada recebe uma tag (`v1.0.0`, `v2.0.0`...), de modo que qualquer versão anterior pode ser recuperada.

## Domínio e DNS

Veja [docs/DOMINIO-E-DNS.md](docs/DOMINIO-E-DNS.md).

## Recursos do site

- Animações em CSS e canvas, sem bibliotecas externas (apenas as fontes Orbitron e Rajdhani, do Google Fonts).
- Som opcional (gerado por código, começa desligado).
- Botão "Skip intro", navegação por teclado (setas) e links diretos por estação (`/#about-us`, `/#contact`...).
- Respeita a opção de animações reduzidas do sistema operacional.
- Layout adaptado para celular em pé.
