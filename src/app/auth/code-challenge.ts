import { codeVerifier } from './code-verifier';

// Once the code verifier has been generated, we must transform (hash) it using the SHA256 algorithm.
//  This is the value that will be sent within the user authorization request.
const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBufferLike) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

export const hashed = sha256(codeVerifier);
export const codeChallenge = async () => base64encode(await hashed);
