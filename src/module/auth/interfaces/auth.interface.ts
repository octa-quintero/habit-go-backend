export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
}

export interface LoginResponse {
  userData: UserData;
  accessToken: string;
}
