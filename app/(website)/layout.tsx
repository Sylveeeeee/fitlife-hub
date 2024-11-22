
export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
      <>
      <div className="w-full h-[90] bg-[transparent] ">
        <div className="Home text-black py-[30px] w-auto pl-[600] pr-[10px] text-[12px] px-[10px] flex justify-start ... ">
          <div className = "flex-[0.2] mx-[10] py-[10]  text-center hover:bg-[#0c6478] hover:text-white rounded-[40px] mx-[10px]">HOME</div>
          <div className = "flex-[0.2] py-[10] text-center hover:bg-[#0c6478] hover:text-white rounded-[40px] mx-[10px]">ABOUT</div>
          <div className = "flex-[0.2] py-[10] text-center hover:bg-[#0c6478] hover:text-white rounded-[40px] mx-[10px]">BMI</div>
          <div className = "flex-[0.2] py-[10] text-center hover:bg-[#0c6478] hover:text-white rounded-[40px] mx-[10px] ">SETTING</div>
          <div className = "flex-[0.2] py-[10] bg-[#213A58] text-white  text-center rounded-[40px] mx-[10px] hover:text-[#213A58] hover:bg-[#ffffff] hover:rounded-[40px] hover:border-solid border-2 border-[#213A58] ...">PROFILE</div>

        </div>
        
      </div>
      <div className="">{children}</div>
      </>
    )
  }
  
