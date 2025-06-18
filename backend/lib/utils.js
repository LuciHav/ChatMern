import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config'

export const generateToken = (userid, res) => {
    const token = jsonwebtoken.sign(
        { id: userid },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
    // You may want to return or use the token here
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Helps prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    });
    return token;
}
