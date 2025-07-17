import { prisma } from "@/prisma/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            httpOptions: {
                timeout: 10000
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", placeholder: "abc@gmail.com", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    const isPassword = await bcrypt.compare(credentials.password, user.password)


                    if (!isPassword) return null

                    const account = await prisma.account.findUnique({
                        where: {
                            provider_providerAccountId: {
                                provider: "credentials",
                                providerAccountId: user.email!,
                            },
                        },
                    });

                    if (!account) {
                        await prisma.account.create({
                            data: {
                                user: { connect: { id: user.id } },
                                type: "credentials",
                                provider: "credentials",
                                providerAccountId: credentials.email,
                            },
                        });
                    }

                    return user;
                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            }

        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ user, token }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id as string
            }
            return session
        },

        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                })

                if (existingUser?.password) {
                    throw new Error("Email already registered with credentials.")
                }
            }
            return true
        }
    },
    pages: {
        signIn: "/login"
    }
}