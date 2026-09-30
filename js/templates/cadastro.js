/*
 * templates/cadastro.js — vista do formulário de voluntários e doadores (#/cadastro).
 */
(function (ONG) {
  'use strict';

  const campo = (cfg) => ONG.templates.campo(cfg);

  const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
    'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  function opcoes(mapa) {
    return Object.entries(mapa).map(([valor, texto]) => `<option value="${valor}">${texto}</option>`).join('');
  }

  ONG.templates.cadastro = function () {
    const r = ONG.dados.rotulos;
    const obrig = '<abbr title="obrigatório" class="obrigatorio">*</abbr>';

    return `
      <section class="destaque destaque--compacto" aria-labelledby="titulo-cadastro">
        <div class="container">
          <h1 id="titulo-cadastro">Faça parte dessa transformação</h1>
          <p>Preencha o cadastro para se tornar voluntário, doador ou ambos. Nossa equipe entrará em contato em até 5 dias úteis.</p>
        </div>
      </section>

      <div class="secao">
        <div class="container grid">
          <section class="col-12 col-lg-8" aria-labelledby="titulo-formulario">
            <h2 id="titulo-formulario">Formulário de cadastro</h2>
            <p class="texto-suave">Campos marcados com ${obrig} são obrigatórios.</p>

            <div class="alerta alerta--info mb-5" id="aviso-rascunho" hidden>
              <span class="alerta__icone" aria-hidden="true">i</span>
              <p>Recuperamos o que você havia preenchido antes. <button type="button" class="link-botao" id="descartar-rascunho">Começar do zero</button></p>
            </div>

            <div class="alerta alerta--erro resumo-erros mb-5" id="resumo-erros" tabindex="-1" hidden>
              <span class="alerta__icone" aria-hidden="true">✕</span>
              <div>
                <p><strong id="resumo-erros-titulo"></strong></p>
                <ul id="resumo-erros-lista"></ul>
              </div>
            </div>

            <form class="formulario" id="form-cadastro" novalidate>
              <fieldset>
                <legend>Dados pessoais</legend>
                <div class="grid">
                  ${campo({ id: 'nome', rotulo: 'Nome completo', obrigatorio: true, dica: 'Nome e sobrenome, apenas letras.',
                    atributos: `minlength="5" maxlength="100" autocomplete="name" pattern="^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ']+)+$" data-msg-formato="Informe nome e sobrenome, usando apenas letras."` })}
                  ${campo({ id: 'cpf', rotulo: 'CPF', obrigatorio: true, colunas: 'col-12 col-md-6', dica: 'Formato 000.000.000-00.',
                    atributos: `inputmode="numeric" maxlength="14" placeholder="000.000.000-00" pattern="^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$" data-mascara="cpf" data-validar="cpf" data-msg-formato="Digite os 11 números do CPF."` })}
                  ${campo({ id: 'nascimento', rotulo: 'Data de nascimento', obrigatorio: true, colunas: 'col-12 col-md-6', tipo: 'date',
                    dica: 'É preciso ter no mínimo 16 anos.', atributos: `min="1920-01-01" autocomplete="bday" data-validar="idade"` })}
                  ${campo({ id: 'email', rotulo: 'E-mail', obrigatorio: true, colunas: 'col-12 col-md-6', tipo: 'email',
                    atributos: `maxlength="120" autocomplete="email" placeholder="nome@exemplo.com"` })}
                  ${campo({ id: 'telefone', rotulo: 'Telefone / WhatsApp', obrigatorio: true, colunas: 'col-12 col-md-6', tipo: 'tel',
                    dica: 'Celular ou fixo, com DDD.', atributos: `inputmode="numeric" maxlength="15" placeholder="(00) 00000-0000" autocomplete="tel" pattern="^\\(\\d{2}\\) (?:9\\d{4}|[2-5]\\d{3})-\\d{4}$" data-mascara="telefone" data-msg-formato="Use (00) 00000-0000 para celular ou (00) 0000-0000 para fixo."` })}
                </div>
              </fieldset>

              <fieldset>
                <legend>Endereço</legend>
                <div class="grid">
                  ${campo({ id: 'cep', rotulo: 'CEP', obrigatorio: true, colunas: 'col-12 col-sm-6 col-md-3', dica: 'Preenche o endereço automaticamente.',
                    atributos: `inputmode="numeric" maxlength="9" placeholder="00000-000" autocomplete="postal-code" pattern="^\\d{5}-\\d{3}$" data-mascara="cep" data-msg-formato="O CEP deve ter 8 números."` })}
                  ${campo({ id: 'logradouro', rotulo: 'Endereço', obrigatorio: true, colunas: 'col-12 col-md-6', atributos: `minlength="3" maxlength="120" autocomplete="address-line1"` })}
                  ${campo({ id: 'numero', rotulo: 'Número', obrigatorio: true, colunas: 'col-12 col-sm-6 col-md-3',
                    atributos: `maxlength="10" pattern="^(\\d+[A-Za-z]?|S/N|s/n)$" data-msg-formato="Use apenas números ou S/N."` })}
                  ${campo({ id: 'complemento', rotulo: 'Complemento', colunas: 'col-12 col-md-5', atributos: `maxlength="60" autocomplete="address-line2"` })}
                  ${campo({ id: 'cidade', rotulo: 'Cidade', obrigatorio: true, colunas: 'col-12 col-sm-6 col-md-4', atributos: `minlength="2" maxlength="60" autocomplete="address-level2"` })}
                  <div class="campo col-12 col-sm-6 col-md-3">
                    <label for="uf">UF ${obrig}</label>
                    <select id="uf" name="uf" required autocomplete="address-level1" aria-describedby="uf-erro">
                      <option value="">Selecione</option>
                      ${UFS.map((uf) => `<option value="${uf}">${uf}</option>`).join('')}
                    </select>
                    <p class="erro-campo" id="uf-erro"></p>
                  </div>
                </div>
              </fieldset>

              <fieldset id="grupo-participacao" aria-describedby="grupo-participacao-erro">
                <legend>Como deseja participar? ${obrig}</legend>
                <div class="opcoes">
                  ${Object.entries(r.participacao).map(([valor, texto]) =>
                    `<label><input type="radio" name="participacao" value="${valor}" required> ${texto}</label>`).join('')}
                </div>
                <p class="erro-campo" id="grupo-participacao-erro"></p>
              </fieldset>

              <fieldset id="dados-voluntario" hidden>
                <legend>Voluntariado</legend>
                <div class="campo" id="grupo-areas" role="group" aria-labelledby="areas-rotulo" aria-describedby="grupo-areas-erro">
                  <p class="rotulo-grupo" id="areas-rotulo">Áreas de interesse ${obrig}</p>
                  <div class="opcoes">
                    ${Object.entries(r.areas).map(([valor, texto]) =>
                      `<label><input type="checkbox" name="areas" value="${valor}"> ${texto}</label>`).join('')}
                  </div>
                  <p class="erro-campo" id="grupo-areas-erro"></p>
                </div>
                <div class="grid">
                  <div class="campo col-12 col-md-8">
                    <label for="disponibilidade">Disponibilidade ${obrig}</label>
                    <select id="disponibilidade" name="disponibilidade" aria-describedby="disponibilidade-erro">
                      <option value="">Selecione</option>${opcoes(r.disponibilidade)}
                    </select>
                    <p class="erro-campo" id="disponibilidade-erro"></p>
                  </div>
                  ${campo({ id: 'horas', rotulo: 'Horas por semana', colunas: 'col-12 col-md-4', tipo: 'number', atributos: `min="1" max="40" step="1"` })}
                </div>
              </fieldset>

              <fieldset id="dados-doacao" hidden>
                <legend>Doação</legend>
                <div class="grid">
                  ${campo({ id: 'valor', rotulo: 'Valor da doação (R$)', colunas: 'col-12 col-md-6', tipo: 'number',
                    dica: 'Valor mínimo de R$ 10,00.', atributos: `min="10" max="100000" step="0.01" placeholder="10,00"` })}
                  <div class="campo col-12 col-md-6">
                    <label for="frequencia">Frequência ${obrig}</label>
                    <select id="frequencia" name="frequencia" aria-describedby="frequencia-erro">
                      <option value="">Selecione</option>${opcoes(r.frequencia)}
                    </select>
                    <p class="erro-campo" id="frequencia-erro"></p>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Mensagem</legend>
                <div class="campo">
                  <label for="mensagem">Conte por que deseja participar</label>
                  <textarea id="mensagem" name="mensagem" rows="4" maxlength="500" aria-describedby="mensagem-contador"></textarea>
                  <small class="dica" id="mensagem-contador">0 de 500 caracteres.</small>
                </div>
              </fieldset>

              <div class="campo campo--check">
                <label>
                  <input type="checkbox" id="lgpd" name="lgpd" required aria-describedby="lgpd-erro"
                         data-msg-obrigatorio="É preciso autorizar o uso dos dados para concluir o cadastro.">
                  Autorizo o uso dos meus dados pelo Instituto Semear Futuro conforme a LGPD (Lei nº 13.709/2018). ${obrig}
                </label>
                <p class="erro-campo" id="lgpd-erro"></p>
              </div>

              <div class="formulario__acoes">
                <button type="submit" class="botao botao--primario">Enviar cadastro</button>
                <button type="reset" class="botao botao--contorno">Limpar</button>
              </div>
            </form>
          </section>

          <aside class="col-12 col-lg-4 alinhar-topo fixo-rolagem" aria-labelledby="titulo-lateral">
            <div class="cartao">
              <h2 id="titulo-lateral" class="mb-0">Por que se cadastrar?</h2>
              <ul>
                <li>Escolha a área e o horário que combinam com você.</li>
                <li>Receba o relatório anual de impacto.</li>
                <li>Doações a partir de R$ 10,00.</li>
              </ul>
              <div class="alerta">
                <span class="alerta__icone" aria-hidden="true">i</span>
                <p>Seu rascunho é salvo automaticamente neste navegador enquanto você digita.</p>
              </div>
              <a class="botao botao--contorno" href="#/painel">Ver cadastros enviados</a>
            </div>
          </aside>
        </div>
      </div>`;
  };
})(window.ONG);
