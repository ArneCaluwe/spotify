// The PKCE authorization flow starts with the creation of a code verifier.
// According to the PKCE standard, a code verifier is a high-entropy cryptographic
//  random string with a length between 43 and 128 characters (the longer the better).
// It can contain letters, digits, underscores, periods, hyphens, or tildes.
export const generateRandomString = (length: number) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

export const codeVerifier = generateRandomString(64);
