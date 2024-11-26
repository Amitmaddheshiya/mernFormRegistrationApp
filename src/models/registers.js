const mongoose = require("mongoose"); //mongoose

const jwt = require("jsonwebtoken");

const registerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String
},
resetTokenExpire: {
    type: Date
},
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});



// Method to generate authentication token
registerSchema.methods.generateAuthToken = async function () {
  try {
    const tokenGenerated = jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY);
    this.tokens = this.tokens.concat({ token: tokenGenerated });
    await this.save();
    return tokenGenerated;
  } catch (error) {
    console.log(error);
    throw new Error("Token generation failed");
  }
};


     

const Register = mongoose.model("Register", registerSchema);
module.exports = Register;
