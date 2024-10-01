document.addEventListener('DOMContentLoaded', () => {
    const formularioRegistro = document.getElementById('formulario-registro');
    const formularioLogin = document.getElementById('formulario-login');

    if (formularioRegistro) {
        formularioRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const tipo = document.getElementById('tipo').value;
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const endereco = document.getElementById('endereco').value;
            const senha = document.getElementById('senha').value;
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            usuarios.push({ tipo, nome, email, endereco, senha });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert('Registrado com sucesso!');
            window.location.href = 'index.html';
        });
    }

    if (formularioLogin) {
        formularioLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-login').value;
            const senha = document.getElementById('senha-login').value;
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            const usuario = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);
            if (usuario) {
                localStorage.setItem('usuarioAtual', JSON.stringify(usuario));
                alert('Login bem-sucedido!');
                window.location.href = 'dashboard.html';
            } else {
                alert('Email ou senha incorretos.');
            }
        });
    }

    const usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual'));
    if (usuarioAtual && window.location.pathname.includes('dashboard.html')) {
        const acoesUsuario = document.getElementById('acoes-usuario');
        const listaDoacoes = document.getElementById('lista-doacoes');

        if (usuarioAtual.tipo === 'doador') {
            acoesUsuario.innerHTML = `
                <h2>Publicar uma Doação</h2>
                <form id="formulario-doacao">
                    <label for="item">Item:</label>
                    <input type="text" id="item" required>
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" required>
                    <button type="submit">Publicar</button>
                </form>
            `;

            document.getElementById('formulario-doacao').addEventListener('submit', (e) => {
                e.preventDefault();
                const item = document.getElementById('item').value;
                const quantidade = document.getElementById('quantidade').value;
                const doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];

                doacoes.push({ doador: usuarioAtual.nome, item, quantidade: parseInt(quantidade) });
                localStorage.setItem('doacoes', JSON.stringify(doacoes));

                alert('Doação publicada com sucesso!');
                renderizarDoacoes();
            });
        } else if (usuarioAtual.tipo === 'instituicao') {
            acoesUsuario.innerHTML = `
                <h2>Buscar Doações</h2>
                <input type="text" id="busca" placeholder="Buscar doações...">
                <button id="botao-busca">Buscar</button>
            `;

            document.getElementById('botao-busca').addEventListener('click', () => {
                renderizarDoacoes(document.getElementById('busca').value);
            });
        }

        function renderizarDoacoes(query = '') {
            const doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];
            const doacoesFiltradas = doacoes.filter(doacao =>
                doacao.item.toLowerCase().includes(query.toLowerCase())
            );

            listaDoacoes.innerHTML = `
                <h2>Doações Disponíveis</h2>
                <ul>
                    ${doacoesFiltradas.map((doacao, index) => `
                        <li>
                            <strong>${doacao.item}</strong> - ${doacao.quantidade} unidades
                            <button onclick="solicitarDoacao(${index})">Solicitar</button>
                        </li>
                    `).join('')}
                </ul>
            `;
        }

        renderizarDoacoes();
    }
});

function solicitarDoacao(index) {
    const doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];
    const doacao = doacoes[index];
    if (doacao.quantidade > 0) {
        doacao.quantidade -= 1;
        if (doacao.quantidade === 0) {
            doacoes.splice(index, 1);
        }
        localStorage.setItem('doacoes', JSON.stringify(doacoes));
        alert(`Doação de ${doacao.item} solicitada! Quantidade restante: ${doacao.quantidade}`);
    } else {
        alert(`Doação de ${doacao.item} não disponível.`);
    }
    window.location.reload();
}
