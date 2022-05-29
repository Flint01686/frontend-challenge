import axios, { AxiosResponse } from 'axios'

export interface Cat {
  id: string, 
  url: string,
}

export const dataReq = axios.create({
  headers: { 'Content-Type': 'multipart/form-data', 'x-api-key': "8e2adcc4-7303-478f-b2e4-e0b323183047" },
})

export const getCats = (count = 20): Promise<AxiosResponse> => {
  return dataReq.get('https://api.thecatapi.com/v1/images/search', { params: { limit:count, size:"full" } } )
}
