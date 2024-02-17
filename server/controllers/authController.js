import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import otpGenerator from "otp-generator";
import {encryption, compareText} from "../helpers/authHelper.js"
import crypto from "crypto";
import otp from "../Mail/otp.js";
import reset from "../Mail/resetPassword.js"
import {sendEmail} from "../services/mailer.js";
// ------------------------------------------ Register User ------------------------------------------

export const registerUserController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) {
      res.send("First Name is required!");
    }
    if (!lastName) {
      res.send("Last Name is required!");
    }
    if (!email) {
      res.send("Email is required!");
    }
    if (!password) {
      res.send("Password is required!");
    }

    const hashPassword = await encryption(password)

    const existingUser = await userModel.findOne({ email });
    if (existingUser && existingUser.verified) {
      return res.status(400).send({
        status: "error",
        message: "User already exists, Please Login!"
      });
    }
    
    else if(existingUser){
      await userModel.findOneAndUpdate({email}, {firstName, lastName, password: hashPassword});
      req.userId = existingUser._id;
    }
    else{
      const new_user = await userModel.create({firstName, lastName, email, password: hashPassword});
      req.userId = new_user._id;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register controller",
      error,
    });
  }
};

// -------------------------------------------- Send OTP --------------------------------------------

export const sendOTP = async (req, res, next) => {
  try {
    const {userId} = req;
    const new_otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });

    console.log(new_otp);

    const otp_expiry_time = Date.now() + 10*60*1000;

    const hashedOTP = await encryption(new_otp.toString());

    const user = await userModel.findByIdAndUpdate(userId, {otp: hashedOTP, otp_expiry_time}, {new: true});

    // TODO -> send Mail

    sendEmail({
      from: "shobhitpandey2205@gmail.com",
      to: user.email,
      subject: "Verification OTP",
      text: `OTP is ${new_otp}`,
      html: otp(user.firstName, new_otp),
    });
    
    res.status(200).send({
      status: "success",
      message: "OTP sent successfully",
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Error in Send OTP controller",
      error,
    });
  }
}

// ------------------------------------------ Verify OTP ------------------------------------------

export const verifyOTP = async (req, res, next) => {
  try {
    const {email, otp} = req.body;
    const user = await userModel.findOne({email, otp_expiry_time: {$gt: Date.now()}});
    if(!user){
      return res.status(400).send({
        status: "error",
        message: "Email is invalid or OTP expired!"
      })
    }
    if(user.verified){
      return res.status(400).send({
        status: "error",
        message: "Email is already verified"
      })
    }
    const compareOTP = await compareText(otp, user.otp);
    if(!compareOTP){
      return res.status(400).send({
        status: "error",
        message: "OTP is Invalid"
      })
    }
    
    user.verified = true;
    user.otp = undefined;
    user.otp_expiry_time = undefined;

    await user.save();
    
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    return res.status(200).send({
      status: "success",
      message: "OTP verified successfully!",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id
      },
      token,
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Verify OTP controller",
      error,
    });
  }
}

// ------------------------------------------- Login User -------------------------------------------

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send("Enter email and Password");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "User Not registered"
      });
    }
    const match = await compareText(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "invalid email or password",
      });
    }
    user.passwordResetToken = undefined;
    user.otp = undefined;
    user.ResetTokenExpires = undefined;
    user.otp_expiry_time = undefined;
    await user.save();

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    res.status(200).send({
      success: true,
      message: "login Successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      message: "Error in Login Controller",
      error,
    });
  }
};

// ------------------------------------------ Forgot Password ------------------------------------------

export const forgotPassword = async (req, res, next) => {
  try {
    const {email} = req.body;
    const user = await userModel.findOne({email});

    if(!user){
      return res.status(400).send({
        status: "error",
        message: `No user found with Email ${email}`,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.ResetTokenExpires = Date.now() + 10*60*1000;

    await user.save();

    try {
      const resetURL = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;
      console.log("Reset Token", resetToken);

      // Send Mail
      sendEmail({
        from: "shobhitpandey2205@gmail.com",
        to: user.email,
        subject: "Reset Password",
        text: "",
        html: reset(user.firstName, resetURL),
      });

      res.status(200).send({
        status: "success",
        message: "Reset Token sent to your Email"
      })
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: "error",
        message: `Error in sending Email`,
      });
    }

  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Forgot Password Controller",
      error,
    });
  }
}

// ------------------------------------------ Reset Password ------------------------------------------

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, password } = req.body;
    if(!resetToken){
      return res.status(400).send({
        status: "error",
        message: "Token not recieved",
      })
    }
    if(!password){
      return res.status(400).send({
        status: "error",
        message: "Password id required",
      })
    }

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    console.log(hashedToken);

    const user= await userModel.findOne({passwordResetToken: hashedToken, ResetTokenExpires: {$gt: Date.now()}});

    if(!user){
      return res.status(400).send({
        status: "error",
        message: "Token is invalid or Expired",
      })
    }

    const hashedPassword = await encryption(password)
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.ResetTokenExpires = undefined;
    await user.save();

    const token = JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "90d"} );
 
    res.status(200).send({
      status: "success",
      message: "Password Changed Successfully!",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      },
      token
    })

  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Reset Password Controller",
      error,
    });
  }
}