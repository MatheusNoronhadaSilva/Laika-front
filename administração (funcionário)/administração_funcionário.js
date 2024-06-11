'use strict'

const nomeFuncionarioAtual = new URLSearchParams(window.location.search).get('nome')

document.getElementById('nomeFuncionario').textContent = `${nomeAdminAtual} - funcionario`
