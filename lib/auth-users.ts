export const AUTH_USERS = {
  tanyel: {
    email: "tanyel@gredaful.com",
    displayName: "Tanyel",
  },
  eda: {
    email: "eda@gredaful.com",
    displayName: "Eda",
  },
} as const;

export type AuthUsername = keyof typeof AUTH_USERS;

export function getAuthUser(username: string) {
  return AUTH_USERS[username.trim().toLowerCase() as AuthUsername];
}

export function isAllowedAuthEmail(email?: string) {
  return Object.values(AUTH_USERS).some((user) => user.email === email);
}
