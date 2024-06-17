const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require('./Models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo');

const session = require("express-session")
const passport = require("passport");
require('dotenv').config();

const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

const clientIdGoogle = process.env.GOOGLE_CLIENT_ID;
const clientIdGithub = process.env.GITHUB_CLIENT_ID;
const clientIdLinkedin = process.env.LINKEDIN_CLIENT_ID;
const clientIdFacebook = process.env.FACEBOOK_CLIENT_ID;
const clientIdMicrosoft = process.env.MICROSOFT_CLIENT_ID;

const clientSecretGoogle = process.env.GOOGLE_CLIENT_SECRET;
const clientSecretGithub = process.env.GITHUB_CLIENT_SECRET;
const clientSecretLinkedin = process.env.LINKEDIN_CLIENT_SECRET;
const clientSecretFacebook = process.env.FACEBOOK_CLIENT_SECRET;
const clientSecretMicrosoft = process.env.MICROSOFT_CLIENT_SECRET;

const UserOtpVerification = require("./Models/OtpVerification");
const router = express.Router();

const nodemailer = require("nodemailer")

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}))

app.use(express.json())

app.use(session({
    secret: 'shhhh',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/user-sessions" }),
    cookie: { maxAge: 180 * 60 * 1000 } // Session expires in 3 hours
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/user", { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => console.log('Database Connected'))
    .catch((err) => console.log('Failed To Connect Database', err))

app.get('/', (req, res) => {
    res.send("<h1>Server is working!</h1>")
})

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    let token;
    if (req.user) {
        token = req.user.token || req.headers['x-access-token'];
    }
    else {
        token = req.cookies.token || req.header['x-access-token'];
    }

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, 'shhhh'); // jwtSecret
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

//send otp
app.post('/sendOTP', async (req, res) => {
    try {
        const { email } = req.body;

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`

        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            throw new Error("User Already Exist With This Email!")
        }

        const mailOption = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Enter <b>${otp}</b> in the app to verify your email</p>
                  <p>This code <b>expire in 1 Minute</b>.</p>`
        }
        
        const saltRounds = 10;
        const hashOtp = await bcrypt.hash(otp, saltRounds);
        const newOtpVerification = new UserOtpVerification({
            userId: email,
            otp: hashOtp,
            cratedAt: Date.now(),
            expiresAt: Date.now() + 60000
        });

        await newOtpVerification.save();
        await transporter.sendMail(mailOption);
        res.json({
            status: "PENDING",
            message: 'Otp sent to your email',
            data: {
                userId: email,
            }
        })

    } catch (err) {
        if (err == "Error: User Already Exist With This Email!") {
            res.json({
                status: "FAILED",
                message: "User Already Exist With This Email!",
            })
        } else {
            res.json({
                status: "FAILED",
                message: 'Failed to send Otp',
            })
        }
    }
})

//manual register
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

        if (!(firstName && lastName && email && password && confirmPassword && phone)) {
            res.status(400).send("All Fields Require!");
        }

        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            res.status(401).send("User Already Exist With This Email!");
            throw new Error("User Already Exist With This Email!")
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashPassword,
            confirmPassword: hashPassword,
            verified: false
        })

        const token = jwt.sign(
            { id: user._id, email },
            'shhhh', //jwtSecret
            // {
            //     expiresIn: '2h'
            // }
        )

        user.token = token
        res.status(201).json(user)

    } catch (err) {
        console.log(err)
    }
})

//verify OTP
app.post('/verifyOTP', async (req, res) => {
    try {
        let { _id, userId, otp } = req.body;

        if (!userId || !otp) {
            throw Error("Empty OTP details not allowed!")
        }
        else {
            const userOTPVerificationRecords = await UserOtpVerification.find({
                userId,
            })

            if (userOTPVerificationRecords.length <= 0) {
                throw new Error("Account record doesn't exist!")
            }
            else {
                const { expiresAt } = userOTPVerificationRecords[0];
                const len = userOTPVerificationRecords.length;
                const hashedOTP = userOTPVerificationRecords[len - 1].otp;

                if (expiresAt < Date.now()) {
                    await UserOtpVerification.deleteMany({ userId });
                    throw new Error("OTP has expired! Please request a new one")
                }
                else {

                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if (!validOTP) {
                        throw new Error("Invalid OTP entered")
                    }
                    else {
                        await UserModel.updateOne({ _id: _id }, { verified: true })
                        await UserOtpVerification.deleteMany({ userId });

                        res.json({
                            status: "SUCCESS",
                            message: 'Account verified successfully',
                        })
                    }
                }
            }
        }
    } catch (err) {
        if (err == "Error: Invalid OTP entered") {
            res.json({
                status: "FAILED",
                message: 'Invalid OTP entered',
            })
        }
        else if (err == "Error: OTP has expired! Please request a new one") {
            res.json({
                status: "FAILED",
                message: 'OTP has expired! Please request a new one',
            })
        }
        else {
            res.json({
                status: "FAILED",
                message: 'Failed to verify OTP',
            })
        }
    }
})

