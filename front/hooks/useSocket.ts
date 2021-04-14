import io from 'socket.io-client';
import { useCallback } from 'react';
import axios from 'axios';

const backUrl = 'http://localhost:3095';

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]); // 연결 끊기
  if (!workspace) {
    return [undefined, disconnect];
  }

  // 기존에 워크스페이스가 없으면 연결
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'], // 폴링 할 필요 없이 웹 소켓만 쓰라는 명령어
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
