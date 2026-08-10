// 統一定義「安全的使用者欄位」，所有查詢都用這個，避免忘記排除 password
export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
};