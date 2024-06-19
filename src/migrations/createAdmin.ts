import User from "../models/User";
import passwordService from "../services/password.service";

const ADMIN_ROLE_ID = 1;

const createAdmin = async () => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL;

  try {
    let admin = await User.findOne({ username: adminUsername });

    if (!admin) {
      const hashedPassword = await passwordService.hash(adminPassword);

      admin = new User({
        username: adminUsername,
        password: hashedPassword,
        email: adminEmail,
        role: ADMIN_ROLE_ID,
      });

      await admin.save();

      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (err) {
    console.error(err);
  }
};

export default createAdmin