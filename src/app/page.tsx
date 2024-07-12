import Form from "./components/Form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="container">
        <div className="main-section pt-16">
          <h1 className="text-center text-5xl mb-6 font-bold text-slate-900  dark:text-gray-100">PLN Bot</h1>
          <div className="app-section">
            <Form />
          </div>
        </div>
      </div>
    </main>
  );
}
