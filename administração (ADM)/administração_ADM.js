'use strict'

const nomeAdminAtual = new URLSearchParams(window.location.search).get('nome')

document.getElementById('nomeAdmin').textContent = `${nomeAdminAtual} - ADM`
