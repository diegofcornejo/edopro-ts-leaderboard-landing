/* eslint-disable no-case-declarations */
/* eslint-disable unicorn/switch-case-braces */
/* eslint-disable unicorn/no-null */
import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import CredentialsProvider from "next-auth/providers/credentials"
import { generateJwt } from "@/libs/jwtUtils"
import bcrypt from 'bcrypt';
import { initializeDataSource } from '../../../libs/database';


const getUserData = async (dataSource, userId) => {
  const stats = await dataSource.query(`SELECT * FROM player_stats WHERE user_id = '${userId}' AND ban_list_name = 'global'`);
  const rank = await dataSource.query(`
    WITH user_points AS (
      SELECT COALESCE(points, 0) as points
      FROM player_stats
      WHERE user_id = '${userId}' AND ban_list_name = 'global'
      UNION ALL
      SELECT 0 WHERE NOT EXISTS (SELECT 1 FROM player_stats WHERE user_id = '${userId}' AND ban_list_name = 'global')
    )
    SELECT COUNT(*) + 1 as rank
    FROM player_stats
    WHERE ban_list_name = 'global' AND points > (SELECT points FROM user_points)
  `);

  return {
    points: stats[0]?.points ?? 0,
    wins: stats[0]?.wins ?? 0,
    losses: stats[0]?.losses ?? 0,
    winRate: stats[0] ? (stats[0].wins / (stats[0].wins + stats[0].losses) * 100).toFixed(2) : '0.00',
    rank: rank[0]?.rank
  };
};

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
		CredentialsProvider({
			name: 'Custom login',
			credentials: {
				username: { label: "Username", type: "text", placeholder: "Username" },
				password: { label: "Password", type: "password", placeholder: "Password" },
			},
			async authorize(credentials) {
				if(!credentials?.username || !credentials.password) {
					return null;
				}
				const dataSource = await initializeDataSource();
				const user = await dataSource.query(`SELECT * FROM users WHERE username = '${credentials.username}'`);

				if(user.length === 0) {
					return null;
				}

				if(!bcrypt.compareSync(credentials.password, user[0].password)) {
					return null;
				}

				return {
					id: user[0].id,
					email: user[0].email,
					username: user[0].username,
					avatar: user[0].avatar ? JSON.parse(user[0].avatar) : null,
					permissions: null,
				}
			}
		})
  ],

	pages: {
		signIn: '/'
	},

	callbacks: {
		async jwt({ token, user, account }) {
			if (account) {
				const dataSource = await initializeDataSource();
				let userData;

				switch (account.type) {
					case 'oauth':
						const userProfile = await dataSource.query(`SELECT * FROM users WHERE email = '${user.email}'`);
						if (userProfile.length === 0) {
							throw new Error(`User ${user.email} not found.`);
						}
						if (!userProfile[0].discordId) {
							await dataSource.query(`UPDATE users SET discord_id = '${user.id}' WHERE email = '${user.email}'`);
						}
						userData = await getUserData(dataSource, userProfile[0].id);
						token.user = {
							...userProfile[0],
							...userData,
							avatar: userProfile[0].avatar ? JSON.parse(userProfile[0].avatar) : null,
							permissions: null,
						};
						break;

					case 'credentials':
						userData = await getUserData(dataSource, user.id);
						token.user = {
							...user,
							...userData,
						};
						break;
				}
			}
			return token;
		},

		async session({ session, token }) {
			session.accessToken = token.accessToken;
			session.user = token.user;
			session.user.token = generateJwt({role: token.user.role}); // Here we generate a new JWT token to mantaing compatibility with the legacy code
			return session;
		}
	}
}

export default NextAuth(authOptions)