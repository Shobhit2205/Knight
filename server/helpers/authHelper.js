import bcrypt from "bcrypt";

export const encryption = async (plain) => {
  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(plain, saltRounds);
    return hashed;
  } catch (error) {
    console.log(error);
  }
};

export const compareText = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};
