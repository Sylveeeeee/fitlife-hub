export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
      <>
      <div className="w-full h-[100] bg-[#ffffff] shadow-xl">
        <div className="container"></div>
      </div>
      <div className="">{children}</div>
      </>
    )
  }
  