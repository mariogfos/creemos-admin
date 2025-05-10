import "../../styles/theme.css";
import "../../styles/utils.css";

export default function PublicLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen bg-gray-50">

        <main>{children}</main>

      </div>
    )
  }