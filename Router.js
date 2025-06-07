const express = require('express')
const Razorpay = require("razorpay")
const { upload } = require("./middlewares/multer")
const router = express.Router();
const { RegistrationData, LoginData, ProfileData, CategoryDataInsert, SubCategoryDataInsert, FetchSubCategory, CategoryDetails, FetchProductDetails, FetchProductData, RegistrationBasedOnOtp, ResendOtp, CreateOrder, OrderDetailsDataFetch, searchData, FetchDataBasedOnSubCategory, FetchGetCategorySubCategory, InsertionProduct, ordersData, usersData, ChartDataOrders
    , updateCategoryData, updateSubCategoryData, updateProductData, deleteProductData
} = require('./Controller/Controller');
const { AuthenticatedUser } = require('./middlewares/AuthenticatedUser');
router.post('/Registration', RegistrationData)
router.post("/basedonEmailOtp", RegistrationBasedOnOtp)
router.post('/Login', LoginData)

router.get('/ProfileData', AuthenticatedUser, ProfileData)


// router.post("/upload", upload.single('image'), (req, resp) => {
//     console.log(req.file);
// })
router.post("/insert/category", upload.single('category_image'), CategoryDataInsert)
router.post("/insert/sub_category", upload.single('sub_category_image'), SubCategoryDataInsert)
router.get("/getCategoryDetails", CategoryDetails)
// add productData
router.post("/insert/productData", upload.single('product_image'), InsertionProduct)
router.get("/fetch/AllproductDetailsbyCategory", FetchProductDetails)
router.get("/fetch/ProductData", FetchProductData)

router.put("/resendOtp", ResendOtp)

router.post("/createOrder", AuthenticatedUser, upload.single('product_image'), CreateOrder)
// router.put("/verifyOtp",Verify)

router.get("/order_Details/:Order_id", OrderDetailsDataFetch)
router.get("/searchItems", searchData)
router.get("/fetch/subcategories", FetchSubCategory)
router.get("/fetch/ProductDataBasedOnSubCategory", FetchDataBasedOnSubCategory)

//bargraph chart data orders
router.get("/chardatabyorders", ChartDataOrders)
//piechaert for the users

//payments
router.get("/fetch/getCategoryAndSubCategories", FetchGetCategorySubCategory)
//update category data
router.post("/updateCategory/:editId/:editName", updateCategoryData)
//updat and ddelte the sub_category
router.post("/updateSubCategory/:editId/:editName/:deleteId", updateSubCategoryData)
//update the productData
router.put("/updateProductData", updateProductData)
router.delete("/deleteProductData/:deleteId", deleteProductData)
//order data
router.get("/fetchorderdata", ordersData)
//userData
router.get("/usersData", usersData)

router.post('/ordersData', async (req, res) => {
    console.log("reqbody", req.body);
    const razorpay = new Razorpay({
        key_id: "rzp_test_wkbsiGSGRQ4eDs",
        key_secret: "W0cNmW2x3bGURsvLyhLl1p2E"
    })

    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "receipt#1",
        payment_capture: 1
    }

    try {
        const response = await razorpay.orders.create(options)
        console.log("payresponse", response);
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,

        })
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).send("Internal server error")
    }
})

router.get("/payment/:paymentId", async (req, res) => {
    const { paymentId } = req.params;
    console.log("payment", paymentId);

    const razorpay = new Razorpay({
        key_id: "rzp_test_wkbsiGSGRQ4eDs",
        key_secret: "W0cNmW2x3bGURsvLyhLl1p2E"
    })

    try {
        const payment = await razorpay.payments.fetch(paymentId)

        if (!payment) {
            return res.status(500).json("Error at razorpay loading")
        }
        console.log(payment);
        console.log("status", payment.status)
        res.json({
            status: payment.status,
            method: payment.method,
            amount: payment.amount / 100, //convert pise to rupee
            currency: payment.currency,
            description: payment.description,
            created_at: payment.created_at
        })
    } catch (error) {
        res.status(500).json("failed to fetch")
    }
})


module.exports = router