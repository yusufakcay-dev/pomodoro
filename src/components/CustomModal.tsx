import { Modal } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function CustomModal({ children, ...rest }: any) {
  return (
    <Modal {...rest}>
      <GestureHandlerRootView>{children}</GestureHandlerRootView>
    </Modal>
  );
}
