import * as React from "react";
import SocketIO from "socket.io-client";
import {AnimatePresence, motion} from "framer-motion";

import styles from "./App.module.scss";

const socket = SocketIO(process.env.NODE_ENV === "production" ? "/" : "http://localhost:8000");

interface Message {
  id: string;
  sender: {
    badges: string[];
    name: string;
  };
  timestamp: number;
  message: string;
  color: string;
  isHighlighted: boolean;
}

const App: React.FC = () => {
  const [selected, setSelected] = React.useState<null | Message>(null);

  React.useEffect(() => {
    socket.on("select", (message: Message) => setSelected(message));
  }, []);

  return (
    <AnimatePresence>
      {selected && (
        <motion.main
          animate={{scale: 1}}
          className={styles.container}
          exit={{scale: 0}}
          initial={{scale: 0}}
        >
          <div className={styles.sender}>
            {Boolean(selected.sender.badges?.length) && (
              <span>
                {selected.sender.badges?.map((badge) => (
                  <img key={badge} src={badge} />
                ))}
              </span>
            )}
            <span dangerouslySetInnerHTML={{__html: selected.sender.name}} />
          </div>
          <span className={styles.message} dangerouslySetInnerHTML={{__html: selected.message}} />
        </motion.main>
      )}
    </AnimatePresence>
  );
};

export default App;
