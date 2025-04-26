// eslint-disable-next-line no-unused-vars
import NextAuth from "next-auth";

import { authOptions } from "./options";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
