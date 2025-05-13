const MailUi = (firstName, lastName, otp) => {
    return `
    <div style="max-width:600px; margin:auto; font-family:'Helvetica Neue',Arial,sans-serif; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.1); border:1px solid #f0f0f0;">

        <!-- Header Section -->
        <div style="background: linear-gradient(90deg, #ff8a00, #e52e71); padding:30px 20px; text-align:center;">
            <img src="cid:logo" alt="Payasam Logo" style="width: 100px; margin-bottom: 10px;">
            <h1 style="color:white; margin:0; font-size:24px;">Welcome to Payasam Products</h1>
            <p style="color:#fff; font-size:16px; margin-top:10px;">Bringing tradition with taste</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 25px;">
            <p style="font-size: 18px; color: #333;">Hi <strong>${firstName} ${lastName}</strong>,</p>

            <p style="font-size: 16px; color: #555; margin: 15px 0;">
                Your one-time password (OTP) is below. Please use it to complete your verification. It is valid for <strong>10 minutes only</strong>.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <div style="display:inline-block; background-color:#f9f9f9; padding:20px 40px; border:2px dashed #ff8a00; border-radius:10px; font-size:28px; font-weight:bold; color:#e52e71; letter-spacing:4px;">
                    ${otp}
                </div>
            </div>

            <p style="font-size: 15px; color: #777;">
                🚨 Please <strong>do not share this OTP</strong> with anyone. We prioritize your security.
            </p>

            <!-- Offers Section -->
            <div style="margin-top: 40px; background-color: #fef6f9; padding: 20px 20px; border-radius: 10px;">
                <h3 style="color: #e52e71; margin-top: 0;">🎁 Exclusive Offer Just for You!</h3>
                <p style="color: #333; font-size: 15px;">Enjoy a <strong>50% discount</strong> on our delicious Payasam products. Taste tradition like never before!</p>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="http://localhost:3000/" style="text-decoration: none;">
                        <button style="background-color: #e52e71; color: #fff; padding: 12px 28px; border: none; font-size: 16px; border-radius: 5px; cursor: pointer;">
                            Shop Now
                        </button>
                    </a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #999;">
            <p>Thank you for being with <strong>Payasam Products</strong>.</p>
            <p style="margin: 8px 0 0;">&copy; 2025 Payasam. All rights reserved.</p>
        </div>
    </div>
    `;
};

module.exports = MailUi;
