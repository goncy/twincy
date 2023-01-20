import type {StackProps} from "@chakra-ui/react";
import type {Review as IReview} from "../../../types";

import {StarIcon} from "@chakra-ui/icons";
import {Stack, Image, Box, Flex, Text} from "@chakra-ui/react";

interface Props extends Omit<StackProps, "onSelect" | "onCopy"> {
  onComplete?: (review: IReview) => void;
  onRemove?: (review: IReview) => void;
  onSelect?: (review: IReview) => void;
  onCopy?: (review: IReview) => void;
  review: IReview;
}

const Review: React.FC<Props> = ({review, onSelect, onCopy, onRemove, onComplete, ...props}) => {
  return (
    <Stack alignItems="flex-start" direction="row" spacing={3}>
      <Stack
        alignItems="flex-start"
        backgroundColor={review.selected ? "primary" : "content"}
        borderRadius="md"
        cursor={onSelect ? "pointer" : "inherit"}
        display="inline-flex"
        paddingX={4}
        paddingY={2}
        spacing={1}
        width="100%"
        wordBreak="break-word"
        onClick={({ctrlKey, altKey, shiftKey}) =>
          ctrlKey
            ? onComplete?.(review)
            : altKey
            ? onCopy?.(review)
            : shiftKey
            ? onRemove?.(review)
            : onSelect?.(review)
        }
        {...props}
      >
        <Stack alignItems="center" direction="row">
          {Boolean(review.sender.badges?.length) && (
            <Stack direction="row" spacing={1}>
              {review.sender.badges?.map((badge) => (
                <Image
                  key={badge}
                  alt={badge}
                  height={5}
                  objectFit="contain"
                  src={badge}
                  width={5}
                />
              ))}
            </Stack>
          )}
          <Box
            alignItems="center"
            as="p"
            color={review.selected ? "white" : "solid"}
            dangerouslySetInnerHTML={{__html: review.sender.name}}
            display="inline-flex"
            fontSize="xl"
            fontWeight="normal"
            lineHeight="normal"
            textShadow="0 0 5px rgba(0,0,0,0.1)"
            textTransform="uppercase"
          />
          <Text color={review.selected ? "white" : "soft"} fontSize="xs">
            {new Date(Number(review.timestamp)).toLocaleTimeString()}
          </Text>
        </Stack>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={6}
          width="100%"
        >
          <Box
            as="span"
            color={review.selected ? "white" : "soft"}
            dangerouslySetInnerHTML={{__html: review.url}}
            display="inline-block"
            fontSize="xl"
            sx={{
              "& i": {
                width: 6,
                height: 6,
                marginX: 1,
                backgroundSize: "contain",
                backgroundPosition: "center",
                display: "inline-block",
                verticalAlign: "sub",
              },
            }}
          />
        </Stack>
      </Stack>
      <Flex direction="column" height={74} justifyContent="center" paddingY={1.5}>
        <StarIcon color={review.featured ? "secondary" : "translucid"} height={6} width={6} />
      </Flex>
    </Stack>
  );
};

export default Review;
