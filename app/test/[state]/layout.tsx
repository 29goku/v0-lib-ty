import { getAllStateCodes } from "@/lib/states"

export async function generateStaticParams() {
  return getAllStateCodes().map((code) => ({
    state: code,
  }))
}

export default function StateTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
