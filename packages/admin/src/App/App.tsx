import * as React from "react";
import SocketIO from "socket.io-client";

import Message from "~/Message";
import {Message as IMessage} from "~/types";

import styles from "./App.module.scss";

const socket = SocketIO("http://localhost:8002");

const App: React.FC = () => {
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [selected, setSelected] = React.useState<null | IMessage["id"]>(null);
  const [bookmark, setBookmark] = React.useState<null | IMessage["id"]>(null);
  const [queue, setQueue] = React.useState<IMessage["id"][]>([]);

  function handleToggleSelected(message: IMessage) {
    socket.emit("select", selected === message.id ? null : message);
  }

  function handleToggleQueue(id: IMessage["id"]) {
    setQueue((queue) =>
      queue.includes(id) ? queue.filter((_id) => _id !== id) : queue.concat(id),
    );
  }

  function handleToggleBookmark(id: IMessage["id"]) {
    setBookmark((_id) => (_id === id ? null : id));
  }

  React.useEffect(() => {
    socket.on("message", (message: IMessage) =>
      setMessages((messages) => messages.concat(message)),
    );
    socket.on("select", (message: IMessage) => setSelected(message?.id));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className={styles.container}>
      <section className={styles.messages}>
        {messages.map((message) => {
          const isSelected = selected === message.id;

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
                    : queue.includes(message.id)
                    ? "yellow"
                    : message.isHighlighted
                    ? "green"
                    : "normal"
                }
                onClick={({ctrlKey, altKey}) =>
                  ctrlKey
                    ? handleToggleQueue(message.id)
                    : altKey
                    ? handleToggleBookmark(message.id)
                    : handleToggleSelected(message)
                }
              />
              {bookmark === message.id && (
                <hr className={styles.bookmark} onClick={() => setBookmark(null)} />
              )}
            </>
          );
        })}
      </section>
      {Boolean(queue.length) && (
        <section className={styles.queue}>
          {messages
            .filter((message) => queue.includes(message.id))
            .map((message) => {
              const isSelected = selected === message.id;

              return (
                <Message
                  key={message.id}
                  color={message.color}
                  message={message.message}
                  sender={message.sender}
                  variant={isSelected ? "blue" : "normal"}
                  onClick={(event) =>
                    event.ctrlKey ? handleToggleQueue(message.id) : handleToggleSelected(message)
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
