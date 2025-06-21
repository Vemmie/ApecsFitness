import React from "react";
import { Appbar, useTheme } from "react-native-paper";

// Deinfes the props that AppHEader will accept
type AppHeaderProps = {
  title: string;
  showBackButton?: boolean; // optional
  onBackPress?: () => void; // optional
};

// Functional component for a reusable App Header
const AppHeader = ({ title, showBackButton, onBackPress }: AppHeaderProps) => {
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
      {/* Conditionally render back button */}
      {showBackButton && <Appbar.BackAction onPress={onBackPress} />}

      {/* Title in the header */}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default AppHeader;
