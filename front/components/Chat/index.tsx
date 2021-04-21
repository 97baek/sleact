import React, { VFC, memo, useMemo } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import { IDM } from '@typings/db';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

interface Props {
  data: IDM;
}

const Chat: VFC<Props> = ({ data }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const user = data.Sender;

  // 컴포넌트 최적화를 위해 값을 기억시키는(캐싱) 함수인 useMemo 함수 사용
  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        // .은 모든 글자, +는 한 개 이상, ?는 0개나 1개 g는 모두 찾겠다는 의미. d는 숫자. +는 한개 이상 g가 없으면 하나만 찾기. n은 줄바꿈
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        // id나 줄바꿈을 보면 decorator 함수 내용으로 바꿈
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
          // id만 찾았을 때 매치되는 것이 있으면
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }
          // 줄바꿈을 찾았으면
          return <br key={index} />;
        },
      }),
    [data.content], // 해당 값 변경 시 캐싱 풀고 값을 다시 계산
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
