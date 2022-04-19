import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import {
  PostsFieldsFragment,
  useUnvoteMutation,
  useVoteMutation,
} from "../generated/graphql";

type DootBarProps = PostsFieldsFragment;

const DootBar: React.FC<DootBarProps> = (post) => {
  const [, vote] = useVoteMutation();
  const [, unvote] = useUnvoteMutation();

  const isStatusUp = post.voteStatus === 1;
  const isStatusDown = post.voteStatus === -1;

  const createOnclicker = (isUp: boolean) => () => {
    if ((isStatusUp && isUp) || (isStatusDown && !isUp)) {
      unvote({ postId: post.id });
    } else {
      vote({ postId: post.id, isUp });
    }
  };

  return (
    <Flex direction={"column"} align="center" mr={5}>
      <IconButton
        aria-label="Updoot"
        icon={<ChevronUpIcon />}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        onClick={createOnclicker(true)}
      />
      {post.points}
      <IconButton
        aria-label="Downdoot"
        icon={<ChevronDownIcon />}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        onClick={createOnclicker(false)}
      />
    </Flex>
  );
};

export { DootBar };
