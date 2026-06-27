import { io } from "socket.io-client";

// API configuration
const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

let authListeners: Array<(event: string, session: any) => void> = [];

// Helper: Retrieves headers including Bearer token
function getHeaders() {
  const token = localStorage.getItem("svem_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Custom Query Builder mimicking Supabase chainable API
class QueryBuilder {
  private table: string;
  private filters: Record<string, any> = {};
  private orderBy: { column: string; ascending?: boolean } | null = null;
  private limitVal: number | null = null;
  private payload: any = null;
  private action: "select" | "insert" | "update" | "delete" = "select";

  constructor(table: string) {
    this.table = table;
  }

  select(fields?: string) {
    this.action = "select";
    return this;
  }

  insert(payload: any) {
    this.action = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: any) {
    this.action = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(column: string, value: any) {
    this.filters[column] = value;
    return this;
  }

  order(column: string, options?: { ascending: boolean }) {
    this.orderBy = { column, ...options };
    return this;
  }

  limit(n: number) {
    this.limitVal = n;
    return this;
  }

  single() {
    return this;
  }

  // Thenable implementation to support await on builder directly
  async then(resolve: (value: any) => void, reject?: (reason: any) => void) {
    try {
      const result = await this.execute();
      return resolve(result);
    } catch (err) {
      if (reject) return reject(err);
      return { data: null, error: err };
    }
  }

  private async execute() {
    let url = `${API_URL}/${this.table}`;
    let method = "GET";
    let body: string | undefined = undefined;

    // Special client routing mappings
    if (this.table === "user_roles") {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
        if (!res.ok) return { data: [], error: null };
        const user = await res.json();
        const roles = [{ role: user.role }];
        return { data: roles, error: null };
      } catch (err) {
        return { data: [], error: null };
      }
    }

    if (this.table === "reviews") {
      if (this.action === "select") {
        const prodId = this.filters["product_id"];
        url = `${API_URL}/reviews/${prodId || ""}`;
      } else if (this.action === "insert" || this.action === "update") {
        url = `${API_URL}/reviews`;
        method = "POST"; // Both insert/update are mapped to POST review upsert
        body = JSON.stringify(this.payload);
      }
    } else if (this.table === "orders") {
      if (this.action === "insert") {
        url = `${API_URL}/orders`;
        method = "POST";
        body = JSON.stringify(this.payload);
      } else if (this.action === "select") {
        url = `${API_URL}/orders`;
      } else if (this.action === "update") {
        const orderId = this.filters["id"];
        url = `${API_URL}/orders/${orderId}/status`;
        method = "PUT";
        body = JSON.stringify({ status: this.payload.status });
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: data.message || "Request failed" } };
      }

      // Map MongoDB _id and timestamps to Supabase naming convention (id, created_at, updated_at)
      const normalize = (item: any) => {
        if (!item) return item;
        const newItem = { ...item };
        if (item._id) newItem.id = item._id.toString();
        if (item.createdAt) newItem.created_at = item.createdAt;
        if (item.updatedAt) newItem.updated_at = item.updatedAt;
        return newItem;
      };

      let resultData = data;
      if (Array.isArray(data)) {
        resultData = data.map(normalize);
      } else if (data && typeof data === "object") {
        resultData = normalize(data);
      }

      return { data: resultData, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || "Network error" } };
    }
  }
}

// Export the mock Supabase client
export const supabase = {
  auth: {
    async getSession() {
      const token = localStorage.getItem("svem_token");
      if (!token) return { data: { session: null }, error: null };
      
      try {
        const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
        if (!res.ok) throw new Error();
        const user = await res.json();
        
        const session = {
          user: { id: user.id, email: user.email },
          access_token: token,
        };
        return { data: { session }, error: null };
      } catch (e) {
        localStorage.removeItem("svem_token");
        return { data: { session: null }, error: null };
      }
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      authListeners.push(callback);
      
      // Instantly trigger initial check
      this.getSession().then(({ data }) => {
        callback(data?.session ? "SIGNED_IN" : "SIGNED_OUT", data?.session);
      });

      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners = authListeners.filter((cb) => cb !== callback);
            },
          },
        },
      };
    },

    async signInWithOtp({ email }: { email: string }) {
      try {
        const res = await fetch(`${API_URL}/auth/otp/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) return { error: { message: data.message || "Failed to send code" } };
        return { data, error: null };
      } catch (error: any) {
        return { error: { message: error.message || "Network error" } };
      }
    },

    async verifyOtp({ email, token }: { email: string; token: string }) {
      try {
        const res = await fetch(`${API_URL}/auth/otp/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: token }),
        });
        
        const data = await res.json();
        if (!res.ok) return { error: { message: data.message || "Verification failed" } };

        localStorage.setItem("svem_token", data.accessToken);
        
        const session = {
          user: { id: data.user.id, email: data.user.email },
          access_token: data.accessToken,
        };

        // Notify session change
        authListeners.forEach((cb) => cb("SIGNED_IN", session));

        return { data: { user: data.user, session }, error: null };
      } catch (error: any) {
        return { error: { message: error.message || "Network error" } };
      }
    },

    async signOut() {
      try {
        await fetch(`${API_URL}/auth/logout`, { method: "POST", headers: getHeaders() });
      } catch {}
      
      localStorage.removeItem("svem_token");
      authListeners.forEach((cb) => cb("SIGNED_OUT", null));
      return { error: null };
    },

    async resetPasswordForEmail(email: string) {
      try {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) return { error: { message: data.message || "Reset failed" } };
        return { error: null };
      } catch (error: any) {
        return { error: { message: error.message || "Network error" } };
      }
    },
  },

  from(table: string) {
    return new QueryBuilder(table);
  },

  channel(channelName: string) {
    let socket: any = null;
    return {
      on(event: string, filter: any, callback: (payload: any) => void) {
        // Establish connection to Socket.io Server
        socket = io(SOCKET_URL);
        
        // Listeners for Owner Dashboard real-time orders feed
        socket.emit("join", "admin");
        
        socket.on("new_order", (data: any) => {
          callback({
            new: {
              id: data.orderId,
              customer_name: data.customer_name,
              total: data.total,
              payment_method: data.payment_method,
              items: Array(data.itemsCount),
              created_at: data.created_at,
              status: "confirmed",
            },
          });
        });

        return this;
      },
      subscribe() {
        console.log(`[Realtime Channel] Subscribed to ${channelName}`);
        return this;
      },
      unsubscribe() {
        if (socket) {
          socket.disconnect();
          console.log(`[Realtime Channel] Unsubscribed`);
        }
      },
    };
  },

  removeChannel(channel: any) {
    if (channel && channel.unsubscribe) {
      channel.unsubscribe();
    }
  },
};
