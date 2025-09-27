interface User {
  username: string;
  roles: string[];
}

interface LoginResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  username: string;
  password: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const auth = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Replace this with your actual API endpoint
    const response = await fetch('https://api.wintertons.us/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user ? user.roles.includes(role) : false;
  }
};

export type { User, LoginResponse, LoginCredentials };
