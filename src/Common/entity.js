export const RetrieveList = "";

// Provider
export const Provider_S3_image = "https://ipsdocuments.s3.amazonaws.com/Provider/photo/"
const getAllUsers = "/getallusers"
export const paymentEntity = "/stripepaymentadmin"
const postJob = '/postjob'

export const GetAllProviderSearchByName = "getallprovidersearchbyname"
export const GetPostJob = postJob

// Category
export const AddEditJobCategory = getAllUsers //"/addeditjobcategory"
export const GetAllJobCategory = getAllUsers // "/getalljobcategoryadmin"

// Products
export const GetAllProducts = getAllUsers // "/getallproducts"
export const AddEditProduct = getAllUsers // "/addeditproduct"
export const DeleteProduct = getAllUsers // "/deleteproduct"

// Orders
export const GetAllOrders = getAllUsers // "/getallordersadmin"
export const MarkOrderAsShipped = getAllUsers // "/markorderasshipped"

// Users
export const GetAllUsers = getAllUsers // GetAllUsers

// Customer Support
export const GetAllCustomerSupport = getAllUsers // "/getallcustomersupport"
export const GetAllDisputesAdmin = getAllUsers // "/getAllDisputesAdmin"
export const ResolveContactSupport = getAllUsers

// JObs
export const GetAllJobPostAdmin = getAllUsers // "/getalljobpostadmin"
export const JobPayment = getAllUsers // "/jobpaymenttoprovider"

export const commissionRate = getAllUsers
export const Paypal_base_url = "https://api-m.sandbox.paypal.com/v1" // "https://api-m." + (process.env.NODE_ENV === "development" ? "sandbox." : "") + "paypal.com/v1"
export const paypal_secret_id = process.env.REACT_APP_SECRET_ID //process.env.NODE_ENV === "development" ? process.env.REACT_APP_SECRET_ID : process.env.REACT_APP_LIVE_SECRET_ID//  app clientSecret
export const paypal_client_id = process.env.REACT_APP_CLIENT_ID // process.env.NODE_ENV === "development" ? process.env.REACT_APP_CLIENT_ID : process.env.REACT_APP_LIVE_CLIENT_ID //  app clientID

// sb-eadj43627647@business.example.com / hG%*M#7;
