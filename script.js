    /* BRASAS ANIMADAS */
    (function () {
      const container = document.getElementById('fundo-velas');
      const cores = ['rgba(139,26,26,0.7)', 'rgba(180,80,20,0.6)', 'rgba(201,168,76,0.5)'];
      for (let i = 0; i < 50; i++) {
        const p = document.createElement('span');
        const cor = cores[Math.floor(Math.random() * cores.length)];
        const size = Math.random() * 3 + 1;
        p.style.cssText = `left:${Math.random()*100}%;width:${size}px;height:${size}px;background:${cor};animation-duration:${Math.random()*18+12}s;animation-delay:${Math.random()*18}s;opacity:0;`;
        container.appendChild(p);
      }
    })();

    /* ANO NO RODAPÉ */
    document.getElementById('anoAtual').textContent = new Date().getFullYear();

    /* VALIDAÇÃO DE EMAIL */
    const DOMINIOS_INVALIDOS = [
      /* Adicione aqui domínios descartáveis que deseja bloquear */
      'mailinator.com','guerrillamail.com','tempmail.com',
      'throwam.com','fakeinbox.com','yopmail.com','sharklasers.com',
    ];
    function validarEmail(email) {
      email = email.trim();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!regex.test(email)) return { valido: false, msg: 'Digite um endereço de email válido.' };
      const dominio = email.split('@')[1].toLowerCase();
      if (DOMINIOS_INVALIDOS.includes(dominio)) return { valido: false, msg: 'Por favor, use um email permanente.' };
      const partes = dominio.split('.');
      if (partes.length < 2 || partes[partes.length-1].length < 2) return { valido: false, msg: 'Domínio de email inválido.' };
      return { valido: true, msg: '' };
    }

    const inputEmail = document.getElementById('emailInput');
    const msgErro    = document.getElementById('msgErroEmail');

    inputEmail.addEventListener('blur', () => {
      if (inputEmail.value.trim() === '') return;
      const { valido, msg } = validarEmail(inputEmail.value);
      aplicarEstadoCampo(valido, msg);
    });
    inputEmail.addEventListener('input', () => {
      if (inputEmail.classList.contains('erro')) {
        inputEmail.classList.remove('erro');
        msgErro.classList.remove('visivel');
        msgErro.textContent = '';
      }
    });
    function aplicarEstadoCampo(valido, msg) {
      inputEmail.classList.toggle('erro',    !valido);
      inputEmail.classList.toggle('sucesso',  valido);
      msgErro.textContent = msg;
      msgErro.classList.toggle('visivel', !valido);
    }

    /* SUBMISSÃO */
    const form      = document.getElementById('formCadastro');
    const btnEnviar = document.getElementById('btnCadastrar');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = inputEmail.value.trim();
      const { valido, msg } = validarEmail(email);
      if (!valido) { aplicarEstadoCampo(false, msg); inputEmail.focus(); return; }

      btnEnviar.disabled = true;
      btnEnviar.classList.add('carregando');

      try {
        /* ---------------------------------------------------------
           INTERVENÇÃO HUMANA — ENDPOINT DE CADASTRO
           Escolha UMA das opções abaixo e configure. Remova as demais.
        --------------------------------------------------------- */

        /* OPÇÃO A: API REST própria
        const resposta = await fetch('https://api.seujogo.com/pre-registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!resposta.ok) throw new Error('Erro no servidor.');
        */

        /* OPÇÃO B: EmailJS (sem back-end)
        emailjs.init('SUA_PUBLIC_KEY');
        await emailjs.send('ID_DO_SERVICO', 'ID_DO_TEMPLATE', { email_cadastro: email });
        */

        /* OPÇÃO C: Google Sheets via Apps Script
        await fetch('https://script.google.com/macros/s/SEU_ID/exec', {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        */

        /* OPÇÃO D: Mailchimp / Brevo / ConvertKit — use sempre um back-end intermediário */

        /* SIMULAÇÃO TEMPORÁRIA — remova após configurar o back-end */
        await new Promise(resolve => setTimeout(resolve, 1000));

        abrirModal();
        form.reset();
        inputEmail.classList.remove('sucesso', 'erro');

      } catch (erro) {
        /* INTERVENÇÃO HUMANA — adicione monitoramento de erros (ex: Sentry) se necessário */
        console.error('Erro ao cadastrar email:', erro);
        msgErro.textContent = 'Erro ao cadastrar. Tente novamente em instantes.';
        msgErro.classList.add('visivel');
        inputEmail.classList.add('erro');
      } finally {
        btnEnviar.disabled = false;
        btnEnviar.classList.remove('carregando');
      }
    });

    /* MODAL */
    const modalOverlay   = document.getElementById('modalSucesso');
    const btnFecharModal = document.getElementById('btnFecharModal');
    function abrirModal()  { modalOverlay.classList.add('aberto');    btnFecharModal.focus(); }
    function fecharModal() { modalOverlay.classList.remove('aberto'); inputEmail.focus(); }
    btnFecharModal.addEventListener('click', fecharModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) fecharModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('aberto')) fecharModal(); });