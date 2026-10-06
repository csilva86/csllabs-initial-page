# Como publicar uma nova versão

Cada versão publicada ganha uma **tag** (`v1.0.0`, `v2.0.0`, `v2.1.0`...). A tag é um marcador permanente no histórico: com ela é possível ver, baixar ou restaurar exatamente como o site estava naquela versão.

Números das versões: `MAIOR.MENOR.CORREÇÃO`
- MAIOR: mudança grande de conceito ou de estrutura (ex.: teaser → estação de trem).
- MENOR: conteúdo ou recurso novo (ex.: preencher uma estação).
- CORREÇÃO: ajuste pequeno ou bug.

Toda publicação deve atualizar o `CHANGELOG.md`.

## Passo a passo pelo site do GitHub (sem terminal)

1. **Marcar a versão atual antes de mexer.** Na página do repositório, clique em *Releases* → *Create a new release*. Em *Choose a tag*, digite a tag da versão que está no ar (ex.: `v1.0.0`), alvo `main`, dê um título (ex.: "Teaser em arquivo único") e clique em *Publish release*.
2. **Subir as mudanças numa branch.** Clique em *Add file* → *Upload files*, arraste o conteúdo da pasta nova (index.html, css, js, img, README.md, CHANGELOG.md, docs). Em *Commit changes*, escreva a mensagem, escolha *Create a new branch* (ex.: `v2-estacao-de-trem`) e confirme. **Não apague o arquivo `CNAME`.**
3. **Abrir e aceitar o Pull Request.** O GitHub oferece *Compare & pull request*. Descreva o que mudou (pode colar o trecho do CHANGELOG) e clique em *Merge pull request*. O site é atualizado em alguns minutos.
4. **Marcar a nova versão.** Repita o passo 1 com a nova tag (ex.: `v2.0.0`).

## Passo a passo pelo terminal (Git)

```bash
git clone https://github.com/csilva86/NOME-DO-REPOSITORIO.git
cd NOME-DO-REPOSITORIO

# 1. marcar a versão atual (preserva o estado anterior)
git tag -a v1.0.0 -m "Teaser em arquivo único"
git push origin v1.0.0

# 2. trabalhar numa branch
git checkout -b v2-estacao-de-trem
# copie os arquivos novos por cima (mantenha o CNAME)
git add -A
git commit -m "feat: nova home em estação de trem 2D, código separado em HTML/CSS/JS"
git push -u origin v2-estacao-de-trem

# 3. no GitHub, abra o Pull Request e faça o merge; depois:
git checkout main && git pull
git tag -a v2.0.0 -m "Estação de trem 2D"
git push origin v2.0.0
```

## Voltar a uma versão anterior

Pelo terminal: `git checkout v1.0.0` mostra o site daquela versão. Para republicá-la, crie uma branch a partir da tag (`git checkout -b restaurar-v1 v1.0.0`) e abra um Pull Request.

Pelo GitHub: *Releases* → escolha a versão → baixe o código-fonte (zip) e suba os arquivos de volta.

## Depois de qualquer mudança em CSS ou JS

Aumente o `?v=` no `index.html` (`css/style.css?v=2`, `js/app.js?v=2`) para evitar que visitantes vejam a versão antiga guardada no navegador.
