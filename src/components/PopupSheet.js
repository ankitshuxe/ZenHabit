import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from './BottomSheet';
import Button from './Button';
import { useHabitStore } from '../store/useHabitStore';
import { Title, Body } from './Typography';

export default function PopupSheet({ theme }) {
  const popup = useHabitStore((state) => state.popup);
  const hidePopup = useHabitStore((state) => state.hidePopup);

  if (!popup) return null;

  return (
    <BottomSheet visible={popup.visible} onClose={hidePopup} theme={theme}>
      <Title color={theme.text} style={styles.title}>{popup.title}</Title>
      
      {!!popup.message && (
        <Body color={theme.textSecondary} style={styles.message}>
          {popup.message}
        </Body>
      )}

      <View style={styles.actions}>
        {popup.actions && popup.actions.length > 0 ? (
          popup.actions.map((action, index) => (
            <Button
              key={index}
              title={action.text}
              onPress={() => {
                hidePopup();
                if (action.onPress) action.onPress();
              }}
              variant={action.style === 'destructive' ? 'danger' : action.style === 'cancel' ? 'outline' : 'primary'}
              theme={theme}
              style={{ flex: 1 }}
            />
          ))
        ) : (
          <Button
            title="OK"
            onPress={hidePopup}
            variant="primary"
            theme={theme}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
  message: {
    marginBottom: 28,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20
  }
});
