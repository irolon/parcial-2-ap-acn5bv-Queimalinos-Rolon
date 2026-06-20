import QRCode from 'qrcode';

/**
 * Genera un QR a partir de un texto/URL y lo devuelve como data URL PNG
 * en base64 (listo para usar en <img src="...">).
 */
export function toQrDataUrl(text) {
  return QRCode.toDataURL(text, { width: 320, margin: 2 });
}
