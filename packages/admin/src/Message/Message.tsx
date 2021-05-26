import React from "react";

import styles from "./Message.module.scss";

interface Props {
  variant: "blue" | "yellow" | "green" | "normal";
  onClick?: React.MouseEventHandler<HTMLElement>;
  sender: string;
  message: string;
  color: string;
}

const Message: React.FC<Props> = ({variant, onClick, color, message, sender}) => {
  return (
    <article
      className={`${styles.container} ${styles[variant]}`}
      style={{cursor: onClick ? "pointer" : "inherit"}}
      onClick={(event) => onClick && onClick(event)}
    >
      <span
        dangerouslySetInnerHTML={{__html: sender}}
        className={styles.sender}
        style={{color: variant !== "normal" ? "white" : color}}
      />
      <span dangerouslySetInnerHTML={{__html: message}} className={styles.message} />
    </article>
  );
};

export default Message;
