import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
        session.user.lastUsernameUpdate = token.lastUsernameUpdate as string | undefined;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        // Fetch the actual user from DB to get custom fields on login
        try {
          const client = await clientPromise;
          const db = client.db();
          const dbUser = await db.collection('users').findOne({ _id: new ObjectId(user.id) });
          if (dbUser?.lastUsernameUpdate) {
            token.lastUsernameUpdate = dbUser.lastUsernameUpdate;
          }
        } catch (e) {
          console.error('Error fetching user in jwt callback', e);
        }
      }
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
        token.lastUsernameUpdate = new Date().toISOString();
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
