import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository.js';
import createAppError from '../errors/AppError.js';

export const registerNewUser = async ({ name, email, password }) => {
  // 業務規則：email 不能重複註冊
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw createAppError('這個 email 已經被註冊過了', 409); // 409 = Conflict，代表資源衝突
  }

  // 把明文密碼雜湊過，10 代表雜湊運算的複雜度（數字越大越安全，但越花時間）
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await authRepository.createUser({ name, email, hashedPassword });

  // 絕對不要把密碼（就算是雜湊過的）回傳給前端，用解構把 password 排除掉
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

export const loginUser = async ({ email, password }) => {
  const user = await authRepository.findUserByEmail(email);

  // 這裡故意用同一句錯誤訊息，不管是「email 不存在」還是「密碼錯誤」都回一樣的話
  // 這是安全考量：如果分開講，等於告訴攻擊者「這個 email 存在，只是密碼錯」，方便對方繼續猜密碼
  if (!user) {
    throw createAppError('email 或密碼錯誤', 401); // 401 = Unauthorized，代表未授權
  }

  // bcrypt.compare 會把使用者輸入的密碼重新雜湊，跟資料庫存的雜湊值比對
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createAppError('email 或密碼錯誤', 401);
  }

  // 簽發 JWT，把 userId 放進 token 裡，之後每個請求帶著這個 token 就能證明身分
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
