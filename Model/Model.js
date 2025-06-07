const bcrypt = require("bcrypt")

const mysql = require('../utils/dbConfig');
const { resolve } = require("path");
const RegistrationDb = async (first_name, last_name, phone_number, email, password, otp) => {
    try {
        console.log("otp", otp);
        const query = `INSERT INTO users (first_name, last_name, phone_number, email, password,otp) values(?,?,?,?,?,?) `;

        const hashpassword = await bcrypt.hash(password, 10);
        const RegistrationDetails = await mysql.query(query, [first_name, last_name, phone_number, email, hashpassword, otp]);
        console.log("registrationDetails.." + RegistrationDetails[0].insertId)
        return RegistrationDetails[0].insertId;
    }
    catch (err) {
        throw err;
    }
}

const userExitsOrNot = async (email, phone_number) => {
    try {
        // Prepare queries to check for email and phone number separately
        const emailQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        const phoneQuery = 'SELECT COUNT(*) AS count FROM users WHERE phone_number = ?';

        // Execute both queries concurrently
        const [phoneResult] = await mysql.query(phoneQuery, [phone_number]);
        const [emailResult] = await mysql.query(emailQuery, [email]);
        console.log(emailResult)


        // Check if email or phone number exists
        console.log(emailResult[0])
        const phoneNumberExists = phoneResult[0].count > 0;
        const emailExists = emailResult[0].count > 0;


        return { emailExists, phoneNumberExists };
    } catch (error) {
        throw error;
    }
}
const loginData = async (email) => {
    try {
        const query = 'SELECT * FROM users where email= ?';
        const [rows] = await mysql.query(query, [email]);
        return rows;
    } catch (error) {
        throw error;
    }
};
const verifyPassword = (password, hashpassword) => {
    const result = bcrypt.compareSync(password, hashpassword);
    console.log("Password Match Result:", result); // Debug output
    return result;

}
const ProfileDataGet = async (userId) => {
    try {
        const ProdileData = 'SELECT * FROM users where user_Id= ?';

        const Profiledetails = await mysql.query(ProdileData, [userId]);
        console.log(Profiledetails);
        return Profiledetails[0];
    }
    catch (err) {
        throw err;
    }
}
const insertCategory = async (category_name, category_image, description) => {
    try {
        console.log("description", description)
        const insertQuery = 'INSERT INTO categories (name, image_url,description) VALUES (?,?,?)';

        const Categorydetails = await mysql.query(insertQuery, [category_name, category_image, description]);
        console.log("dbdata" + Categorydetails);
        return Categorydetails[0];
    }
    catch (err) {
        throw err;
    }
}
const insertSubCategory = async (imageName, image, category_id) => {
    try {
        console.log("data")
        const insertQuery = 'INSERT INTO sub_category (name, image_url,category_id) VALUES (?, ?,?)';

        const Categorydetails = await mysql.query(insertQuery, [imageName, image, category_id]);
        console.log("dbdata" + Categorydetails);
        return Categorydetails[0];
    }
    catch (err) {
        throw err;
    }
}
const fetchSubCategoryDataDetails = async (category_id) => {
    try {

        const selectQuery = 'select * from sub_category where category_id=?';

        const Categorydetails = await mysql.query(selectQuery, [category_id]);

        return Categorydetails[0];
    }
    catch (err) {
        throw err;
    }
}
const FetchDataBasedOnSubCategoryFieldDetails = async (subcategory_id) => {
    try {

        const selectQuery = 'select * from product where subcategory_id=?';

        const Categorydetails = await mysql.query(selectQuery, [subcategory_id]);

        return Categorydetails[0];
    }
    catch (err) {
        throw err;
    }
}
const fetchCategoryData = async () => {
    try {

        const selectQuery = 'select * from categories';

        const Categorydetails = await mysql.query(selectQuery);

        return Categorydetails;
    }
    catch (err) {
        throw err;
    }
}
const insertProduct = async (product_name, product_image, description, category_id, weights) => {

    try {
        console.log("data")
        const insertQuery = 'INSERT INTO product (product_name, product_image, description, category_id) VALUES (?, ?,?,?)';


        const [Productdetails] = await mysql.query(insertQuery, [product_name, product_image, description, category_id]);
        const productId = Productdetails.insertId
        for (let w of weights) {
            const insertQuery = 'INSERT INTO product_weight (product_id, weight_value, weight_unit, price, stock_quantity) VALUES (?, ?,?,?,?)';

            const Productpricedetails = await mysql.query(insertQuery, [productId, w.weight_value, w.weight_unit, w.price, w.stock_quantity]);
        }
        return productId;
    }
    catch (err) {
        throw err;
    }
}

