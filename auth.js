import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./models/User";
import { compare } from "bcryptjs";
import connectMongo from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Please provide both email and password");
        }

        await connectMongo();

        const user = await User.findOne({ email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;

          await connectMongo();

          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            await User.create({ email, name, googleId: id, image });
          } else if (!existingUser.googleId) {
            // Update existing user with Google ID if they didn't have one
            existingUser.googleId = id;
            existingUser.image = image;
            await existingUser.save();
          }

          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});