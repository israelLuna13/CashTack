"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { confirmAccount } from "@/actions/confirm-account-action";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";

export default function ConfirmAccountForm() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [token, setToken] = useState("");

    //we use function bind because the function useFormState does not allow passing extra params (only prevState and formData). with bind we fix token so it will always be passed to the confirmAccount function
  const confirmAccountWithToken = confirmAccount.bind(null, token);

  const [state, dispatch] = useFormState(confirmAccountWithToken, {
    errors: [],
    success: "",
  });

//If the user finishes entering the token, the action will be executed.
//The action is performed here because there is no form to use the action.
  useEffect(() => {
    if (isComplete) {
      dispatch();
    }
  }, [isComplete,dispatch]);

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => {
        toast.error(error);
      });
    }
    if (state.success) {
      toast.success(state.success, {
        onClose: () => {
          router.push("/auth/login");
        },
      });
    }
  }, [state,router]);

  //when user is writin the token
  const handleChange = (token: string) => {
    setIsComplete(false);
    setToken(token);
  };

  //when the user finish write token
  const handleComplete = () => {
    setIsComplete(true);
  };
  return (
    <>
      <div className="flex justify-center gap-5 my-10">
        <PinInput
          value={token}
          onChange={handleChange}
          onComplete={handleComplete}
        >
          <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
          <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
          <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
          <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
          <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
          <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg text-center placeholder-white" />
        </PinInput>
      </div>
    </>
  );
}
