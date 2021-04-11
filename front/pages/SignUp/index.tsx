import React, { useState, useCallback } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Header, Form, Label, Input, Button, LinkContainer, Error, Success } from './styles';
import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

function SignUp() {
  const { data, error, revalidate } = useSWR('http://localhost:3095/api/users', fetcher);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useInput(false);
  const [signUpError, setSignUpError] = useInput('');
  const [signUpSuccess, setSignUpSuccess] = useInput(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck);
      setSignUpError(''); // 비동기 요청시엔 초기화 해주는 것이 좋음
      setSignUpSuccess(false);
      if (!mismatchError && nickname) {
        console.log('서버로 회원가입하기');
        axios
          .post('/api/users', {
            email,
            nickname,
            password,
          })
          .then((res) => {
            console.log(res);
            setSignUpSuccess(true);
          })
          .catch((err) => {
            console.log(err.response);
            setSignUpError(err.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );

  // 로딩화면 처리
  if (data === undefined) {
    return <div>Loading...</div>;
  }

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  // const [form, setForm] = useState({
  //   email: '',
  //   nickname: '',
  //   password: '',
  //   passwordCheck: '',
  // });
  // const { email, nickname, password, passwordCheck } = form;

  // const onChangeForm = useCallback(
  //   (e) => {
  //     const { value, name } = e.target;
  //     console.log(name);
  //     setForm({ ...form, [name]: value });
  //     if (name === 'password') {
  //       console.log(password, passwordCheck);
  //       setMisMatchError(value !== passwordCheck);
  //     }
  //     if (name === 'passwordCheck') {
  //       console.log(password, passwordCheck);
  //       setMisMatchError(value !== password);
  //     }
  //     console.log(mismatchError);
  //   },
  //   [form],
  // );

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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="passwordCheck"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
}

export default SignUp;
