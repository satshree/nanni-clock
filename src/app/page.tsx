"use client";

import Image from "next/image";
// import { useRouter } from "next/navigation";
import {
  Button,
  // Center,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { auth } from "@/firebase";
import { AuthType } from "@/types";
import {
  saveAuthStateToLocalStorage,
  loadAuthStateFromLocalStorage,
  removeAuthStateFromLocalStorage,
} from "@/utils/storage";

import invoice from "@/assets/img/invoice.svg";
import { useEffect } from "react";

export default function Home() {
  const toast = useToast();
  // const router = useRouter();

  useEffect(() => {
    const existingAuth: AuthType = loadAuthStateFromLocalStorage();

    if (existingAuth.token !== "") {
      routeHome();
    }
  }, []);

  const routeHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/home";
    }
    // else {
    //   router.push("/home");
    // }
  };

  const signIn = () =>
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const credential = await app.auth().currentUser.getIdToken(/* forceRefresh */ true)
        const accessToken = await result.user.getIdToken();

        const appAuth: AuthType = {
          token: accessToken || "",
          user: result.user,
        };

        saveAuthStateToLocalStorage(appAuth);

        routeHome();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log("ERROR", errorCode);
        console.log("ERROR", errorMessage);

        toast({
          // title: "Something went wrong",
          description: errorMessage,
          status: "error",
          isClosable: true,
          position: "bottom-left",
        });
      });

  return (
    <>
      <Flex
        flexDirection="column"
        h="100%"
        align="center"
        justify="center"
        p="1rem"
      >
        <VStack spacing="1rem">
          <Image
            src={invoice.src}
            width={450}
            height={450}
            alt="Nanny Clock Invoice"
          />
          <Heading size="md">Nanny Clock</Heading>
          <Text textAlign="center">
            Clock in your nanny&lsquo;s work and generate invoices easily
          </Text>
          <Button
            // w="100"
            variant="outline"
            colorScheme="blue"
            leftIcon={<FcGoogle fontSize="24px" />}
            iconSpacing="0.5rem"
            onClick={signIn}
          >
            Continue with Google
          </Button>
        </VStack>
      </Flex>
    </>
  );
}
