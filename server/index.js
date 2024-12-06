const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require('./Models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo');
const ProductModel = require('./Models/Products');
const PlansModel = require('./Models/Plans');
const ReviewsModel = require('./Models/Reviews');
const BookingdetailsModel = require('./Models/Bookingdetails');
const OrderDetailsModel = require("./Models/Orderdetails");

const session = require("express-session")
const passport = require("passport");
require('dotenv').config();

const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const clientIdGoogle = process.env.GOOGLE_CLIENT_ID;
const clientIdGithub = process.env.GITHUB_CLIENT_ID;
const clientIdFacebook = process.env.FACEBOOK_CLIENT_ID;

const clientSecretGoogle = process.env.GOOGLE_CLIENT_SECRET;
const clientSecretGithub = process.env.GITHUB_CLIENT_SECRET;
const clientSecretFacebook = process.env.FACEBOOK_CLIENT_SECRET;


const UserOtpVerification = require("./Models/OtpVerification");

const nodemailer = require("nodemailer");


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

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => console.log('Database Connected'))
    .catch((err) => console.log('Failed To Connect Database', err))

app.get('/', (req, res) => {
    res.send("<h1>Server is working!</h1>")
})

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    let token;
    if (req.user) {
        token = req.user.token || req.headers['authorization']?.split(' ')[1];;
    }
    else {
        token = req.cookies.token || req.headers['authorization']?.split(' ')[1];;
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
            console.log(err)
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
        })

        await user.save();

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
                        await UserModel.updateOne({ _id: _id })
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
                        { id: user._id, googleEmail: profile.emails[0].value, fullName: profile.displayName, image: profile.photos[0].value },
                        'shhhh', //jwtSecret
                        // {
                        //     expiresIn: '1d'
                        // }
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
                    { id: user._id, facebookEmail: profile.emails[0].value, fullName: profile.displayName, image: profile.photos[0].value },
                    'shhhh', //jwtSecret
                    // {
                    //     expiresIn: '1d'
                    // }
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
                    { id: user._id, fullName: profile.username, image: profile.photos[0].value },
                    'shhhh', //jwtSecret
                    // {
                    //     expiresIn: '1d'
                    // }
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


// Add Products Deals
app.post('/products/adddeals', async (req, res) => {
    const productsDetail = req.body;
    try {
        const product = await ProductModel.create(productsDetail);
        res.status(201).send(product);
    } catch (err) {
        console.error('Error in adding product --->', err);
        res.status(500).send(err.message);
    }
});

// Get Product Deals
app.get('/products/getdeals', async (req, res) => {
    try {
        const products = await ProductModel.find();
        if (products.length === 0) {
            return res.status(404).send({ message: "No products found" });
        }
        res.status(200).send(products);
    } catch (err) {
        console.error("Error retrieving products:", err);
        res.status(500).send({ message: "Error retrieving products", error: err });
    }
});

//Delete Product Deals
app.delete('/products/:id', async (req, res) => {
    productId = req.params.id;
    try {
        const result = await ProductModel.findByIdAndDelete(productId);

        if (!result) {
            return res.status(404).send('Deal Package Not Found.')
        }

        return res.status(200).send('Delete Successfully...')
    }
    catch (err) {
        console.log('Error occured at deleting deals package...', err);
        res.status(500).send(err.message);
    }
})

//Update Product Deals
app.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const updates = req.body;

    try {
        const result = await ProductModel.findByIdAndUpdate(productId, updates, {
            new: true,
            runValidators: true
        })

        if (!result) {
            res.status(404).send('Deal Package Not Found')
        }

        return res.status(200).send('Update Successfully...')
    }
    catch (err) {
        console.log('Error occured at updating deals package...', err);
        res.status(500).send(err.message);
    }
})

//Add Plans
app.post('/plans/addplans', async (req, res) => {
    const plansDetail = req.body;
    try {
        const plans = await PlansModel.create(plansDetail);
        res.status(201).send(plans);
    } catch (err) {
        console.error('Error in adding product --->', err);
        res.status(500).send(err.message);
    }
});

//Get Plans
app.get('/plans/getplans', async (req, res) => {
    try {
        const plans = await PlansModel.find();
        if (plans.length === 0) {
            return res.status(404).send({ message: "No products found" });
        }
        res.status(200).send(plans);
    } catch (err) {
        console.error("Error retrieving products:", err);
        res.status(500).send({ message: "Error retrieving products", error: err });
    }
});

//Delete Plans
app.delete('/plans/:id', async (req, res) => {
    const plansId = req.params.id;

    try {
        const result = await PlansModel.findByIdAndDelete(plansId);

        if (!result) {
            res.status(404).send('Plans Not Found')
        }
        return res.status(200).send('Delete Successfully...')

    } catch (err) {
        console.log('Error occured at deleting plans...', err);
        res.status(500).send(err.message);
    }
})

