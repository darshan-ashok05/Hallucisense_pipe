interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Analyzing response...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-brand-500 animate-spin-slow" />
      </div>
      <p className="mt-4 text-sm text-gray-400 font-medium">{message}</p>
    </div>
  );
}