//manual login
app.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("All Fields Require!");
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            res.status(400).send("User Not Found!");
        }

        if (!await bcrypt.compare(password, user.password)) {
            res.status(400).send("Incorrect Password");
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id },
                'shhhh',
                {
                    expiresIn: '1d'
                }
            )
            user.token = token

            //cookie section
            const options = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),//90days
                httpOnly: true
            }
            res.status(200).cookie("token", token, options).json({
                success: true,
                token,
                user
            })
            isManual = true;
        }
        else {
            res.status(400).send("Invalid Credentials");
        }

    } catch (err) {
        console.log(err)
    }

})

app.post('/forgotpassword', async (req, res) => {
    const { email } = req.body

    try {
        if (!email) {
            res.status(400).send("Email is required")
        }
        const user = await UserModel.findOne({ email })
        if (!user) {
            res.status(400).send("User Not Found")
        }

        const token = jwt.sign({ id: user._id }, "shhhh", { expiresIn: "1d" })

        const mailOption = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetpassword/${user._id}/${token}`
        }

        await transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                return res.send({ Status: "Success" })
            }
        });

    }
    catch (err) {
        console.log(err)
    }
})

app.post('/reset-password/:id/:token', (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    console.log("token:", token)
    console.log("id:", id);

    jwt.verify(token, "shhhh", (err, decoded) => {
        if (err) {
            res.status(400).send("Invalid Token")
            console.log(err);
        }
        else {
            bcrypt.hash(password, 10)
                .then(hash => {
                    UserModel.findByIdAndUpdate({ _id: id }, { password: hash })
                        .then(() => {
                            res.send({ Status: "Success" })
                        })
                        .catch((err) => {
                            res.send({ Status: "Failed to reset password" })
                            console.log(err);
                        })
                })
        }
    })
})

app.get("/login/success", verifyToken, async (req, res) => {

    if (req.user) {
        res.status(200).json({ message: "user login", user: req.user })
    }
    else {
        res.status(400).json({ message: "user not found" })
    }
})

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.clearCookie('token');
        res.redirect("http://localhost:5173/login")
    })
})

passport.serializeUser((user, cb) => {
    cb(null, user);
})

passport.deserializeUser((user, cb) => {
    cb(null, user);
})

//Social Authentication--------------------------------------------------------------------------------------------------------
//Google Strategy
passport.use(
    new OAuth2Strategy({
        clientID: clientIdGoogle,
        clientSecret: clientSecretGoogle,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"]
    },
        async (accessToken, refreshToken, profile, cb) => {
            // console.log(profile);
            try {

                let user = await UserModel.findOne({ googleId: profile.id })
                if (user) {
                    return cb(null, user)
                } else {
                    user = new UserModel({
                        googleId: profile.id,
                        fullName: profile.displayName,
                        googleEmail: profile.emails[0].value,
                        image: profile.photos[0].value
                    })

                    const token = jwt.sign(
                        { id: profile.id, googleEmail: profile.emails[0].value, fullName: profile.displayName, image: profile.photos[0].value },
                        'shhhh', //jwtSecret
                        {
                            expiresIn: '1d'
                        }
                    )

                    user.token = token

                    await user.save()
                    return cb(null, user)
                }


            }
            catch (err) {
                console.error('Error saving user:', err);
                return cb(err, null)
            }
        }
    )
)

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: clientIdFacebook,
    clientSecret: clientSecretFacebook,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            let user = await UserModel.findOne({ facebookId: profile.id })
            if (user) {
                return cb(null, user)
            } else {
                user = new UserModel({
                    facebookId: profile.id,
                    fullName: profile.displayName,
                    facebookEmail: profile.emails[0].value,
                    image: profile.photos[0].value
                })

                const token = jwt.sign(
                    { id: profile.id, facebookEmail: profile.emails[0].value, fullName: profile.displayName, image: profile.photos[0].value },
                    'shhhh', //jwtSecret
                    {
                        expiresIn: '1d'
                    }
                )

                user.token = token

                await user.save()
                return cb(null, user)
            }
        } catch (err) {
            console.error('Error saving user:', err);
            return cb(err, null)
        }
    }
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: clientIdGithub,
    clientSecret: clientSecretGithub,
    callbackURL: "/auth/github/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            let user = await UserModel.findOne({ githubId: profile.id })
            if (user) {
                return cb(null, user)
            } else {
                user = new UserModel({
                    githubId: profile.id,
                    fullName: profile.username,
                    // githubEmail: profile.emails[0].value,
                    image: profile.photos[0].value
                })
                const token = jwt.sign(
                    { id: profile.id, fullName: profile.username, image: profile.photos[0].value },
                    'shhhh', //jwtSecret
                    {
                        expiresIn: '1d'
                    }
                )

                user.token = token

                await user.save()
                return cb(null, user)
            }
        } catch (err) {
            console.error('Error saving user:', err);
            return cb(err, null)
        }
    }
));

//Microsoft Strategy
passport.use(new OIDCStrategy({
    identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    clientID: clientIdMicrosoft,
    clientSecret: clientSecretMicrosoft,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: 'http://localhost:3001/auth/microsoft/callback',
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecretMicrosoft,
    validateIssuer: false,
    passReqToCallback: false,
    scope: ['profile', 'offline_access', 'email']
},
    async (iss, sub, profile, accessToken, refreshToken, done) => {
        console.log("profile", profile);
        try {
            let user = await UserModel.findOne({ microsoftId: profile.oid });
            if (user) {
                return done(null, user);
            } else {
                user = new UserModel({
                    microsoftId: profile.oid,
                    fullName: profile.displayName,
                    microsoftEmail: profile._json.preferred_username,
                    image: profile._json.picture
                });

                const token = jwt.sign(
                    { id: profile.id, microsoftEmail: profile._json.preferred_username, fullName: profile.displayName, image: profile._json.picture },
                    'shhhh', //jwtSecret
                    {
                        expiresIn: '1d'
                    }
                )

                user.token = token

                await user.save();
                return done(null, user);
            }
        } catch (err) {
            console.error('Error saving user:', err);
            return done(err, null);
        }
    }
));

// LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: clientIdLinkedin,
    clientSecret: clientSecretLinkedin,
    callbackURL: "/auth/linkedin/callback",
    scope: ['r_liteprofile', 'r_emailaddress']
},
    async (accessToken, refreshToken, profile, cb) => {
        console.log(profile);
        try {
            let user = await UserModel.findOne({ linkedinId: profile.id })
            if (user) {
                return cb(null, user)
            } else {
                user = new UserModel({
                    linkedinId: profile.id,
                    fullName: profile.displayName,
                    linkedinEmail: profile.emails[0].value,
                    image: profile.photos[0].value
                })

                const token = jwt.sign(
                    { id: profile.id, linkedinEmail: profile.emails[0].value, fullName: profile.displayName, image: profile.photos[0].value },
                    'shhhh', //jwtSecret
                    {
                        expiresIn: '1d'
                    }
                )

                user.token = token

                await user.save()
                return cb(null, user)
            }
        } catch (err) {
            console.error('Error saving user:', err);
            return cb(err, null)
        }
    }
));


// Google Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))
app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173"
}))

// Facebook Routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: 'http://localhost:5173',
    failureRedirect: 'http://localhost:5173/login'
}));

// GitHub Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: 'http://localhost:5173',
    failureRedirect: 'http://localhost:5173/login'
}));

// Microsoft Routes
app.get('/auth/microsoft', passport.authenticate('azuread-openidconnect', { failureRedirect: 'http://localhost:5173/login' }));
app.post('/auth/microsoft/callback',
    passport.authenticate('azuread-openidconnect', { failureRedirect: 'http://localhost:5173/login' }),
    (req, res) => {
        res.redirect('http://localhost:5173');
    }
);

// LinkedIn Routes
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: 'http://localhost:5173',
    failureRedirect: 'http://localhost:5173/login'
}));

app.listen(3001, () => {
    console.log("Server is running")
})