import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useInput from '@hooks/useInput';
import { Header, Form, Label, Input, Button, LinkContainer, Error, Success } from '@pages/SignUp/styles';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

function Login() {
  // fetcher는 주소를 넘겨주는 역할. 어떻게 처리할지 구현해야 함
  // mutate는 서버에 요청을 보내지 않고 기존에 가지고 있던 데이터를 가지고 수정
  // revalidate는 서버에 요청을 보내 데이터 저장
  const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000, // 캐시의 유지기간. 이 기간 내에는  요청을 보내지 않고 캐시에서 불러옴.
  });
  const [loginError, setLoginError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  // console.log(email, password);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLoginError(false);
      axios
        .post('/api/users/login', { email, password }, { withCredentials: true })
        .then((res) => {
          // 두번째 매개변수 shouldRevalidate가 true면 Optimistic UI.
          // 실제로 요청을 보내기도 전에 사용자에게는 요청이 성공한 것 처럼 보여주게 함
          mutate(res.data, false);
        })
        .catch((error) => {
          setLoginError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  // 로딩화면 처리
  if (data === undefined) {
    return <div>Loading...</div>;
  }

  // 정보가 들어있으면(로그인 성공 시) 채널 페이지로 리다이렉트
  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {loginError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
}

export default Login;
