import createAppError from '../errors/AppError.js';

// 統一驗證路徑參數裡的 id，避免各個 controller 各自用 Number() 轉型卻不檢查結果
const parseId = (value, name = 'id') => {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw createAppError(`${name} 必須是正整數`, 400);
  }

  return id;
};

export default parseId;
