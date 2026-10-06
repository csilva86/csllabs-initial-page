# Domínio e DNS

O site é publicado pelo GitHub Pages e usa o domínio próprio **csllabs.com**, registrado na GoDaddy.

## Configuração correta

**No GitHub** (repositório → Settings → Pages):
- Custom domain: `csllabs.com` (domínio raiz, sem www). O GitHub mantém o arquivo `CNAME` do repositório com esse valor. **Não apague esse arquivo.**
- "Enforce HTTPS" ativado.

**No DNS da GoDaddy:**

| Tipo  | Nome  | Valor                  |
|-------|-------|------------------------|
| A     | @     | 185.199.108.153        |
| A     | @     | 185.199.109.153        |
| A     | @     | 185.199.110.153        |
| A     | @     | 185.199.111.153        |
| CNAME | www   | csilva86.github.io     |

O domínio raiz deve ter **somente** esses quatro registros A. Outros registros A para `@` fazem o GitHub marcar o domínio como mal configurado (`NotServedByPagesError`) e o HTTPS falhar.

## Problema já ocorrido (03/10/2026)

Sintoma: `www.csllabs.com` funcionava, mas `csllabs.com` mostrava "O site não pode fazer uma conexão segura" e o GitHub exibia "DNS check unsuccessful".

Causa: dois registros A extras (`15.197.225.128` e `3.33.251.168`) criados automaticamente pelo **redirecionamento de domínio (Forwarding)** da GoDaddy. Esses registros ficam bloqueados na tabela de DNS enquanto o redirecionamento existir.

Solução: na GoDaddy, abrir o domínio → DNS → **Forwarding** e excluir o redirecionamento. Os dois registros extras desaparecem sozinhos. Depois, no GitHub, clicar em "Check again" até o domínio ser validado (pode levar de minutos a algumas horas).

## Outros registros

Os registros `CNAME email`, `CNAME ftp` e os `NS` fazem parte da GoDaddy (e-mail e servidores de nomes) e não interferem no site.
