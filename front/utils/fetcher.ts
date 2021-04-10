import axios from 'axios';

// withCredentails는 get에선 두번째 변수자리, post에선 세번째 변수자리에서 쓰임
const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((res) => res.data);

export default fetcher;
