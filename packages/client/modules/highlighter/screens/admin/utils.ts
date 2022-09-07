import type {Message} from "./types";
import type {EventMessage} from "~/types";

export function parseMessage(event: EventMessage): Message {
  // Store the draft message
  let text = event.message;

  // Check if the message is a question
  const isQuestion = text.startsWith("!q ");

  // Check if user bought a prize
  const isPrize = event.tags["msg-id"] === "highlighted-message";

  // Check if the user tagged you
  const isTag = text.toLowerCase().includes(event.channel);

  // If is a question, strip the command
  if (isQuestion) {
    text = text.replace("!q ", "");
  }

  // Return formated message
  return {
    ...event,
    message: text,
    isHighlighted: isPrize || isQuestion || isTag,
  };
}
