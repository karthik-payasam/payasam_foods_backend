const { RegistrationField, LoginField, ProfileField, categoryField, SubcategoryField, FetchSubCategoryData, categoryDetailsField, FetchProductDetailsFiled, FetchProductDataField,
    RegistrationBasedOnOtpFiled, ResendOtpFiled, CreateOrderField, FetchOrderData, SearchDataDetails,
    FetchDataBasedOnSubCategoryField, FetchGetCategorySubCategoryDetails, ProductInsertionield, OrderDataFields, UserDataFields, ChartDataOrdersField, updateCategoryDataField, updateSubCategoryDataField, updateProductDataFields, deleteProductDataFields } = require('../Services/Service')
const RegistrationData = async (req, resp) => {
    try {
        await RegistrationField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const LoginData = async (req, resp) => {
    try {
        return await LoginField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const ProfileData = async (req, resp) => {
    try {
        return await ProfileField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}

const CategoryDataInsert = async (req, resp) => {
    try {
        return await categoryField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const SubCategoryDataInsert = async (req, resp) => {
    try {
        return await SubcategoryField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const FetchSubCategory = async (req, resp) => {
    try {
        return await FetchSubCategoryData(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const CategoryDetails = async (req, resp) => {
    try {
        return await categoryDetailsField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const InsertionProduct = async (req, resp) => {
    try {
        return await ProductInsertionield(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}


const FetchProductDetails = async (req, resp) => {
    try {
        return await FetchProductDetailsFiled(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const FetchDataBasedOnSubCategory = async (req, resp) => {
    try {
        return await FetchDataBasedOnSubCategoryField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const FetchProductData = async (req, resp) => {
    try {
        return await FetchProductDataField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const RegistrationBasedOnOtp = async (req, resp) => {
    try {
        return await RegistrationBasedOnOtpFiled(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}

const ResendOtp = async (req, resp) => {
    try {
        return await ResendOtpFiled(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}


const CreateOrder = async (req, resp) => {
    try {
        return await CreateOrderField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const OrderDetailsDataFetch = async (req, resp) => {
    try {
        return await FetchOrderData(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const searchData = async (req, resp) => {
    try {
        return await SearchDataDetails(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const FetchGetCategorySubCategory = async (req, resp) => {
    try {
        return await FetchGetCategorySubCategoryDetails(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}//test
const ordersData = async (req, resp) => {
    try {
        return await OrderDataFields(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const usersData = async (req, resp) => {
    try {
        return await UserDataFields(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const ChartDataOrders = async (req, resp) => {
    try {
        return await ChartDataOrdersField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
const updateCategoryData = async (req, resp) => {
    try {
        return await updateCategoryDataField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }

}
const updateSubCategoryData = async (req, resp) => {
    try {
        return await updateSubCategoryDataField(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }

}
const updateProductData = async (req, resp) => {
    try {
        return await updateProductDataFields(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }

}
const deleteProductData = async (req, resp) => {
    try {
        return await deleteProductDataFields(req, resp)
    }
    catch (err) {
        resp.status(500).json({ message: err.message })

    }
}
module.exports = { RegistrationData, LoginData, ProfileData, CategoryDataInsert, SubCategoryDataInsert, FetchSubCategory, CategoryDetails, InsertionProduct, FetchProductDetails, FetchProductData, RegistrationBasedOnOtp, ResendOtp, CreateOrder, OrderDetailsDataFetch, searchData, FetchDataBasedOnSubCategory, FetchGetCategorySubCategory, ordersData, usersData, ChartDataOrders, updateCategoryData, updateSubCategoryData, updateProductData, deleteProductData }