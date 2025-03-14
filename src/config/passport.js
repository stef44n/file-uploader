import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "./db.js";

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { email } });

                if (!user)
                    return done(null, false, { message: "User not found" });

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch)
                    return done(null, false, { message: "Incorrect password" });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    console.log("🔒 Serializing user:", user);

    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log("🔍 Deserializing user:", id); // Debug log
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            console.log("❌ User not found during deserialization");
            return done(null, false);
        }

        console.log("✅ User found:", user);
        done(null, user);
    } catch (err) {
        console.error("❌ Error in deserializeUser:", err);
        done(err);
    }
});

export default passport;
