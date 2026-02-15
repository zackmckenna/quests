// Force edge runtime for this route
export const runtime = "edge";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
