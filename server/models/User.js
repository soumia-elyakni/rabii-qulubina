import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    idUnique: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
      default: '',
    },
    fullNameAr: {
      type: String,
      trim: true,
      default: '',
    },
    mail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
      sparse: true // ضروري باش ما يضربش خطأ مع القيم الفارغة
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      sparse: true // ضروري هنا أيضا
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    resetPasswordToken: {
  type: String,
},
    resetPasswordExpire: {
  type: Date,
},
  },
  
  {
    timestamps: true,
  },
  
);

export default mongoose.model('User', userSchema);