import axios from 'axios';

// withCredentails는 백엔드와 프론트엔드 간 쿠키를 주고받기 위해 사용됨
// get에선 두번째 변수자리, post에선 세번째 변수자리에서 쓰임
const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((res) => res.data);

export default fetcher;
