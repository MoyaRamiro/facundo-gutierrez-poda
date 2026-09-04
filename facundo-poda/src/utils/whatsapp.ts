import { SITE_CONFIG } from '../content/config';

export function whatsappLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`;
}

export function quoteMessage(service: string, town: string, name: string): string {
  return `Hola, soy ${name}. Necesito ${service} en ${town}. ¿Me das presupuesto?`;
}
