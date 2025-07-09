import React from "react";
import { Appbar, useTheme } from "react-native-paper";

// Deinfes the props that AppHeader will accept
type ThemedAppHeaderProps = {
  title: string;
  showBackButton?: boolean; // optional
  onBackPress?: () => void; // optional
};

// Functional component for a reusable App Header
const ThemedAppHeader = ({
  title,
  showBackButton,
  onBackPress,
}: ThemedAppHeaderProps) => {
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surfaceVariant }}>
      {/* Conditionally render back button */}
      {showBackButton && <Appbar.BackAction onPress={onBackPress} />}

      {/* Title in the header */}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default ThemedAppHeader;
