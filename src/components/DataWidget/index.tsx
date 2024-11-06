import React, { useEffect, useState } from "react";
import { Card, Flex, Heading, Text } from "@chakra-ui/react";

interface DataWidgetProps {
  data: string;
  title: string;
}

export default function DataWidget(props: DataWidgetProps) {
  const [data, setData] = useState(props.data);
  const [title, setTitle] = useState(props.title);

  useEffect(() => setData(props.data), [props.data]);
  useEffect(() => setTitle(props.title), [props.title]);

  return (
    <Card w="100%" p="1rem">
      <Flex w="100%" alignItems="center" justifyContent="space-between">
        <Text>{title}</Text>
        <Heading size="sm">{data}</Heading>
      </Flex>
    </Card>
  );
}
