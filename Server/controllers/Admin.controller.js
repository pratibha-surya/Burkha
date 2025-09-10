// const AdminModel = require("../models/AdminModel");
// // const bcrypt = require('bcryptjs');

// const adminLogin = async(req,res)=>{
//     const {userid, password} =req.body;
    
    
//     try {
//         if(!userid || !password){
//             return res.status(400).send({
//                 success:false,message:"both userid and password required..!"
//             })
//         }

//      const Admin = await AdminModel.findOne({userid,password})


//      if(!Admin){
//       return   res.status(401).send({success:false,message:"Invalid Credentials"});
//      }
     
//      return res.status(201).send({success:true,message:"Login successfull",Admin})


     
//     } catch (error) {
//         return res.status(500).send({success:false,message:error.message})
//         console.log(error)
//     }
  

//   }
// module.exports = {
//     adminLogin
// };
const AdminModel = require("../models/AdminModel");
const bcrypt = require('bcryptjs');

// Admin Registration
const adminRegister = async (req, res) => {
    const { name, userid, password } = req.body;

    try {
        // Validation
        if (!name || !userid || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, userid, and password are required"
            });
        }

        // Check for existing user
        const existingAdmin = await AdminModel.findOne({ userid });
        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin with this userid already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new AdminModel({
            name,
            userid,
            password: hashedPassword
        });

        await newAdmin.save();

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: {
                _id: newAdmin._id,
                name: newAdmin.name,
                userid: newAdmin.userid
            }
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    const { userid, password } = req.body;

    try {
        if (!userid || !password) {
            return res.status(400).json({
                success: false,
                message: "Userid and password are required"
            });
        }

        const admin = await AdminModel.findOne({ userid });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            admin: {
                _id: admin._id,
                name: admin.name,
                userid: admin.userid
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    adminRegister,
    adminLogin
};
