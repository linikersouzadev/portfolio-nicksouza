export function Footer() {
  return (
    <footer className="bg-[--color-bg]">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-8 py-6 text-sm text-[--color-text-muted] md:px-10">
        <p
          className="italic"
          style={{ fontFamily: "var(--font-display)" }}
        >
          © {new Date().getFullYear()} Nick Souza. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
