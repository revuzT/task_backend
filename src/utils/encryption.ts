import crypto from "crypto";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.SECRET_KEY;

const key = crypto
  .createHash("sha256")
  .update(SECRET_KEY || "")
  .digest();
const algorithm = "aes-256-ctr";

export const encrypt = (data: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (hash: string): string => {
  const [ivHex, encryptedHex] = hash.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};

export const hashToken = async (token: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
};

export const compareHashedToken = async (
  token: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(token, hashed);
};
