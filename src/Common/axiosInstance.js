import axios from "axios";
import { Auth } from "aws-amplify";
import { Paypal_base_url } from './entity'

const axiosInstance = axios.create({
  baseURL: "https://fs9s2gn68b.execute-api.us-east-1.amazonaws.com/v1",
});

export const loginInstance = axios.create({
  baseURL: "https://jregg14del.execute-api.us-east-1.amazonaws.com/v1",
});

export const stripeInstance = axios.create({
  baseURL: "https://fs9s2gn68b.execute-api.us-east-1.amazonaws.com/v1"
})

export const postJob = axios.create({
  baseURL: "https://vuydnhyoe2.execute-api.us-east-1.amazonaws.com/v1"
})

export const PaypalInstance = axios.create({
  baseURL: Paypal_base_url,
})

// export const postJob =

const token = async () => {
  const tempToken = (await Auth.currentSession()).getIdToken().getJwtToken()
  return tempToken;
}

axiosInstance.interceptors.request.use(
  async function (config) {
    config.headers.common["token"] = await token();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


postJob.interceptors.request.use(
  async function (config) {
    config.headers.common["token"] = await token();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

stripeInstance.interceptors.request.use(
  async function (config) {
    config.headers.common["token"] = await token();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
