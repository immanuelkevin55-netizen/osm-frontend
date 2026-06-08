import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@osm.org" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@osm.org" && credentials?.password === "admin") {
          return { id: "1", name: "Admin Setup", email: "admin@osm.org", image: "https://i.pravatar.cc/150?u=admin" }
        }
        
        if (credentials?.email && credentials?.password) {
          const db = await (await clientPromise).db('osm');
          const user = await db.collection('users').findOne({ email: credentials.email });
          
          if (user && user.password === credentials.password) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
            };
          }
        }
        
        return null;
      }
    }),
    {
      id: "openstreetmap",
      name: "OpenStreetMap",
      type: "oauth",
      version: "2.0",
      authorization: {
        url: "https://www.openstreetmap.org/oauth2/authorize",
        params: { scope: "read_prefs write_api" }
      },
      token: "https://www.openstreetmap.org/oauth2/token",
      userinfo: "https://api.openstreetmap.org/api/0.6/user/details.json",
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      clientId: process.env.OSM_CLIENT_ID || "mock",
      clientSecret: process.env.OSM_CLIENT_SECRET || "mock",
      profile(profile: any) {
        return {
          id: profile.user.id.toString(),
          name: profile.user.display_name,
          email: profile.user.email,
          image: profile.user.img?.href,
          osmId: profile.user.id.toString(),
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = token.sub;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret123',
};
