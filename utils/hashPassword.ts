import crypto from "crypto";

export function hashPassword(password: string): string {
  // Generate a salt (random bytes) to make the hash unique
  const salt = crypto.randomBytes(16).toString("hex");
  
  // Use PBKDF2 (Password-Based Key Derivation Function 2) for secure hashing
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  
  // Return the salt and hashed password concatenated
  // This allows verification later by using the same salt
  return `${salt}:${hashedPassword}`;
}

export function verifyPassword(storedPassword: string, inputPassword: string): boolean {
  // Split the stored password into salt and hash
  const [salt, originalHash] = storedPassword.split(':');
  
  // Hash the input password with the stored salt
  const hashedInputPassword = crypto
    .pbkdf2Sync(inputPassword, salt, 1000, 64, "sha512")
    .toString("hex");
  
  // Compare the newly generated hash with the original hash
  return hashedInputPassword === originalHash;
}