const fetchProductData = async (category_id, subcategory_id, sort = 'asc') => {
    try {
        // const query = 'SELECT p.product_name,p.product_image,p.description,pw.weight_value,pw.weight_unit,pw.price FROM product p JOIN product_weight pw ON p.product_id = pw.product_id WHERE p.category_id = ?;'

        console.log("data", category_id, subcategory_id, sort)
        let query;
        if (subcategory_id) {
            query = 'select p.product_id,p.product_name,p.product_image,p.description,max(w.price) as price,created_at from product p join  product_weight w on p.product_id=w.product_id WHERE p.category_id = ? and  p.subcategory_id = ? group by w.product_id order by price ' + sort

        } else {
            query = 'select p.product_id, p.product_name, p.product_image,p.description,MAX(w.price) as price,created_at from product p JOIN product_weight w ON p.product_id = w.product_id WHERE p.category_id = ? group by p.product_id order by price ' + sort
        }
        return new Promise(async resolve => {
            let [rows, q] = await mysql.query(query, [category_id, subcategory_id]) //.then(async ([rows]) => {
            console.log({ q })
            const c = await Promise.allSettled(rows.map(async r => {
                const query2 = 'SELECT pw.weight_id,pw.weight_value,pw.weight_unit,pw.price FROM product_weight pw WHERE pw.product_id = ? order by pw.price ' + sort
                let [w] = await mysql.query(query2, [r.product_id]);
                r['weights'] = w
                return r
            }))


            resolve(c.map(d => d.value));

        })


    } catch (error) {
        throw error;
    }
};
const ProductDataDetails = async (product_id) => {

    try {
        let query1 = "select product_id,product_name,product_image,description from product where product_id=?"


        return new Promise(async resolve => {
            let [rows] = await mysql.query(query1, [product_id]); //.then(async ([rows]) => {

            const c = await Promise.allSettled(rows.map(async r => {
                const query2 = 'SELECT pw.weight_id,pw.weight_value,pw.weight_unit,pw.price FROM product_weight pw WHERE pw.product_id = ?;'

                let [w] = await mysql.query(query2, [r.product_id]);
                r['weights'] = w
                return r
            }))
            resolve(c.map(d => d.value));
        })
    }
    catch (err) {
        throw err;
    }
}
const FetchUserDataDetails = async (email, otp) => {
    try {
        const query = 'SELECT user_id,email,otp FROM users where email= ? and otp=?';
        const [rows] = await mysql.query(query, [email, otp]);
        if (rows.length > 0) {
            const update = 'UPDATE users SET verifiedOrNot = ? WHERE email = ?';
            await mysql.query(update, [true, email]);
        }
        return rows;
    } catch (error) {
        throw error;
    }
};
const UpdatedUserDetailsOfOtp = async (otp, email) => {
    try {
        const query = 'SELECT first_name,last_name FROM users where email= ? ';
        const [rows] = await mysql.query(query, [email]);
        const updateQuery = 'update users set otp=? where email=?';
        await mysql.query(updateQuery, [otp, email]);
        return rows;
    } catch (error) {
        throw error;
    }
};
const updateVerifyOtp = async (otp, email) => {
    try {
        const updateQuery = 'update users set otp=? where email=?';
        const data = await mysql.query(updateQuery, [otp, email]);
        return data;

    } catch (error) {
        throw error;
    }
};
const UserDataModule = async (country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id, order_id) => {
    try {
        const insertQuery = 'insert into order_user_details(country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id,order_id) values(?,?,?,?,?,?,?,?,?,?,?)';
        const data = await mysql.query(insertQuery, [country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id, order_id]);
        return data;

    } catch (error) {
        throw error;
    }
}
const ShippingUserDataModule = async (country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id, order_id) => {
    try {
        const insertQuery = 'insert into billing_details(country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id,order_id) values(?,?,?,?,?,?,?,?,?,?,?)';
        const data = await mysql.query(insertQuery, [country, firstname, lastname, address, appartment, city, state, pincode, phonenumber, user_id, order_id]);
        return data;

    } catch (error) {

        throw error;
    }
}
const OrderModule = async (totalAmount, shippingPrice, discount, netAmount) => {
    try {
        const insertQuery = 'insert into orders(totalAmount, shippingPrice, discount, netAmount) values(?,?,?,?)';
        const data = await mysql.query(insertQuery, [totalAmount, shippingPrice, discount, netAmount]);
        return data;

    } catch (error) {

        throw error;
    }
}
const OrderDetailsModule = async (product_id, product_name, weight_of_product, price, qty, order_id, product_image, weight_unit) => {
    try {
        const insertQuery = 'insert into order_details(product_id,product_name,weight_of_product,price,qty,order_id,product_image,weight_unit) values(?,?,?,?,?,?,?,?)';
        const data = await mysql.query(insertQuery, [product_id, product_name, weight_of_product, price, qty, order_id, product_image, weight_unit]);
        return data;

    } catch (error) {

        throw error;
    }
}


