import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
  });

  export const reissueToken = async () => {
    try {
      const response = await client.post('/reissue');
      const { status, headers } = response;
      if (status === 200) {
        const accessToken = headers['access'];
        localStorage.setItem("access", accessToken);
      }
    } catch (error) {
      return false;
    }
  };

  export const fetchProductDetails = async (productId) => {
    try {
      const response = await client.get(`/product/detail/${productId}`, {
        headers: {
          'access': localStorage.getItem('access')
        }
      });
      return response.data; // API 호출 결과 반환
    } catch (error) {
      throw error; // 오류 발생 시 예외를 던짐
    }
  };
  

  export default client;