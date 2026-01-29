import { GetExecutionStatusResponse, OneClickService } from "@defuse-protocol/one-click-sdk-typescript";
import { useQuery } from "@tanstack/react-query";

const useSwapStatus = (depositAddress: string | null) => {
  //TODO: refetch token IN balance after status REFUNDED
  //TODO: refetch token OUT balance after status SUCCESS
  return useQuery<GetExecutionStatusResponse | null>({
    queryKey: ["execution-status", depositAddress],
    queryFn: async () => {
      if (!depositAddress) return null;
      const response = OneClickService.getExecutionStatus(depositAddress);
      return response;
    },
    enabled: !!depositAddress,
    refetchInterval: (query) => {
      const data = query.state.data;

      if (
        data?.status &&
        [
          GetExecutionStatusResponse.status.SUCCESS,
          GetExecutionStatusResponse.status.REFUNDED,
          GetExecutionStatusResponse.status.FAILED,
        ].includes(data.status)
      ) {
        return false;
      }
      return 3000;
    },
  });
};

export default useSwapStatus;
