import axios, { postJob } from '../Common/axiosInstance'

export function postData(endpoint, data) {
  return axios.post(endpoint, data)
}

export function getData(endpoint) {
  return axios.get(endpoint)
}

export function getPostJobs(endpoint, data) {
  return postJob.post(endpoint, data)
}

export function deleteData(endpoint, id) {
  return axios.delete(endpoint + "?id=" + id)
}

