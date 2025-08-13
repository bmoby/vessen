import IntroTitle from "@/components/shared/IntroTitle";

export default function HomePage() {
  return (
    <main
      style={{
        background: "#FBF9F5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IntroTitle text="VESSEN" />
    </main>
  );
}
