const { RegistrationDb, userExitsOrNot, loginData, verifyPassword, ProfileDataGet, insertCategory, insertSubCategory, fetchCategoryData, fetchSubCategoryDataDetails, insertProduct, insertProductweightprice, fetchProductData, ProductDataDetails, FetchUserDataDetails, UpdatedUserDetailsOfOtp, updateVerifyOtp, UserDataModule, ShippingUserDataModule, OrderModule, OrderDetailsModule, FetchOrderDetails, SearchDbDetails, FetchDataBasedOnSubCategoryFieldDetails, FetchGetCategorySubCategoryDetailsDbData } = require('../Model/Model')
const { Validation, order_userData_Validation } = require('./Validation')
const jwt = require('jsonwebtoken');
const JWT_SECRET = "your_secret_key";
const main = require("../Mail/mail");
const MailUi = require('../Mail/mailUi');
const RegistrationField = async (req, resp) => {

    try {
        const { first_name, last_name, phone_number, email, password, confirmPassword } = req.body;
        const errors = Validation({ first_name, last_name, phone_number, email, password, confirmPassword });
        if (errors.length > 0) {
            return resp.status(400).json({ errors });
        }
        if (password != confirmPassword) {
            return resp.status(400).json({ message: 'password and confirmPassword is dismatch.please check again!' });
        }
        const { phoneNumberExists, emailExists } = await userExitsOrNot(email, phone_number);
        if (phoneNumberExists) {
            return resp.status(400).json({ message: 'User with this phone number already exists' });
        }
        else if (emailExists) {
            return resp.status(400).json({ message: 'User with this email already exists' });
        }
        //otp
        const otp = Math.floor(Math.random() * 9000 + 1000);
        console.log("otpdata", otp);
        const userDetails = await RegistrationDb(first_name, last_name, phone_number, email, password, otp)

        const token = jwt.sign({ id: userDetails }, JWT_SECRET, { expiresIn: '1h' })
        const bodyContentData = MailUi(first_name, last_name, otp);
        main("payasamkarthik22@gmail.com", bodyContentData);
        resp.status(200).json({ message: "Registraion is Done", token })
    }
    catch (error) {
        console.error("Error in RegistrationField:", error);
        resp.status(500).json({ message: error.message });
    }
}
const LoginField = async (req, resp) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            const errors = [];

            if (!email) {
                errors.push('emailId is required.');
            }
            if (!password) {
                errors.push('password is required.');
            }

            return resp.status(400).json({ errors });
        }
        const user = await loginData(email);
        if (!user || user.length === 0) {
            return resp.status(404).json({ error: 'Email ID not found' });
        }
        const userDetails = user[0]
        console.log(userDetails);
        console.log(password);
        console.log("emailVerification", userDetails.verifiedOrNot)
        const verifyData = userDetails.verifiedOrNot;
        const first_name = userDetails.first_name;
        const last_name = userDetails.last_name;
        console.log("first,last,vefifydata", first_name, last_name, verifyData);
        if (verifyData == 0) {
            const otp = Math.floor(Math.random() * 9000 + 1000);
            const bodyContentData = MailUi(first_name, last_name, otp);
            main("payasamkarthik22@gmail.com", bodyContentData);
            await updateVerifyOtp(otp, userDetails.email)
        }
        const isPasswordMatch = verifyPassword(password, userDetails.password)
        console.log(isPasswordMatch);

        if (isPasswordMatch) {
            const token = jwt.sign({ id: userDetails.user_id }, JWT_SECRET, { expiresIn: '1h' });
            return resp.status(200).json({ message: 'Login successful', token, verifyData });
        }
        return resp.status(400).json({ error: 'Invalid password' });
    }
    catch (error) {
        console.error("Error in LoginField:", error);
        resp.status(500).json({ message: error.message });
    }
}
const ProfileField = async (req, resp) => {
    try {
        console.log({ user: req.user.id })
        const user_id = req.user.id
        const ProfileData = await ProfileDataGet(user_id)
        if (!ProfileData || ProfileData.length === 0) {
            return resp.status(404).json({ message: 'User not found' });
        }
        return resp.status(200).json({ ProfileDetails: ProfileData[0] });
    }
    catch (error) {
        console.error("Error:", error);
        return resp.status(500).json({ message: 'Server Error' });
    }

}

