import { extendTheme } from "@chakra-ui/react";
import "@fontsource/nunito-sans/300.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/700.css";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "941930",
    },
  },
  fonts: {
    body: "Nunito Sans",
  },
  styles: { global: () => ({ body: { bg: "gray.200" } }) },
});
