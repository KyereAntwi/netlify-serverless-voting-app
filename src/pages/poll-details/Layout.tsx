import { Outlet, useParams } from "react-router";
import useGetPollById from "../../hooks/queries/polls/useGetPollById";
import LoadingPage from "../../components/LoadingPage";
import GeneralErrorPage from "../../components/GeneralErrorPage";
import { Box, Flex } from "@chakra-ui/react";
import PollDetails from "./PollDetails";

export default function PollLayout() {
  const { workspaceId, pollId } = useParams();

  console.log(workspaceId, pollId);

  const { data, isLoading, error } = useGetPollById(Number(pollId!));

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <GeneralErrorPage
        message={`Error loading poll. Error = ${error.message}`}
      />
    );
  }

  return (
    <Flex w={"full"} h={"full"} flexDir={"column"}>
      {data && <PollDetails poll={data} />}

      <Box w={"full"} h={"full"}>
        <Outlet />
      </Box>
    </Flex>
  );
}
