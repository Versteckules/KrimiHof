/**
 * crypto.js - Clientseitige AES-GCM Verschlüsselung & Entschlüsselung
 * Schützt Final- und Bonus-Koordinaten vor Geocaching-Spoilern auf GitHub.
 */

const MASTER_SALT = 'KrimiHof1823_Salt_GCBYXW0';
const DEFAULT_PASSPHRASE = 'SchlappenPakt_Hof_1823_Geheimnis_GCBYXW0';

/**
 * Wandelt einen String in einen ArrayBuffer um
 */
function strToBuf(str) {
  return new TextEncoder().encode(str);
}

/**
 * Wandelt einen ArrayBuffer in einen String um
 */
function bufToStr(buf) {
  return new TextDecoder().decode(buf);
}

/**
 * Wandelt ArrayBuffer in Hex-String um
 */
export function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Wandelt Hex-String in Uint8Array um
 */
export function hexToBuf(hex) {
  if (!hex || typeof hex !== 'string' || hex.length % 2 !== 0) {
    throw new Error('Ungültiger Hex-String.');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Leitet einen AES Schlüssel aus einem Passwort ab (PBKDF2)
 */
async function deriveAesKey(password, algoName = 'AES-CBC', saltStr = MASTER_SALT) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    strToBuf(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: strToBuf(saltStr),
      iterations: 10000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: algoName, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Verschlüsselt ein beliebiges JS-Objekt mit AES-CBC (256-Bit)
 * @param {object} obj - Zu verschlüsselnde Daten
 * @param {string} [password] - Passwort
 * @returns {Promise<{iv: string, data: string}>}
 */
export async function encryptObject(obj, password = DEFAULT_PASSPHRASE) {
  const jsonStr = JSON.stringify(obj);
  const iv = crypto.getRandomValues(new Uint8Array(16)); // 16 Bytes für CBC
  const key = await deriveAesKey(password, 'AES-CBC');

  const encryptedBuf = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    strToBuf(jsonStr)
  );

  return {
    iv: bufToHex(iv),
    data: bufToHex(encryptedBuf)
  };
}

/**
 * Entschlüsselt ein mit encryptObject oder PowerShell verschlüsseltes Objekt
 * @param {{iv: string, data: string}} pkg
 * @param {string} [password]
 * @returns {Promise<object>}
 */
export async function decryptObject(pkg, password = DEFAULT_PASSPHRASE) {
  if (!pkg || !pkg.iv || !pkg.data) {
    throw new Error('Ungültiges Krypto-Paket (iv oder data fehlt).');
  }

  const iv = hexToBuf(pkg.iv);
  const data = hexToBuf(pkg.data);
  const isGcm = (iv.length === 12);
  const algoName = isGcm ? 'AES-GCM' : 'AES-CBC';

  const key = await deriveAesKey(password, algoName);

  const decryptedBuf = await crypto.subtle.decrypt(
    { name: algoName, iv },
    key,
    data
  );

  const jsonStr = bufToStr(decryptedBuf);
  return JSON.parse(jsonStr);
}

/**
 * Passwort für Standard-Final
 */
export function getStandardPassphrase() {
  return `${DEFAULT_PASSPHRASE}_standard_coords`;
}

/**
 * Passwort für Bonus-Final (gebunden an den wahren Mörder)
 */
export function getBonusPassphrase(murdererId = 'herold') {
  return `${DEFAULT_PASSPHRASE}_bonus_${murdererId}_75perc`;
}
