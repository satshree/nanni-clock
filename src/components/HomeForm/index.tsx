import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { HomeType } from "@/types";
import {
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Textarea,
  Center,
  Button,
  Flex,
} from "@chakra-ui/react";

interface HomeFormProps {
  data: HomeType;
  add: boolean;
  loading: boolean;
  onSubmit: (data: HomeType) => void;
}

function HomeForm(props: HomeFormProps) {
  const [loading, setLoading] = useState(false);

  const [home, setHomeData] = useState("");
  const [homeError, setHomeError] = useState("");

  const [description, setDescription] = useState("");

  const [hourlyRate, setHourlyRate] = useState(0.0);
  const [hourlyRateError, setHourlyRateError] = useState("");

  useEffect(() => setLoading(props.loading), [props.loading]);
  useEffect(() => setHomeData(props.data.name), [props.data.name]);
  useEffect(
    () => setHourlyRate(props.data.hourlyRate),
    [props.data.hourlyRate]
  );
  useEffect(
    () => setDescription(props.data.description),
    [props.data.description]
  );

  const onHomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHomeData(e.target.value);
    setHomeError("");
  };

  const onHourlyRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHourlyRate(parseFloat(e.target.value));
    setHourlyRateError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let proceed = true;

    if (home === "") {
      setHomeError("Home Name is required!");
      proceed = false;
    }

    if (Number.isNaN(hourlyRate) || hourlyRate === 0.0) {
      setHourlyRateError("Hourly Rate is required!");
      proceed = false;
    }

    if (proceed)
      props.onSubmit({ ...props.data, name: home, hourlyRate, description });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SimpleGrid columns={{ sm: 1, md: 2 }} gap="1rem">
          <FormControl isInvalid={homeError !== ""}>
            <FormLabel>Home Name</FormLabel>
            <Input
              placeholder="Cool Name For Your Home ..."
              value={home}
              onChange={onHomeChange}
            />
            {homeError ? (
              <FormErrorMessage>{homeError}</FormErrorMessage>
            ) : (
              <FormHelperText>
                A Name for your home, or simply your Nanny&lsquo;s name
              </FormHelperText>
            )}
          </FormControl>
          <FormControl isInvalid={hourlyRateError !== ""}>
            <FormLabel>Hourly Rate</FormLabel>
            <Input
              type="number"
              step="0.1"
              min={0}
              placeholder="Hourly Rate for Nanny ..."
              value={hourlyRate}
              onChange={onHourlyRateChange}
            />
            {hourlyRateError ? (
              <FormErrorMessage>{hourlyRateError}</FormErrorMessage>
            ) : (
              <FormHelperText>Hourly Pay Rate of your Nanny</FormHelperText>
            )}
          </FormControl>
        </SimpleGrid>
        <br />
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Something Cool About Your Home ..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            resize="none"
          ></Textarea>
          <FormHelperText>
            A Short Description about your home or your Nanny
          </FormHelperText>
        </FormControl>
        <br />
        <Flex align="center" justify={props.add ? "end" : "center"}>
          <Button
            type="submit"
            colorScheme={props.add ? "green" : "blue"}
            isLoading={loading}
          >
            {props.add ? "Add" : "Save Changes"}
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default HomeForm;
