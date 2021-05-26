import * as React from "react";
import SocketIO from "socket.io-client";

import Message from "~/Message";
import {Message as IMessage} from "~/types";

import styles from "./App.module.scss";

const socket = SocketIO("http://localhost:8002");

const App: React.FC = () => {
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [selected, setSelected] = React.useState<null | IMessage>(null);
  const [bookmark, setBookmark] = React.useState<null | IMessage>(null);
  const [queue, setQueue] = React.useState<IMessage[]>([]);

  function handleToggleSelected(message: IMessage) {
    socket.emit("select", selected?.id === message.id ? null : message);
  }

  function handleToggleQueue(message: IMessage) {
    setQueue((queue) =>
      queue.find((_message) => _message.id === message.id)
        ? queue.filter((_message) => _message.id !== message.id)
        : queue.concat(message),
    );
  }

  function handleToggleBookmark(message: IMessage) {
    setBookmark((bookmark) => (bookmark?.id === message.id ? null : message));
  }

  React.useEffect(() => {
    socket.on("message", (message: IMessage) =>
      setMessages((messages) => messages.concat(message)),
    );
    socket.on("select", (message: IMessage) => setSelected(message));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className={styles.container}>
      <section className={styles.messages}>
        {messages.map((message) => {
          const isSelected = selected?.id === message.id;

          return (
            <>
              <Message
                key={message.id}
                color={message.color}
                message={message.message}
                sender={message.sender}
                variant={
                  isSelected
                    ? "blue"
                    : queue.find((_message) => _message.id === message.id)
                    ? "yellow"
                    : message.isHighlighted
                    ? "green"
                    : "normal"
                }
                onClick={({ctrlKey, altKey}) =>
                  ctrlKey
                    ? handleToggleQueue(message)
                    : altKey
                    ? handleToggleBookmark(message)
                    : handleToggleSelected(message)
                }
              />
              {bookmark?.id === message.id && <hr className={styles.bookmark} />}
            </>
          );
        })}
      </section>
      {Boolean(queue.length) && (
        <section className={styles.queue}>
          {queue.map((message) => {
            const isSelected = selected?.id === message.id;

            return (
              <Message
                key={message.id}
                color={message.color}
                message={message.message}
                sender={message.sender}
                variant={isSelected ? "blue" : "normal"}
                onClick={(event) =>
                  event.ctrlKey ? handleToggleQueue(message) : handleToggleSelected(message)
                }
              />
            );
          })}
        </section>
      )}
    </main>
  );
};

export default App;
