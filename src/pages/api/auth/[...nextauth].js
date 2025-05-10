import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db();
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const db = await connectToDatabase();
        const user = await db
          .collection("admin")
          .findOne({ email: credentials.email });

        if (!user) throw new Error("No user found");

        // Ensure correct bcrypt comparison (hashed password vs plain password)
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        // Return the user object including name, email, and role
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: 'admin', // Set role directly since this is the admin collection
          isAdmin: true, // Add isAdmin flag for backward compatibility
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // When signing in
        token.role = user.role;
        token.name = user.name; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      if (token?.name) {
        session.user.name = token.name; 
      }
      return session;
    },
  },
});
