import { useAtom } from "jotai";
import { Heading, Text, Container, Flex, Button } from "@radix-ui/themes";
import { countAtom } from "@/store/atoms";

export function HomePage() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <Container size="2" className="py-16">
      <Flex direction="column" gap="6" align="center">
        <Heading size="8" className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Image Asset Manager
        </Heading>

        <Text size="3" color="gray">
          React · TypeScript · Vite · React Router · Tailwind v4 · Jotai · Radix UI
        </Text>

        <Flex gap="3" align="center">
          <Button
            size="3"
            variant="soft"
            onClick={() => setCount((c) => c - 1)}
          >
            −
          </Button>

          <Text size="5" weight="bold" className="min-w-12 text-center tabular-nums">
            {count}
          </Text>

          <Button
            size="3"
            variant="soft"
            onClick={() => setCount((c) => c + 1)}
          >
            +
          </Button>
        </Flex>

        <Text size="2" color="gray">
          Counter backed by Jotai state. All systems go.
        </Text>
      </Flex>
    </Container>
  );
}
