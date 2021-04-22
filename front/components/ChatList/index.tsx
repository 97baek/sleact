import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import React, { useCallback, forwardRef } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
  const onScroll = useCallback(
    (values) => {
      // 맨 위에 도달 시
      if (values.scrollTop === 0 && !isReachingEnd) {
        // 페이지(사이즈) 하나 추가
        console.log('페이지 가장 위');
        setSize((prevSize) => prevSize + 1).then(() => {
          // 스크롤 위치 유지
        });
      }
    },
    [isReachingEnd, setSize],
  );

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat}></Chat>
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
