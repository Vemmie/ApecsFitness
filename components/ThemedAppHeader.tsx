import React from "react";
import { Appbar, useTheme } from "react-native-paper";

// Deinfes the props that AppHeader will accept
type ThemedAppHeaderProps = {
  title: string;
  showBackButton?: boolean; // optional
  onBackPress?: () => void; // optional
  rightIcon?: string; // optional, icon name for the right action
  rightIconOnPress?: () => void; // optional, function to call when right icon is pressed
};

// Functional component for a reusable App Header
const ThemedAppHeader = ({
  title,
  showBackButton,
  onBackPress,
  rightIcon,
  rightIconOnPress,
}: ThemedAppHeaderProps) => {
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surfaceVariant }}>
      {/* Conditionally render back button */}
      {showBackButton && <Appbar.BackAction onPress={onBackPress} />}

      {/* Title in the header */}
      <Appbar.Content title={title} />
      {/* Conditionally render right icon if provided */}
      {rightIcon && (
        <Appbar.Action icon={rightIcon} onPress={rightIconOnPress} />
      )}
    </Appbar.Header>
  );
};

export default ThemedAppHeader;