//Update Plans
app.put('/plans/:id', async (req, res) => {
    const plansId = req.params.id;
    const updates = req.body;
    try {
        const result = await PlansModel.findByIdAndUpdate(plansId, updates, {
            new: true,
            runValidators: true
        })

        if (!result) {
            res.status(404).send('Plans Not Found')
        }

        return res.status(200).send('Update Successfully...')
    } catch (err) {
        console.log('Error occured at plans package updates...');
        res.status(500).send(err.message);
    }
})
//Add Reviews
app.post('/reviews/addreviews', async (req, res) => {
    const reviewsDetail = req.body;
    try {
        const reviews = await ReviewsModel.create(reviewsDetail);
        res.status(201).send(reviews);
    } catch (err) {
        console.error('Error in adding product --->', err);
        res.status(500).send(err.message);
    }
});

//Get Reviews
app.get('/reviews/getreviews', async (req, res) => {
    try {
        const reviews = await ReviewsModel.find();
        if (reviews.length === 0) {
            return res.status(404).send({ message: "No products found" });
        }
        res.status(200).send(reviews);
    } catch (err) {
        console.error("Error retrieving products:", err);
        res.status(500).send({ message: "Error retrieving products", error: err });
    }
});

//Add Boookingdetails
app.post('/Boookingdetails/addBoookingdetails', async (req, res) => {
    const BookingDetail = req.body;
    try {
        const facilities = await BookingdetailsModel.create(BookingDetail);
        res.status(201).send(facilities);
    } catch (err) {
        console.error('Error in adding product --->', err);
        res.status(500).send(err.message);
    }
});

//Get Boookingdetails
app.get('/Boookingdetails/getBoookingdetails', async (req, res) => {
    try {
        const BookingDetail = await BookingdetailsModel.find();
        if (BookingDetail.length === 0) {
            return res.status(404).send({ message: "No products found" });
        }
        res.status(200).send(BookingDetail);
    } catch (err) {
        console.error("Error retrieving products:", err);
        res.status(500).send({ message: "Error retrieving products", error: err });
    }
});


//Add Order Details
app.post('/orderdetails', async (req, res) => {
    const bookingData = req.body;
    const cardNumber = req.body.cardNumber;

    console.log(bookingData)
    try {
        const orderDetails = await OrderDetailsModel.create(
            {
                ...bookingData,
                cardNumber: cardNumber
            }
        );
        res.status(201).send(orderDetails);
    } catch (err) {
        console.log("Error Generating On Add OrderDetails....", err);
        res.status(500).send({ message: "Error Occurred in Add OrderDetails", error: err });
    }
});
//Get Order Details
app.get('/user/orders/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const orders = await OrderDetailsModel.find({ userId: userId });
        res.status(200).send(orders);
    } catch (err) {
        console.log("Error Fetching User Orders....", err);
        res.status(500).send({ message: "Error Occurred in Fetching User Orders", error: err });
    }
});

app.get('/orders/all', async (req, res) => {

    try {
        const orders = await OrderDetailsModel.find();
        res.status(200).send(orders);
    } catch (err) {
        console.log("Error Fetching User Orders....", err);
        res.status(500).send({ message: "Error Occurred in Fetching User Orders", error: err });
    }
});


//Delete Order
app.delete('/user/orders/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        const result = await OrderDetailsModel.findByIdAndDelete(orderId);

        if (!result) {
            res.status(404).send('Order Not Found')
        }
        return res.status(200).send('Cancel Successfully...')

    } catch (err) {
        console.log('Error occured at Canceling Order...', err);
        res.status(500).send(err.message);
    }
})
// Add to favorites
app.post('/favorites/add', async (req, res) => {
    try {
        const userId = req.body.userId;
        const { productId } = req.body;
        const { item } = req.body;

        if (!productId) {
            return res.status(400).send("Product ID is required");
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.favoriteProducts.includes(productId)) {
            return res.status(400).send("Product already in favorites");
        }

        user.favoriteProducts.push(item);
        await user.save();

        res.status(200).send(user);
    } catch (err) {
        console.error("Error adding to favorites:", err);
        res.status(500).send("Internal Server Error");
    }
});

//get favorite product
app.get('/favorites/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await UserModel.findById(userId).select('favoriteProducts');

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(user.favoriteProducts);
    } catch (err) {
        console.error("Error fetching favorites:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Remove from favorites
app.post('/favorites/remove', async (req, res) => {
    try {
        const userId = req.body.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).send("Product ID is required");
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.favoriteProducts = user.favoriteProducts.filter(item => item._id !== productId);
        await user.save();

        res.status(200).send("Product removed from favorites");

    } catch (err) {
        console.error("Error removing from favorites:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(process.env.PORT || 3001, () => {
    console.log("Server is running")
})