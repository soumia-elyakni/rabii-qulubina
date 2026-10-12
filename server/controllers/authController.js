import User from '../models/User.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


// إعداد Nodemailer
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

const generateUniqueId = async () => {
  let isUnique = false;
  let generatedId = '';
  while (!isUnique) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    generatedId = `RQ-${randomNum}`;
    const existingUser = await User.findOne({ idUnique: generatedId });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return generatedId;
};

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'rabii_qulubina_secret_key',
    { expiresIn: '30d' }
  );
};

export async function registerUser(req, res) {
  try {
    const { mail, phone, nameInput, password, country } = req.body;

    if (!mail) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني إجباري للتسجيل.' });
    }
    if (!password || !nameInput) {
      return res.status(400).json({ success: false, message: 'المرجو إدخال الاسم الكامل وكلمة المرور.' });
    }

    const cleanMail = mail.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : '';

    // التحقق الصارم من التكرار (للإيميل و لرقم الهاتف إيلا كان مدخل)
    let emailExists = await User.findOne({ mail: cleanMail });
    let phoneExists = cleanPhone ? await User.findOne({ phone: cleanPhone }) : null;

    if (emailExists && phoneExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'البريد الإلكتروني ورقم الهاتف معاً مستعملان مسبقاً.' 
      });
    }
    if (emailExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'البريد الإلكتروني مستعمل مسبقاً.' 
      });
    }
    if (phoneExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'رقم الهاتف مستعمل مسبقاً.' 
      });
    }

    let fullName = undefined;
    let fullNameAr = undefined;
    if (isArabic(nameInput)) {
      fullNameAr = nameInput.trim();
    } else {
      fullName = nameInput.trim();
    }

    const newUniqueId = await generateUniqueId();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      idUnique: newUniqueId,
      mail: cleanMail,
      password: hashedPassword,
      country: country || 'المغرب',
    };

    if (fullName) userData.fullName = fullName;
    if (fullNameAr) userData.fullNameAr = fullNameAr;
    if (cleanPhone) userData.phone = cleanPhone;

    const newUser = await User.create(userData);

    // إرسال الإيميل عبر Nodemailer مع المعرف الفريد
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: cleanMail,
      subject: 'مرحباً بك في ربيع القلوب - معرفك الفريد',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #FDFBF7; color: #2D5A27;">
          <h2 style="color: #2D5A27;">أهلاً بك يا ${nameInput}</h2>
          <p>شكراً لتسجيلك في تطبيق <b>ربيع القلوب</b>.</p>
          <p>المعرف الفريد الخاص بك (ID) هو:</p>
          <h3 style="background: #EAF0EC; padding: 10px; display: inline-block; border-radius: 8px;">${newUniqueId}</h3>
          <p>احتفظ بهذا المعرف لاستخدامه في تسجيل الدخول مستقبلاً.</p>
        </div>
      `,
    };

   // ✅ السطر المعدل
const transporter = getTransporter();
transporter.sendMail(mailOptions).catch(err => console.error("خطأ في إرسال البريد:", err));

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح وإرسال المعرف إلى بريدك الإلكتروني',
      data: { idUnique: newUser.idUnique, mail: newUser.mail },
    });

  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({ success: false, message: 'خطأ في الخادم الداخلي', error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'المرجو إدخال البريد الإلكتروني، الهاتف أو المعرف وكلمة المرور.',
      });
    }

    const cleanInput = identifier.trim();

    // 🔍 زدنا هنا idUnique باش يتوافق مع الفرت إند
    const user = await User.findOne({
      $or: [
        { mail: cleanInput.toLowerCase() }, 
        { phone: cleanInput },
        { idUnique: cleanInput.toUpperCase() } // ضروري لتשغيل الدخول بالـ ID
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة.',
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        idUnique: user.idUnique,
        fullName: user.fullName,
        fullNameAr: user.fullNameAr,
        mail: user.mail,
        phone: user.phone,
        role: user.role,
        country: user.country,
        token,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error.message);
    return res.status(500).json({
      success: false,
      message: 'خطأ في الخادم الداخلي',
      error: error.message,
    });
  }
}

// 3. دالة نسيت كلمة السر (Forgot Password)
export const forgotPassword = async (req, res) => {
  // كنجربو نقراو الإيميل كيفما صيفطو الفرونت إند (سواء email ولا mail ولا identifier)
  const userEmail = req.body.email || req.body.mail || req.body.identifier;

  if (!userEmail) {
    return res.status(400).json({ message: "المرجو إدخال البريد الإلكتروني" });
  }

  try {
    // تأكدي واش في MongoDB الـ Schema حاطة الحقل سميتو email ولا mail
    // (هنا دارنا البحث بـ email، إيلا كان عندك mail في الرد ديرali email: userEmail أو mail: userEmail)
    const user = await User.findOne({ 
      $or: [{ email: userEmail }, { mail: userEmail }] 
    });

    if (!user) {
      return res.status(404).json({ message: "هذا البريد الإلكتروني غير مسجل لدينا" });
    }

    // توليد رمز سري من 6 أرقام
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    user.resetPasswordToken = hashedCode;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 دقيقة
    await user.save();

    // إرسال الإيميل (استعمال الإيميل الحقيقي ديال المستخدم اللي لقيناه في الداتابيز)
    const recipientEmail = user.email || user.mail;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail, // 👈 هنا ضروري يكون عامر وماشي undefined
      subject: 'رمز إعادة تعيين كلمة المرور - ربيع قلوبنا',
      html: `
        <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; padding: 20px;">
          <h2>إعادة تعيين كلمة المرور</h2>
          <p>السلام عليكم،</p>
          <p>رمز التحقق الخاص بك لإعادة تعيين كلمة المرور هو:</p>
          <h1 style="color: #2b6cb0; letter-spacing: 4px;">${resetCode}</h1>
          <p>هذا الرمز صالح لمدة 15 دقيقة فقط.</p>
        </div>
      `,
    };

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إرسال البريد الإلكتروني" });
  }
};

export const resetPassword = async (req, res) => {
  // التقاط الإيميل بأي سمية (email أو mail)
  const userEmail = req.body.email || req.body.mail;
  
  // التقاط الرمز بأي سمية يقدر يكون صيفطها الفرونت إند
  const rawCode = req.body.code || req.body.token || req.body.otp || req.body.resetCode;
  const { newPassword } = req.body;

  if (!userEmail || !rawCode || !newPassword) {
    return res.status(400).json({ message: "المرجو إدخال جميع البيانات المطلوبة (الإيميل، الرمز، وكلمة المرور الجديدة)" });
  }

  try {
    // تنظيف الرمز من أي مسافات وتشفيره
    const cleanedCode = String(rawCode).trim();
    const hashedCode = crypto.createHash('sha256').update(cleanedCode).digest('hex');

    console.log("Searching with Email:", userEmail);
    console.log("Hashed Code trying to match:", hashedCode);

    const user = await User.findOne({
      $or: [{ email: userEmail }, { mail: userEmail }],
      resetPasswordToken: hashedCode,
      resetPasswordExpire: { $gt: Date.now() }, // التأكد من أن الوقت لم ينته بعد
    });

    if (!user) {
      return res.status(400).json({ message: "الرمز غير صحيح أو انتهت صلاحيته" });
    }

    // تشفير كلمة المرور الجديدة
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // مسح الرمز والوقت باش مايستعملش مرة أخرى
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "تم تغيير كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "حدث خطأ في إعادة تعيين كلمة المرور" });
  }
};