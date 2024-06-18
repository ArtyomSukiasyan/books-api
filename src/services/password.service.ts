import bcrypt from "bcryptjs";

async function hash(password: string) {
  return bcrypt.hash(password, process.env.HASH_SALT);
}

async function compare(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export default {
  hash,
  compare,
};