const FetchOrderDetails = async (order_id) => {
    try {
        const order_data = "SELECT * FROM orders WHERE id = ?"
        const cart_fetch = "SELECT * FROM order_details WHERE order_id = ?";
        const user_fetch = "SELECT * FROM order_user_details WHERE order_id = ?";
        const billing_fetch = "SELECT * FROM billing_details WHERE order_id = ?";
        const orderData = await mysql.query(order_data, [order_id]);
        const cartData = await mysql.query(cart_fetch, [order_id]);
        const userData = await mysql.query(user_fetch, [order_id]);
        const billingData = await mysql.query(billing_fetch, [order_id]);

        return {
            order: orderData[0],
            cart: cartData[0],
            user: userData[0],
            billing: billingData[0]
        };
    } catch (err) {
        throw err;
    }
};
const SearchDbDetails = async (product_name) => {
    try {
        let query1 = "select product_id,product_name,product_image,description from product where product_name like ?"
        return new Promise(async resolve => {
            let [rows] = await mysql.query(query1, [`%${product_name}%`]); //.then(async ([rows]) => {

            const c = await Promise.allSettled(rows.map(async r => {
                const query2 = 'SELECT pw.weight_id,pw.weight_value,pw.weight_unit,pw.price FROM product_weight pw WHERE pw.product_id = ?;'

                let [w] = await mysql.query(query2, [r.product_id]);
                r['weights'] = w
                return r
            }))
            resolve(c.map(d => d.value));
        })
    }
    catch (err) {
        throw err;
    }
}
const FetchGetCategorySubCategoryDetailsDbData = async () => {
    const query = 'select * from categories';
    return new Promise(async resolve => {
        let [rows] = await mysql.query(query);
        const c = await Promise.allSettled(rows.map(async r => {
            const query2 = 'select * from sub_category where category_id=?;'
            let [w] = await mysql.query(query2, [r.category_id]);
            r['subCategory'] = w
            return r
        }))
        resolve(c.map(d => d.value));

    })
}
const OrderDataAdmin = async () => {
    try {
        const query = 'select * from orders';
        return new Promise(async resolve => {
            let [rows] = await mysql.query(query);
            const c = await Promise.allSettled(rows.map(async r => {
                const query2 = 'select * from order_user_details where order_id=?;'
                let [order_user_details] = await mysql.query(query2, [r.id]);
                r['order_user_Details'] = order_user_details
                const query3 = 'select * from billing_details where order_id=?;'
                let [billing_details] = await mysql.query(query3, [r.id]);
                r['billing_details'] = billing_details
                const query4 = 'select * from order_details where order_id=?;'
                let [order_details] = await mysql.query(query4, [r.id]);
                r['order_details'] = order_details

                return r

            }))
            resolve(c.map(d => d.value));

        })
    } catch (error) {
        throw error;
    }
}
const UserDataAdmin = async () => {
    try {

        const selectQuery = 'select * from users';

        const usersdetails = await mysql.query(selectQuery);

        return usersdetails;
    }
    catch (err) {
        throw err;
    }
}
const ChartDataOrdersDetails = async () => {
    try {
        const selectQuery = "SELECT SUM(totalAmount) as total, DATE(createdAt) as c_date FROM vellanki_db.orders group by c_date;"
        const sele = "select COUNT(u.user_id) AS user_count,role_name from users u right join roles r on (u.role_id=r.role_id) group by r.role_id"
        const userOrders = await mysql.query(selectQuery);

        const usersdetailsdata = await mysql.query(sele);
        return {
            userOrders: userOrders[0], usersdetailsdata: usersdetailsdata[0]
        }
    }
    catch (err) {
        throw err;
    }

}
const updateCategoryDataModel = async (editId, editName) => {
    const query1 = "update categories set name=? where category_id=?"
    await mysql.query(query1, [editName, editId])
    return "updated the data"
}
const updateSubCategoryDataModel = async (editId, editName, deleteId) => {
    if (parseInt(deleteId)) {

        const query1 = "delete from sub_category where subcategory_id=?"
        await mysql.query(query1, [deleteId])
        return "deelted the data"
    }
    else {
        const query1 = "update sub_category set name=? where subcategory_id=?"
        await mysql.query(query1, [editName, editId])
        return "updated the data"
    }
}
const updateProductDataFieldsModel = async (product_id, product_name, description, weights) => {
    try {
        const queryData = "update product set product_name=? ,description=? where product_id=?"

        await mysql.query(queryData, [product_name, description, product_id]);
        await Promise.all(weights.map(async ({ weight_id, weight_value, weight_unit, price }) => {
            const query2 = "UPDATE product_weight SET weight_value = ?, weight_unit = ?, price = ? WHERE product_id = ? AND weight_id = ?";
            await mysql.query(query2, [weight_value, weight_unit, price, product_id, weight_id]);
        }))
        return "Product and weights updated successfully";
    }
    catch (err) {
        throw err;
    }

}
const deleteProductDataFieldsModel = async (deleteId) => {
    const query3 = "delete from order_details where product_id=?"
    await mysql.query(query3, [deleteId]);
    console.log("deleteId", deleteId)
    const query2 = "delete from product_weight where product_id=?"
    await mysql.query(query2, [deleteId]);
    const query = "delete from product where product_id=?"

    await mysql.query(query, [deleteId]);

    return "deleted successfully"
}
module.exports = { RegistrationDb, userExitsOrNot, loginData, verifyPassword, ProfileDataGet, insertCategory, insertSubCategory, fetchCategoryData, fetchSubCategoryDataDetails, insertProduct, fetchProductData, ProductDataDetails, FetchUserDataDetails, UpdatedUserDetailsOfOtp, updateVerifyOtp, UserDataModule, ShippingUserDataModule, OrderModule, OrderDetailsModule, FetchOrderDetails, SearchDbDetails, FetchDataBasedOnSubCategoryFieldDetails, FetchGetCategorySubCategoryDetailsDbData, OrderDataAdmin, UserDataAdmin, ChartDataOrdersDetails, updateCategoryDataModel, updateSubCategoryDataModel, updateProductDataFieldsModel, deleteProductDataFieldsModel }