import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">YT Summarizer</h1>
          <p className="text-dark-400">
            Resume videos largos de YouTube en minutos
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
