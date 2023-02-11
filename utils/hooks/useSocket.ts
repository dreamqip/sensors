import useWebSocket from 'react-use-websocket';

export function useSocket(url: string) {
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => true,
  });

  return {
    sendMessage,
    lastMessage,
    readyState,
  };
}