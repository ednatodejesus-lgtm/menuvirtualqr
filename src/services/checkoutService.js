// ============================================================
// CHECKOUT SERVICE — Gerar mensagem WhatsApp + link wa.me
// ============================================================

function formatPhoneNumber(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

function formatPrice(price) {
  return `${parseFloat(price).toFixed(2)} Kz`;
}

export function buildWhatsAppMessage({ checkoutType, product, restaurant, data }) {
  const restaurantName = restaurant?.name || 'Estabelecimento';
  const productName = product?.name || 'Produto';
  const price = parseFloat(product?.price || 0);

  let message = '';

  switch (checkoutType) {
    case 'food': message = buildFoodMessage({ productName, price, data }); break;
    case 'burger': message = buildBurgerMessage({ productName, price, data }); break;
    case 'cafe': message = buildCafeMessage({ productName, price, data }); break;
    case 'pizza': message = buildPizzaMessage({ productName, price, data }); break;
    case 'bar': message = buildBarMessage({ productName, price, data }); break;
    case 'hotel': message = buildHotelMessage({ productName, price, data }); break;
    case 'resort': message = buildResortMessage({ productName, price, data }); break;
    case 'spa': message = buildSpaMessage({ productName, price, data }); break;
    case 'fashion': message = buildFashionMessage({ productName, price, data }); break;
    case 'tech': message = buildTechMessage({ productName, price, data }); break;
    case 'pharmacy': message = buildPharmacyMessage({ productName, price, data }); break;
    case 'vehicle': message = buildVehicleMessage({ productName, price, data }); break;
    default: message = buildGenericMessage({ productName, price, data });
  }

  return `*${restaurantName}*\n\n${message}`;
}

function buildFoodMessage({ productName, price, data }) {
  const subtotal = price * (data.quantity || 1);
  let msg = `🍽️ *Pedido*\n\n`;
  msg += `*Produto:* ${productName}\n`;
  msg += `*Quantidade:* ${data.quantity}\n`;
  msg += `*Preço unitário:* ${formatPrice(price)}\n`;
  msg += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  if (data.extras?.length > 0) {
    msg += `\n*Extras:*\n`;
    data.extras.forEach((extra) => { msg += `- ${extra}\n`; });
  }
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  if (data.table) msg += `\n*Mesa:* ${data.table}\n`;
  msg += `\n*Total estimado:* ${formatPrice(subtotal)}`;
  return msg;
}

function buildBurgerMessage({ productName, price, data }) {
  const subtotal = price * (data.quantity || 1);
  let msg = `🍔 *Pedido*\n\n`;
  msg += `*Produto:* ${productName}\n`;
  msg += `*Quantidade:* ${data.quantity}\n`;
  msg += `*Preço unitário:* ${formatPrice(price)}\n`;
  msg += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  if (data.sauces?.length > 0) {
    msg += `\n*Molhos:*\n`;
    data.sauces.forEach((s) => { msg += `- ${s}\n`; });
  }
  if (data.extras?.length > 0) {
    msg += `\n*Extras:*\n`;
    data.extras.forEach((e) => { msg += `- ${e}\n`; });
  }
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  if (data.table) msg += `\n*Mesa:* ${data.table}\n`;
  msg += `\n*Total estimado:* ${formatPrice(subtotal)}`;
  return msg;
}

function buildCafeMessage({ productName, price, data }) {
  const subtotal = price * (data.quantity || 1);
  let msg = `☕ *Pedido*\n\n`;
  msg += `*Produto:* ${productName}\n`;
  msg += `*Quantidade:* ${data.quantity}\n`;
  msg += `*Preço unitário:* ${formatPrice(price)}\n`;
  msg += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  if (data.size) msg += `\n*Tamanho:* ${data.size}\n`;
  if (data.sugar) msg += `*Açúcar:* ${data.sugar}\n`;
  if (data.extras?.length > 0) {
    msg += `\n*Extras:*\n`;
    data.extras.forEach((e) => { msg += `- ${e}\n`; });
  }
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  if (data.table) msg += `\n*Mesa:* ${data.table}\n`;
  msg += `\n*Total estimado:* ${formatPrice(subtotal)}`;
  return msg;
}

function buildPizzaMessage({ productName, price, data }) {
  const subtotal = price * (data.quantity || 1);
  let msg = `🍕 *Pedido*\n\n`;
  msg += `*Produto:* ${productName}\n`;
  msg += `*Quantidade:* ${data.quantity}\n`;
  msg += `*Preço unitário:* ${formatPrice(price)}\n`;
  msg += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  if (data.size) msg += `\n*Tamanho:* ${data.size}\n`;
  if (data.dough) msg += `*Massa:* ${data.dough}\n`;
  if (data.extras?.length > 0) {
    msg += `\n*Extras:*\n`;
    data.extras.forEach((e) => { msg += `- ${e}\n`; });
  }
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  if (data.table) msg += `\n*Mesa:* ${data.table}\n`;
  msg += `\n*Total estimado:* ${formatPrice(subtotal)}`;
  return msg;
}

function buildBarMessage({ productName, price, data }) {
  const subtotal = price * (data.quantity || 1);
  let msg = `🍺 *Pedido*\n\n`;
  msg += `*Produto:* ${productName}\n`;
  msg += `*Quantidade:* ${data.quantity}\n`;
  msg += `*Preço unitário:* ${formatPrice(price)}\n`;
  msg += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  if (data.option) msg += `\n*Opção:* ${data.option}\n`;
  if (data.extras?.length > 0) {
    msg += `\n*Extras:*\n`;
    data.extras.forEach((e) => { msg += `- ${e}\n`; });
  }
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  if (data.table) msg += `\n*Mesa:* ${data.table}\n`;
  msg += `\n*Total estimado:* ${formatPrice(subtotal)}`;
  return msg;
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}



function buildHotelMessage({ productName, price, data }) {
  const days = data.days || 0;
  const rooms = data.rooms || 1;
  const pricePerDay = parseFloat(price) || 0;
  const totalPrice = pricePerDay * days * rooms;
  const deposit = totalPrice * 0.5;
  const remaining = totalPrice - deposit;

  let msg = `🏨 *Reserva*\n\n`;
  msg += `*Quarto:* ${productName}\n`;
  msg += `*Check-in:* ${formatDate(data.checkIn)}\n`;
  msg += `*Check-out:* ${formatDate(data.checkOut)}\n`;
  msg += `*Dias:* ${days} ${days === 1 ? 'noite' : 'noites'}\n`;
  msg += `*Pessoas:* ${data.guests || 1}\n`;
  msg += `*Quartos:* ${rooms}\n`;

  // 🔥 VALORES
  msg += `\n💰 *Resumo da Reserva*\n`;
  msg += `*Preço por noite:* ${formatPrice(pricePerDay)}\n`;
  msg += `*Total (${days} ${days === 1 ? 'noite' : 'noites'} × ${rooms} ${rooms === 1 ? 'quarto' : 'quartos'}):* ${formatPrice(totalPrice)}\n`;
  msg += `*Reserva (50%):* ${formatPrice(deposit)}\n`;
  msg += `*Restante na chegada:* ${formatPrice(remaining)}\n`;

  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  if (data.name) msg += `\n*Nome:* ${data.name}`;
  if (data.phone) msg += `\n*Telefone:* ${data.phone}`;
  return msg;
}

function buildResortMessage({ productName, price, data }) {
  const days = data.days || 0;
  const rooms = data.rooms || 1;
  const pricePerDay = parseFloat(price) || 0;
  const totalPrice = pricePerDay * days * rooms;
  const deposit = totalPrice * 0.5;
  const remaining = totalPrice - deposit;

  let msg = `🏖️ *Reserva*\n\n`;
  msg += `*Acomodação:* ${productName}\n`;
  msg += `*Check-in:* ${formatDate(data.checkIn)}\n`;
  msg += `*Check-out:* ${formatDate(data.checkOut)}\n`;
  msg += `*Dias:* ${days} ${days === 1 ? 'noite' : 'noites'}\n`;
  msg += `*Adultos:* ${data.adults || 1}\n`;
  msg += `*Crianças:* ${data.children || 0}\n`;
  msg += `*Quartos:* ${rooms}\n`;

  // 🔥 VALORES
  msg += `\n💰 *Resumo da Reserva*\n`;
  msg += `*Preço por noite:* ${formatPrice(pricePerDay)}\n`;
  msg += `*Total (${days} ${days === 1 ? 'noite' : 'noites'} × ${rooms} ${rooms === 1 ? 'quarto' : 'quartos'}):* ${formatPrice(totalPrice)}\n`;
  msg += `*Sinal (50%):* ${formatPrice(deposit)}\n`;
  msg += `*Restante na chegada:* ${formatPrice(remaining)}\n`;

  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  if (data.name) msg += `\n*Nome:* ${data.name}`;
  if (data.phone) msg += `\n*Telefone:* ${data.phone}`;
  return msg;
}

function buildSpaMessage({ productName, price, data }) {
  let msg = `💆 *Agendamento*\n\n`;
  msg += `*Serviço:* ${productName}\n`;
  msg += `*Pessoas:* ${data.people || 1}\n`;
  msg += `*Data:* ${formatDate(data.date)}\n`;
  msg += `*Horário:* ${data.time || 'N/A'}\n`;
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  if (data.name) msg += `\n*Nome:* ${data.name}`;
  if (data.phone) msg += `\n*Telefone:* ${data.phone}`;
  return msg;
}

function buildFashionMessage({ productName, price, data }) {
  const subtotal = price * (data.quantity || 1);
  let msg = `👗 *Pedido*\n\n`;
  msg += `*Produto:* ${productName}\n`;
  msg += `*Tamanho:* ${data.size || 'N/A'}\n`;
  msg += `*Cor:* ${data.color || 'N/A'}\n`;
  msg += `*Quantidade:* ${data.quantity}\n`;
  msg += `*Preço unitário:* ${formatPrice(price)}\n`;
  msg += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  msg += `\n*Total estimado:* ${formatPrice(subtotal)}`;
  return msg;
}

function buildTechMessage({ productName, price, data }) {
  const subtotal = price * (data.quantity || 1);
  let msg = `📱 *Pedido*\n\n`;
  msg += `*Produto:* ${productName}\n`;
  msg += `*Quantidade:* ${data.quantity}\n`;
  msg += `*Preço unitário:* ${formatPrice(price)}\n`;
  msg += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  if (data.color) msg += `\n*Cor:* ${data.color}\n`;
  if (data.storage) msg += `*Armazenamento:* ${data.storage}\n`;
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  msg += `\n*Total estimado:* ${formatPrice(subtotal)}`;
  return msg;
}

function buildPharmacyMessage({ productName, price, data }) {
  const subtotal = price * (data.quantity || 1);
  let msg = `💊 *Pedido*\n\n`;
  msg += `*Produto:* ${productName}\n`;
  msg += `*Quantidade:* ${data.quantity}\n`;
  msg += `*Preço unitário:* ${formatPrice(price)}\n`;
  msg += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  msg += `\n*Total estimado:* ${formatPrice(subtotal)}`;
  return msg;
}

function buildVehicleMessage({ productName, price, data }) {
  let msg = `🚗 *Interesse em veículo*\n\n`;
  msg += `*Veículo:* ${productName}\n`;
  if (data.name) msg += `\n*Nome:* ${data.name}\n`;
  if (data.phone) msg += `*Telefone:* ${data.phone}\n`;
  if (data.contactPreference) msg += `*Contacto preferencial:* ${data.contactPreference}\n`;
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  return msg;
}

function buildGenericMessage({ productName, price, data }) {
  const subtotal = price * (data.quantity || 1);
  let msg = `📦 *Pedido*\n\n`;
  msg += `*Produto:* ${productName}\n`;
  msg += `*Quantidade:* ${data.quantity}\n`;
  msg += `*Preço unitário:* ${formatPrice(price)}\n`;
  msg += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  if (data.observations) msg += `\n*Observações:*\n${data.observations}\n`;
  msg += `\n*Total estimado:* ${formatPrice(subtotal)}`;
  return msg;
}

export function sendToWhatsApp({ restaurant, message }) {
  const phone = formatPhoneNumber(
    restaurant?.contact_phone || restaurant?.social_links?.whatsapp
  );
  if (!phone) {
    alert('Este estabelecimento não tem um número de WhatsApp configurado.');
    return;
  }
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}