const categoryField = async (req, resp) => {
    const { imageName } = req.body
    const image = req.file.filename;
    console.log(image);
    console.log(imageName)
    const insertData = await insertCategory(imageName, image);
    return resp.status(200).json({ message: "inserted the data in category", insertData });
}
const SubcategoryField = async (req, resp) => {
    const { imageName, category_id } = req.body
    const image = req.file.filename;
    console.log(image);
    console.log(imageName)
    const insertData = await insertSubCategory(imageName, image, category_id);
    return resp.status(200).json({ message: "inserted the data in category", insertData });
}
const FetchSubCategoryData = async (req, resp) => {
    const { category_id } = req.query
    console.log(category_id);
    const SUbCategory = await fetchSubCategoryDataDetails(category_id);
    return resp.status(200).json({ message: "fetch the data in sub category", SUbCategory });
}
const FetchDataBasedOnSubCategoryField = async (req, resp) => {
    const { subcategory_id } = req.query
    console.log(subcategory_id);
    const SUbCategory = await FetchDataBasedOnSubCategoryFieldDetails(subcategory_id);
    return resp.status(200).json({ message: "fetch the data in sub category", SUbCategory });
}
const categoryDetailsField = async (req, resp) => {
    const categoryData = await fetchCategoryData();
    const categoryDataDetails = categoryData[0];
    return resp.status(200).json({ message: "fetch the data in category", categoryDataDetails });
}

