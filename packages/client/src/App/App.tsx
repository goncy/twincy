import * as React from "react";
import SocketIO from "socket.io-client";
import {AnimatePresence, motion} from "framer-motion";

import styles from "./App.module.scss";

const socket = SocketIO("http://localhost:8002");

interface Message {
  message: string;
  sender: string;
  id: string;
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
          <span className={styles.sender} dangerouslySetInnerHTML={{__html: selected.sender}} />
          <span className={styles.message} dangerouslySetInnerHTML={{__html: selected.message}} />
        </motion.main>
      )}
    </AnimatePresence>
  );
};

export default App;
