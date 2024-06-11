'use strict'

        const url = 'https://laika-back.onrender.com'
        const versao = '/v1'

        const telaInfo1 = document.getElementById('telaInfo1')
        const criarConta2 = document.getElementById('criarConta2')
        const telaInfo2 = document.getElementById('telaInfo2')

        async function getInfo1() {

            const allFuncionarios = await getAllFuncionarios()
            console.log('iiii');

            const nome = document.getElementById('nome').value
            const sobrenome = document.getElementById('sobrenome').value
            const email = document.getElementById('email').value
            const senha = document.getElementById('senha').value
            const confirmarSenha = document.getElementById('confirmar_senha').value
            const telefone = document.getElementById('telefone').value

            const telefoneNumero = telefone

            console.log(nome);

            if (nome == '') {
                const errorNome = document.getElementById('errorNome')
                errorNome.classList.remove('hidden')

                setTimeout(function () {
                    errorNome.classList.add('hidden');
                }, 3000);
            } else if (email == '') {
                const errorEmail = document.getElementById('errorEmail')
                errorEmail.classList.remove('hidden')

                setTimeout(function () {
                    errorEmail.classList.add('hidden');
                }, 3000);
            } else if (senha == '') {
                const errorSenha = document.getElementById('errorSenha')
                errorSenha.classList.remove('hidden')

                setTimeout(function () {
                    errorSenha.classList.add('hidden');
                }, 3000);
            } else if (confirmarSenha == '' || confirmarSenha != senha) {

                console.log(confirmarSenha);
                console.log(senha);
                const errorConfirmarSenha = document.getElementById('errorConfirmarSenha')
                errorConfirmarSenha.classList.remove('hidden')

                setTimeout(function () {
                    errorConfirmarSenha.classList.add('hidden');
                }, 3000);
            } else if (telefoneNumero === '') {
                const errorTelefone = document.getElementById('errorTelefone')
                errorTelefone.classList.remove('hidden')

                setTimeout(function () {
                    errorTelefone.classList.add('hidden');
                }, 3000);
            } else {

                let errorRepetidoValidacao = false

                allFuncionarios.forEach(funcionario => {

                    if(email == funcionario.email){

                        errorRepetidoValidacao = true
                    }
                    
                });

                if(errorRepetidoValidacao == true){
                    const errorRepetido = document.getElementById('errorRepetido')
                    errorRepetido.classList.remove('hidden')

                    setTimeout(function () {
                        errorTelefone.classList.add('hidden');
                    }, 3000);
                } else {

                    const nomeCompleto = `${nome} ${sobrenome}`

                    console.log(nomeCompleto);
                    telaInfo1.classList.add('hidden')
                    telaInfo2.classList.remove('hidden')
                    criarConta2.classList.remove('hidden');
    
                    criarCargos()
    
                    criarConta2.addEventListener('click', async function () {
    
                        const rua = document.getElementById('rua').value
                        const cidade = document.getElementById('cidade').value
                        const estado = document.getElementById('estado').value
                        const bairro = document.getElementById('bairro').value
    
                        const cargos = cargosSelecionados()
    
                        console.log(cargos);
    
                        if (rua == '') {
                            const errorRua = document.getElementById('errorRua')
                            errorRua.classList.remove('hidden')
    
                            setTimeout(function () {
                                errorRua.classList.add('hidden');
                            }, 3000);
                        } else if (cidade == '') {
                            const errorCidade = document.getElementById('errorCidade')
                            errorCidade.classList.remove('hidden')
    
                            setTimeout(function () {
                                errorCidade.classList.add('hidden');
                            }, 3000);
                        } else if (estado == '') {
                            const errorEstado = document.getElementById('errorEstado')
                            errorEstado.classList.remove('hidden')
    
                            setTimeout(function () {
                                errorEstado.classList.add('hidden');
                            }, 3000);
                        } else if (bairro == '') {
    
                            const errorBairro = document.getElementById('errorBairro')
                            errorBairro.classList.remove('hidden')
    
                            setTimeout(function () {
                                errorBairro.classList.add('hidden');
                            }, 3000);
                        } else {
    
                            const novoFuncionarioJSON = {
                                nome: nomeCompleto,
                                telefone: telefone,
                                email: email,
                                senha: senha,
                                img: null,
                                endereco: {
                                    rua: rua,
                                    bairro: bairro,
                                    cidade: cidade,
                                    estado: estado,
                                    complemento: ""
                                },
                                cargos: cargos
                            }
    
                            console.log(novoFuncionarioJSON);
    
                            await postarNovoFuncionario(novoFuncionarioJSON)
    
                            window.location.href = "../CMS_ADM_funcionarios/CMS_ADM_funcionarios.html"
                        }
    
                    })
                }
            }
        }

        function cargosSelecionados() {
            let selectedOptions = [];
            const checkboxes = document.querySelectorAll('#checkButton input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const value = Number(checkbox.value)
                    selectedOptions.push(value);
                }
            });
            return selectedOptions;
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Adiciona o event listener a todas as checkboxes
            const checkboxes = document.querySelectorAll('#checkButton input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('click', handleCheckboxClick);
            });
        });

        function handleCheckboxClick(event) {
            console.log('oii');
            const selectedCheckbox = event.target;

            // Se a checkbox com valor 1 for selecionada
            if (selectedCheckbox.value == 1 && selectedCheckbox.checked) {
                alert('A checkbox de valor 1 foi selecionada. Todas as outras checkboxes serão desmarcadas e desativadas.');
                toggleCheckboxes(false, selectedCheckbox);
            } else if (selectedCheckbox.value == 1 && !selectedCheckbox.checked) {
                console.log('A checkbox de valor 1 foi desmarcada.');
                toggleCheckboxes(true);
            }
        }

        function toggleCheckboxes(enable, exceptCheckbox = null) {
            const checkboxes = document.querySelectorAll('#checkButton input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox !== exceptCheckbox) {
                    checkbox.disabled = !enable;
                    if (!enable) {
                        checkbox.checked = false;
                    }
                }
            });
        }

        async function postarNovoFuncionario(funcionario) {
            console.log('enviar');

            const endpoint = `${url}${versao}/laika/funcionario`

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(funcionario),
            };

            try {
                const response = await fetch(endpoint, options);
                return response.ok;
            } catch (error) {
                console.error('Erro ao enviar funcionario: ', error);
            }
        }

        async function criarCargos() {
            const cargos = await pegarCargos();

            console.log(cargos);

            for (let i = 0; i < cargos.length; i++) {
                console.log(cargos[i]);

                const div = document.createElement('div');
                div.classList.add('flex', 'items-center', 'space-x-2');

                const input = document.createElement('input');
                input.type = "checkbox";
                input.id = `option${i}`;

                console.log(input.id);
                input.value = cargos[i].id;

                const span = document.createElement('span');
                span.textContent = cargos[i].nome;

                div.replaceChildren(input, span);
                document.getElementById('checkButton').appendChild(div);

                // Adiciona o event listener a cada nova checkbox criada
                input.addEventListener('click', handleCheckboxClick);
            }
        }

        async function pegarCargos() {
            const endpoint = `${url}${versao}/laika/cargos`;

            console.log(endpoint);
            const categoryApi = await fetch(endpoint);
            const listCategory = await categoryApi.json();

            return listCategory.dados;
        }

        async function getAllFuncionarios() {

            console.log('pegando');
        
            const endpoint = `${url}${versao}/laika/funcionarios`;
            const funcionariosApi = await fetch(endpoint);
            const listFuncionarios = await funcionariosApi.json();
            return listFuncionarios.dados;
        } 