const ProductDetailsField = async (req, resp) => {
    const { product_name, description, category_id } = req.body;
    const product_image = req.file.filename;
    const ProductData = await insertProduct(product_name, product_image, description, category_id);

    return resp.status(200).json({ message: "fetch the data in category", ProductData });
}
const ProductPriceWeightDetailsField = async (req, resp) => {
    const { product_id, weight_value, weight_unit, price, stock_quantity } = req.body;

    const ProductpriceData = await insertProductweightprice(product_id, weight_value, weight_unit, price, stock_quantity);

    return resp.status(200).json({ message: "fetch the data in category", ProductpriceData });
}
const FetchProductDetailsFiled = async (req, resp) => {
    const { category_id, sub_category_id, sort } = req.query
    const categoryData = await fetchProductData(category_id, sub_category_id, sort);
    const categoryDataDetails = categoryData;
    return resp.status(200).json({ message: "fetch the data in category", categoryDataDetails });
}
const FetchProductDataField = async (req, resp) => {
    const { product_id } = req.query
    const ProductData = await ProductDataDetails(product_id);

    return resp.status(200).json({ message: "fetch the data in category", ProductData });
}
const RegistrationBasedOnOtpFiled = async (req, resp) => {

    const { email, otp } = req.body;
    console.log("data", email)
    const userDetails = await FetchUserDataDetails(email, otp);
    if (userDetails.length > 0) {
        const userId = userDetails[0].user_id;
        const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' })
        return resp.status(200).json({ message: "fetch the data in from users", userDetails, token });
    }
    else {
        return resp.status(500).json({ message: "Invalid OTP" })
    }

}
const ResendOtpFiled = async (req, resp) => {
    const { email } = req.body
    const otp = Math.floor(Math.random() * 9000 + 1000);
    const updatedDetails = await UpdatedUserDetailsOfOtp(otp, email);
    const first_nameData = updatedDetails[0].first_name
    const last_nameData = updatedDetails[0].last_name
    const bodyContentData = MailUi(first_nameData, last_nameData, otp);
    main("payasamkarthik22@gmail.com", bodyContentData);

    return resp.status(200).json({ message: "updated data" });
}
const User_DataField = async (req, resp) => {
    const { country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id } = req.body
    const errors = order_userData_Validation({ country, firstname, lastname, address, city, state, pincode, phonenumber });
    if (errors.length > 0) {
        return resp.status(400).json({ errors });
    }
    const user_Details = await UserDataModule(country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id);
    return resp.status(200).json({ message: "inserted data" });
}
const Shipping_DataField = async (req, resp) => {
    const { country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id } = req.body
    const errors = order_userData_Validation({ country, firstname, lastname, address, city, state, pincode, phonenumber });
    if (errors.length > 0) {
        return resp.status(400).json({ errors });
    }
    const user_Details = await ShippingUserDataModule(country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id);
    return resp.status(200).json({ message: "inserted data" });
}
const OrderDataField = async (req, resp) => {
    const { totalAmount, shippingPrice, discount, netAmount } = req.body
    const orders = await OrderModule(totalAmount, shippingPrice, discount, netAmount);
    return resp.status(200).json({ message: "inserted data", orders });
}
const OrderDetailsField = async (req, resp) => {
    const { product_id, product_name, weight_of_product, price, qty, order_id, product_image } = req.body

    const orders = await OrderDetailsModule(product_id, product_name, weight_of_product, price, qty, order_id, product_image);
    return resp.status(200).json({ message: "inserted data" });
}
const CreateOrderField = async (req, resp) => {
    const user_id = req.user.id
    console.log("user_id", user_id);
    //user_data

    const { cart, user, shipping, netAmount, totalAmount, shippingPrice, discount } = req.body
    const orders = await OrderModule(totalAmount, shippingPrice, discount, netAmount);
    const { country, firstname, lastname, address, appartment, city, state, pincode, phonenumber } = user
    const user_Details = await UserDataModule(country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id, orders[0].insertId);
    console.log("user_details", user_Details);
    const shipping_Details = await ShippingUserDataModule(shipping.country, shipping.firstname, shipping.lastname, shipping.address, shipping.appartment, shipping.city, shipping.state, shipping.pincode, shipping.phonenumber, user_id, orders[0].insertId);
    console.log("shippingdetails", shipping.country);

    console.log("orders", orders[0].insertId);
    if (orders[0].insertId) {
        console.log(cart);
        for (const item of cart) {

            const { product_id, product_name, qty, selectedWeight: { price, weight_value, weight_unit }, product_image } = item

            console.log("product_image", product_image);
            const ordersDe = await OrderDetailsModule(product_id, product_name, weight_value, price, qty, orders[0].insertId, product_image, weight_unit);
            console.log("insideOrders", ordersDe)
        }
        return resp.status(200).json({ message: "inserted data", order_id: orders[0].insertId });
    } else {
        return resp.status(400).json({ message: "Error insert data" });
    }
}
const FetchOrderData = async (req, resp) => {
    const { Order_id } = req.params
    try {
        const OrderData = await FetchOrderDetails(Order_id);
        if (OrderData.length > 0) {
            return resp.status(200).json({ message: "fetch data", OrderData });
        }
        else {
            return resp.status(200).json({ message: "no data", OrderData });
        }
    }
    catch (err) {
        console.error("Error in RegistrationField:", err);
        resp.status(500).json({ message: err.message });
    }
}
const SearchDataDetails = async (req, resp) => {
    const { product_name } = req.query
    console.log("productname", product_name)
    try {
        const productData = await SearchDbDetails(product_name);
        return resp.status(200).json({ message: "fetch the data in category", productData });
    }
    catch (err) {
        console.error("Error in datafetch:", err);
        resp.status(500).json({ message: err.message });
    }

}
const FetchGetCategorySubCategoryDetails = async (req, resp) => {

    try {
        const CategoryData = await FetchGetCategorySubCategoryDetailsDbData();
        return resp.status(200).json({ message: "fetch the data in category", CategoryData });
    }
    catch (err) {
        console.error("Error in datafetch:", err);
        resp.status(500).json({ message: err.message });
    }

}

module.exports = { RegistrationField, LoginField, ProfileField, categoryField, SubcategoryField, FetchSubCategoryData, categoryDetailsField, ProductDetailsField, ProductPriceWeightDetailsField, FetchProductDetailsFiled, FetchProductDataField, RegistrationBasedOnOtpFiled, ResendOtpFiled, User_DataField, Shipping_DataField, OrderDataField, OrderDetailsField, CreateOrderField, FetchOrderData, SearchDataDetails, FetchDataBasedOnSubCategoryField, FetchGetCategorySubCategoryDetails }