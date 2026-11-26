(function () {
  var P = {
    kit:   { name: 'Kit Escritório Premium Clássico', price: 299.9, img: 'kit' },
    mouse: { name: 'Mouse Ergonômico Bluetooth Silence', price: 149.9, img: 'mouse' }
  };
  var $ = function (s) { return document.querySelector(s); };
  var money = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('osCart') || '{}') || {}; } catch (e) { cart = {}; }
  function save() { try { localStorage.setItem('osCart', JSON.stringify(cart)); } catch (e) {} }
  function imgOf(id) { var el = document.querySelector('[data-img="' + P[id].img + '"]'); return el ? el.src : ''; }

  function render() {
    var ids = Object.keys(cart).filter(function (i) { return P[i] && cart[i] > 0; });
    var count = 0, sum = 0;
    ids.forEach(function (i) { count += cart[i]; sum += cart[i] * P[i].price; });
    $('#cartCount').textContent = count;
    $('#subtotal').textContent = money(sum);
    var left = Math.max(0, 250 - sum);
    $('#ship').innerHTML = left ? 'Faltam <b>' + money(left) + '</b> para frete grátis' : 'Você ganhou <b>frete grátis</b>!';
    $('#ship').innerHTML += '<div class="bar"><i style="width:' + Math.min(100, sum / 2.5) + '%"></i></div>';
    $('#items').innerHTML = ids.length ? ids.map(function (i) {
      return '<li><img src="' + imgOf(i) + '" alt=""><div><div class="n">' + P[i].name + '</div><div class="u">' + money(P[i].price) +
        '</div><div class="qty"><button data-q="-1" data-id="' + i + '" aria-label="Diminuir">&minus;</button><span>' + cart[i] +
        '</span><button data-q="1" data-id="' + i + '" aria-label="Aumentar">+</button></div></div><button class="rm" data-rm="' + i + '">Remover</button></li>';
    }).join('') : '<li class="empty" style="display:block">Seu carrinho está vazio.</li>';
    $('#checkout').disabled = !ids.length;
  }
  function openCart(o) {
    $('#drawer').classList.toggle('open', o);
    $('#drawer').setAttribute('aria-hidden', String(!o));
    $('#overlay').hidden = !o;
  }
  var tt;
  function toast(m) { var t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2200); }
  function add(id) { cart[id] = (cart[id] || 0) + 1; save(); render(); openCart(true); }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button,a'); if (!t) return;
    if (t.dataset.add) add(t.dataset.add);
    else if (t.dataset.q) { var i = t.dataset.id; cart[i] = Math.max(0, (cart[i] || 0) + Number(t.dataset.q)); save(); render(); }
    else if (t.dataset.rm) { delete cart[t.dataset.rm]; save(); render(); }
  });
  $('#openCart').onclick = function () { openCart(true); };
  $('#closeCart').onclick = $('#overlay').onclick = function () { openCart(false); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') openCart(false); });
  $('#clearCart').onclick = function () { cart = {}; save(); render(); };
  $('#checkout').onclick = function () { cart = {}; save(); render(); openCart(false); toast('Pedido simulado realizado com sucesso. Obrigado!'); };
  $('#contactForm').onsubmit = function (e) { e.preventDefault(); $('#contactOk').hidden = false; e.target.reset(); };

  function card(id, tag) {
    return '<article class="card"><img src="' + imgOf(id) + '" alt="' + P[id].name + '"><h3>' + P[id].name + '</h3>' + (tag || '') +
      '<div class="p">' + money(P[id].price) + '</div><div class="row"><a href="#' + (id === 'kit' ? 'produto' : 'mouse') +
      '">Ver detalhes</a><button type="button" data-add="' + id + '">Adicionar</button></div></article>';
  }
  function route() {
    var v = (location.hash || '#inicio').slice(1);
    if (!document.querySelector('[data-view="' + v + '"]')) v = 'inicio';
    document.querySelectorAll('[data-view]').forEach(function (s) { s.hidden = s.dataset.view !== v; });
    document.querySelectorAll('[data-nav]').forEach(function (a) { a.classList.toggle('on', a.dataset.nav === v || (v === 'mouse' && a.dataset.nav === 'produtos')); });
    if (v === 'inicio') $('#homeGrid').innerHTML = card('kit', '<span class="save">-23%</span>') + card('mouse');
    if (v === 'produtos') $('#productGrid').innerHTML = card('kit') + card('mouse');
    if (v === 'promocoes') $('#promoGrid').innerHTML = card('kit', '<span class="save">-23%</span>');
    var isP = v === 'produto', isM = v === 'mouse';
    $('.sticky-cta').style.display = (isP || isM) ? '' : 'none';
    $('#stickyPrice').textContent = isM ? 'R$ 149,90' : 'R$ 299,90';
    $('#stickySmall').textContent = isM ? '10x de R$ 14,99' : '10x de R$ 29,99';
    $('#stickyBtn').dataset.add = isM ? 'mouse' : 'kit';
    $('#stickyBtn').textContent = isM ? 'Adicionar ao carrinho' : 'Garantir meu Kit';
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  render(); route();
})();
