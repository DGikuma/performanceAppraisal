import { Toast, ToastProps } from "./toast";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-full max-w-sm">
      {toasts.map((props) => (
        <Toast key={props.id} {...(props as ToastProps)} />
      ))}
    </div>
  );
}
