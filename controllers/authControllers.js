import bcrypt from 'bcryptjs'
import jwt from  'jsonwebtoken'
import User from '../models/User.js'
import crypto from 'crypto'

export const register = async (req , res) => {
    const { username, email, password } = req.body



try {
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({ username, email, password: hashedPassword })
   
    res.status(201).json({ id: user ._id,username: user .username})

} catch (error) {
    res.status(400).json({ message: error.message })

    
}
}
 
export const login = async (req, res) => {
    const { email, password, } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user ){
            return res.status(401).json({ message: 'invalid credentials'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.status(200).json({token, user: { id: user ._id, username: user .username }})

    } catch (error) {
        res.status(500).json({message: error.message })



    }


}

export const forgetPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'No account with that email '})
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        user.resetToken = resetToken
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000
        await user.save()

        res.status(200).json({ message: 'Reset token generated',resetToken })
    } catch (error) {
        res.status(500).json({ message: error.message})
        
    }
}

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
