import { OneClickService } from "@defuse-protocol/one-click-sdk-typescript";
import { useMutation } from "@tanstack/react-query";

const useSwapSubmit = () => {
  return useMutation({
    mutationFn: OneClickService.submitDepositTx,
  });
};

export default useSwapSubmit;
