import * as commonAction from "../../Utils/commonActions";
import * as httpUtils from "../../Utils/httpUtils";
import * as actionTypes from '../../Common/actionTypes'
import S3 from 'aws-s3';
import { PaypalInstance } from '../../Common/axiosInstance'

// S3 configuration
const config = {
  bucketName: process.env.REACT_APP_PRODUCT_BUCKET,
  dirName: process.env.REACT_APP_PRODUCT_FOLDER,
  accessKeyId: process.env.REACT_APP_ACCESS_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  s3Url: `https://${process.env.REACT_APP_PRODUCT_BUCKET}.s3.amazonaws.com`,
}
const ReactS3Client = new S3(config)

// Post All Data
export function postAll(endpoint, data, entity, showSnackbar = false, showLoader = true) {

  return async function (dispatch) {
    showLoader && dispatch(commonAction.SetLoader(true));
    return httpUtils.postData(endpoint, data)
      .then((response) => {
        showLoader && dispatch(commonAction.SetLoader(false));
        if (response.data.statuscode === 200) {
          dispatch(commonAction.SetData({ payload: response.data, entity: entity }));
        }
        showSnackbar && dispatch(commonAction.setredux(response.data.message, 'success_message', actionTypes.SUCCESS_MESSAGE))
      })
      .catch((error) => {
        showLoader && dispatch(commonAction.SetLoader(false));
        dispatch(commonAction.SetData({ payload: error.response?.data, entity: entity }));
        showSnackbar && dispatch(commonAction.setredux(error.response?.message || "network error", 'error_message', actionTypes.ERROR_MESSAGE))
      });
  };
}

// Get All Data
export function getAll(endpoint, entity) {
  return async function (dispatch) {
    dispatch(commonAction.SetLoader(true));
    return httpUtils.getData(endpoint)
      .then((response) => {
        dispatch(commonAction.SetLoader(true));
        dispatch(commonAction.SetData({ payload: response.data, entity: entity }));
      })
      .catch((error) => {
        dispatch(commonAction.SetLoader(false));
        dispatch(commonAction.setredux(error.response.message, 'error_message', actionTypes.ERROR_MESSAGE))
      });
  };
}

// Delete All Data
export function deleteAll(endpoint, id, entity) {
  return async function (dispatch) {
    dispatch(commonAction.SetLoader(true));
    return httpUtils
      .deleteData(endpoint, id)
      .then((response) => {
        dispatch(commonAction.SetLoader(false));
        dispatch(commonAction.SetData({ payload: response.data, entity: entity }));
        dispatch(commonAction.setredux(response.data.message, 'success_message', actionTypes.SUCCESS_MESSAGE))
      })
      .catch((error) => {
        dispatch(commonAction.SetLoader(false));
        dispatch(commonAction.setredux(error.response.message, 'error_message', actionTypes.ERROR_MESSAGE))
      });
  };
}

// To Upload product image to s3
export function imageUplaodToS3(image, Uploaded_product_image_s3 = [], file_name = "") {
  let uploaded_resp = Uploaded_product_image_s3
  return function (dispatch) {
    dispatch(commonAction.SetLoader(true));
    return new Promise(async (resolve, reject) => {
      if (!image.length) {
        dispatch(commonAction.SetLoader(false));
        return resolve([])
      }
      await image.map((item) => {
        const ReactS3Client = new S3(Object.assign({}, config, { region: process.env.REACT_APP_REGION }))
        ReactS3Client.uploadFile(item, file_name).then(data => {
          uploaded_resp.push(data)
          Uploaded_product_image_s3 && dispatch(commonAction.setredux(uploaded_resp, 'Uploaded_product_image_s3'))
          if (uploaded_resp.length === image.length) {
            dispatch(commonAction.SetLoader(false));
            resolve(uploaded_resp);
          }
        }
        ).catch((error) => {
          dispatch(commonAction.setredux('Error in Image upload', 'error_message', actionTypes.ERROR_MESSAGE));
          dispatch(commonAction.SetLoader(false));
          reject(error);
        })
      })
    })
  }
}

// to delete product image from s3
export const deleteImageFromS3 = (files) => {
  let deleted_resp = []
  return function (dispatch) {
    return new Promise(async (resolve, reject) => {
      dispatch(commonAction.SetLoader(true));
      if (!files.length) {
        dispatch(commonAction.SetLoader(false));
        return resolve([]);
      }
      await files.map((file) => {
        let fileName = file.split("/")
        fileName = fileName[fileName.length - 1]
        ReactS3Client.deleteFile(fileName)
          .then(response => {
            deleted_resp.push(response)
            dispatch(commonAction.SetLoader(false));
            if (deleted_resp.length === files.length) { resolve(response); }
          })
          .catch(error => {
            dispatch(commonAction.SetLoader(false));
            dispatch(commonAction.setredux('Error in Image deletion', 'error_message', actionTypes.ERROR_MESSAGE));
            reject(error)
          })
      })
    })
  }
}

export const payPalTransaction = (props) => {
  return async function (dispatch) {
    dispatch(commonAction.SetLoader(true));
    return PaypalInstance({
      url: props.url,
      method: props.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": props.token
      },
      data: props.data
    })
  }
}
